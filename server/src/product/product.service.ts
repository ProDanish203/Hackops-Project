import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { StorageService } from 'src/common/services/storage.service';
import { throwError } from 'src/common/utils/helpers';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductQueryDto,
} from './dto/product.dto';
import { MulterFile } from 'src/common/types/type';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  async createProduct(
    createProductDto: CreateProductDto,
    images: MulterFile[],
  ) {
    try {
      const { name, description, price, categoryId, stock } = createProductDto;

      if (!name || !description || !price || !categoryId) {
        throw throwError('All fields are required', HttpStatus.BAD_REQUEST);
      }

      const category = await this.prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        throw throwError('Category not found', HttpStatus.NOT_FOUND);
      }

      if (!images || images.length === 0)
        throw throwError('Images are required', HttpStatus.BAD_REQUEST);

      const imageFilenames: string[] = await Promise.all(
        images.map(async (image) => {
          const uploadResult = await this.storageService.uploadFile(image);
          return uploadResult ? uploadResult.filename : null;
        }),
      ).then((results) => results.filter((filename) => filename !== null));

      const product = await this.prisma.product.create({
        data: {
          name,
          description,
          price: parseFloat(price.toString()),
          categoryId,
          stock: stock ? parseFloat(price.toString()) : 0,
          images: imageFilenames,
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!product) {
        throw throwError(
          'Product not created',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return {
        success: true,
        message: 'Product created successfully',
        data: product,
      };
    } catch (error) {
      console.error(error);
      throw throwError(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updateProduct(
    id: string,
    updateProductDto: UpdateProductDto,
    images?: MulterFile[],
  ) {
    try {
      const { name, description, price, stock, categoryId } = updateProductDto;

      const existingProduct = await this.prisma.product.findUnique({
        where: { id },
      });

      if (!existingProduct)
        throw throwError('Product not found', HttpStatus.NOT_FOUND);

      if (categoryId) {
        const category = await this.prisma.category.findUnique({
          where: { id: categoryId },
        });

        if (!category)
          throw throwError('Category not found', HttpStatus.NOT_FOUND);
      }

      let imageFilenames = existingProduct.images;
      if (images && images.length > 0) {
        await Promise.all(
          existingProduct.images.map((image) =>
            this.storageService.removeFile(image),
          ),
        );

        imageFilenames = await Promise.all(
          images.map(async (image) => {
            const uploadResult = await this.storageService.uploadFile(image);
            return uploadResult ? uploadResult.filename : null;
          }),
        ).then((results) => results.filter((filename) => filename !== null));
      }

      const updatedProduct = await this.prisma.product.update({
        where: { id },
        data: {
          name,
          description,
          price: price ? parseFloat(price.toString()) : undefined,
          stock: stock ? parseFloat(stock.toString()) : undefined,
          categoryId,
          images: imageFilenames,
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return {
        success: true,
        message: 'Product updated successfully',
        data: updatedProduct,
      };
    } catch (error) {
      console.error(error);
      throw throwError(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteProduct(id: string) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id },
      });

      if (!product) throw throwError('Product not found', HttpStatus.NOT_FOUND);

      const deletedProduct = await this.prisma.product.delete({
        where: { id },
      });

      await Promise.all(
        product.images.map((image) => this.storageService.removeFile(image)),
      );

      return {
        success: true,
        message: 'Product deleted successfully',
        data: deletedProduct,
      };
    } catch (error) {
      console.error(error);
      throw throwError(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getProducts(productQueryDto: ProductQueryDto) {
    try {
      const {
        page = 1,
        limit = 10,
        search = '',
        filter = '',
      } = productQueryDto;

      const skip = (page - 1) * limit;

      let sortDirection: 'asc' | 'desc' = 'asc';
      if (filter.toLowerCase() === 'ztoa') {
        sortDirection = 'desc';
      }

      const whereCondition: Prisma.ProductWhereInput = {
        name: {
          startsWith: search,
          mode: 'insensitive',
        },
      };

      const total = await this.prisma.product.count({
        where: whereCondition,
      });

      const products = await this.prisma.product.findMany({
        where: whereCondition,
        skip,
        take: Number(limit),
        orderBy: {
          name: sortDirection,
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      const productsWithImageUrls = products.map((product) => ({
        ...product,
        imageUrls: product.images.map((image) =>
          this.storageService.getImageUrl(image),
        ),
      }));

      const pagination = {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      };

      return {
        success: true,
        message: 'All Products fetched',
        data: productsWithImageUrls,
        pagination,
      };
    } catch (error) {
      console.error(error);
      throw throwError(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getProductById(id: string) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id },
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!product) throw throwError('Product not found', HttpStatus.NOT_FOUND);

      const productWithImageUrls = {
        ...product,
        imageUrls: product.images.map((image) =>
          this.storageService.getImageUrl(image),
        ),
      };

      return {
        success: true,
        message: 'Product found',
        data: productWithImageUrls,
      };
    } catch (error) {
      console.error(error);
      throw throwError(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getProductsByCategory(
    categoryId: string,
    productQueryDto: ProductQueryDto,
  ) {
    try {
      const {
        page = 1,
        limit = 10,
        search = '',
        filter = '',
      } = productQueryDto;

      const category = await this.prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!category)
        throw throwError('Category not found', HttpStatus.NOT_FOUND);

      const skip = (page - 1) * limit;

      let sortDirection: 'asc' | 'desc' = 'asc';
      if (filter.toLowerCase() === 'ztoa') {
        sortDirection = 'desc';
      }

      const whereCondition: Prisma.ProductWhereInput = {
        name: {
          startsWith: search,
          mode: 'insensitive',
        },
        categoryId,
      };

      const total = await this.prisma.product.count({
        where: whereCondition,
      });

      const products = await this.prisma.product.findMany({
        where: whereCondition,
        skip,
        take: Number(limit),
        orderBy: {
          name: sortDirection,
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      const productsWithImageUrls = products.map((product) => ({
        ...product,
        imageUrls: product.images.map((image) =>
          this.storageService.getImageUrl(image),
        ),
      }));

      const pagination = {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      };

      return {
        success: true,
        message: 'Products found',
        data: productsWithImageUrls,
        pagination,
      };
    } catch (error) {
      console.error(error);
      throw throwError(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
