// category.service.ts
import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { StorageService } from 'src/common/services/storage.service';
import { throwError } from 'src/common/utils/helpers';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryQueryDto,
} from './dto/category.dto';
import { MulterFile } from 'src/common/types/type';
import { Prisma } from '@prisma/client';

@Injectable()
export class CategoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  async createCategory(
    createCategoryDto: CreateCategoryDto,
    image: MulterFile,
    userId: string,
    parentCategoryId?: string,
  ) {
    try {
      const { name, description, slug } = createCategoryDto;

      if (!name) {
        throw throwError('Category Name is required', HttpStatus.BAD_REQUEST);
      }
      if (!slug) {
        throw throwError('Category Slug is required', HttpStatus.BAD_REQUEST);
      }

      // Check if parent category exists
      if (parentCategoryId) {
        const parentCategory = await this.prisma.category.findUnique({
          where: { id: parentCategoryId },
        });
        if (!parentCategory) {
          throw throwError('Parent category not found', HttpStatus.NOT_FOUND);
        }
      }

      // Upload image
      const imageUpload = await this.storageService.uploadFile(image);
      if (!imageUpload) {
        throw throwError(
          'Failed to upload image',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const category = await this.prisma.category.create({
        data: {
          name,
          description,
          slug,
          image: imageUpload.filename,
          parentCategoryId: parentCategoryId || null,
          createdById: userId,
        },
      });

      if (!category) {
        throw throwError(
          'An unexpected error occurred while creating category',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return {
        success: true,
        message: 'Category created successfully',
        data: category,
      };
    } catch (error) {
      console.error(error);
      throw throwError(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getCategories(categoryQueryDto: CategoryQueryDto) {
    try {
      const {
        page = 1,
        limit = 10,
        search = '',
        filter = '',
        parentId = null,
      } = categoryQueryDto;

      const skip = (page - 1) * limit;

      let sortDirection: 'asc' | 'desc' = 'asc';
      if (filter.toLowerCase() === 'ztoa') {
        sortDirection = 'desc';
      }

      const whereCondition: Prisma.CategoryWhereInput = {
        name: {
          startsWith: search,
          mode: 'insensitive',
        },
        parentCategoryId: parentId || null,
      };

      const total = await this.prisma.category.count({
        where: whereCondition,
      });

      const categories = await this.prisma.category.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: {
          name: sortDirection,
        },
      });

      const categoriesWithImageUrls = categories.map((category) => ({
        ...category,
        imageUrl: this.storageService.getImageUrl(category.image),
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
        message: '',
        data: categoriesWithImageUrls,
        pagination,
      };
    } catch (error) {
      console.error(error);
      throw throwError(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updateCategory(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    image?: MulterFile,
    parentCategoryId?: string,
  ) {
    try {
      const { name, description, slug } = updateCategoryDto;

      const categoryToUpdate = await this.prisma.category.findUnique({
        where: { id },
      });

      if (!categoryToUpdate) {
        throw throwError('Category not found', HttpStatus.NOT_FOUND);
      }

      let imageFilename = categoryToUpdate.image;
      if (image) {
        const imageUpload = await this.storageService.uploadFile(image);
        if (!imageUpload) {
          throw throwError(
            'Failed to upload image',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }

        await this.storageService.removeFile(categoryToUpdate.image);

        imageFilename = imageUpload.filename;
      }

      const updatedCategory = await this.prisma.category.update({
        where: { id },
        data: {
          name,
          description,
          slug,
          image: imageFilename,
          parentCategoryId: parentCategoryId || null,
        },
      });

      return {
        success: true,
        message: 'Category updated successfully',
        data: updatedCategory,
      };
    } catch (error) {
      console.error(error);
      throw throwError(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteCategory(id: string) {
    try {
      const categoryToDelete = await this.prisma.category.findUnique({
        where: { id },
      });

      if (!categoryToDelete)
        throw throwError('Category not found', HttpStatus.NOT_FOUND);

      await this.prisma.category.updateMany({
        where: { parentCategoryId: id },
        data: { parentCategoryId: null },
      });

      const deletedCategory = await this.prisma.category.delete({
        where: { id },
      });

      await this.storageService.removeFile(categoryToDelete.image);

      return {
        success: true,
        message: 'Category deleted successfully',
        data: deletedCategory,
      };
    } catch (error) {
      console.error(error);
      throw throwError(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getCategoryNames() {
    try {
      const categories = await this.prisma.category.findMany({
        select: {
          id: true,
          name: true,
        },
      });

      if (!categories) {
        throw throwError('Categories not found', HttpStatus.NOT_FOUND);
      }

      return {
        success: true,
        message: 'Categories retrieved successfully',
        data: categories,
      };
    } catch (error) {
      console.error(error);
      throw throwError(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
