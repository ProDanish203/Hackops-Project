import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFiles,
  HttpStatus,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductQueryDto,
} from './dto/product.dto';
import { Request } from 'express';
import { MulterFile } from 'src/common/types/type';
import { throwError } from 'src/common/utils/helpers';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(FilesInterceptor('images', 10))
  createProduct(
    @Req() request: Request,
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() images: MulterFile[],
  ) {
    if (!request.user) {
      throw throwError('Unauthorized Access', HttpStatus.UNAUTHORIZED);
    }
    return this.productService.createProduct(createProductDto, images);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(FilesInterceptor('images', 10))
  updateProduct(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() images?: MulterFile[],
  ) {
    if (!request.user) {
      throw throwError('Unauthorized Access', HttpStatus.UNAUTHORIZED);
    }
    return this.productService.updateProduct(id, updateProductDto, images);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  deleteProduct(@Req() request: Request, @Param('id') id: string) {
    if (!request.user) {
      throw throwError('Unauthorized Access', HttpStatus.UNAUTHORIZED);
    }
    return this.productService.deleteProduct(id);
  }

  @Get()
  getProducts(@Query() productQueryDto: ProductQueryDto) {
    return this.productService.getProducts(productQueryDto);
  }

  @Get(':id')
  getProductById(@Param('id') id: string) {
    return this.productService.getProductById(id);
  }

  @Get('category/:id')
  getProductsByCategory(
    @Param('id') categoryId: string,
    @Query() productQueryDto: ProductQueryDto,
  ) {
    return this.productService.getProductsByCategory(
      categoryId,
      productQueryDto,
    );
  }
}
