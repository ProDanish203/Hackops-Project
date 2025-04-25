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
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryQueryDto,
} from './dto/category.dto';
import { MulterFile } from 'src/common/types/type';
import { throwError } from 'src/common/utils/helpers';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  createCategory(
    @Req() request: Request,
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() image: MulterFile,
    @Query('parentCategory') parentCategory?: string,
  ) {
    if (!request.user) {
      throw throwError('Unauthorized Access', HttpStatus.UNAUTHORIZED);
    }
    return this.categoryService.createCategory(
      createCategoryDto,
      image,
      request.user.id,
      parentCategory,
    );
  }

  @Get()
  getCategories(@Query() categoryQueryDto: CategoryQueryDto) {
    return this.categoryService.getCategories(categoryQueryDto);
  }

  @Get('names')
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  getCategoryNames(@Req() request: Request) {
    if (!request.user) {
      throw throwError('Unauthorized Access', HttpStatus.UNAUTHORIZED);
    }
    return this.categoryService.getCategoryNames();
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @UploadedFile() image?: MulterFile,
    @Query('parentCategory') parentCategory?: string,
  ) {
    return this.categoryService.updateCategory(
      id,
      updateCategoryDto,
      image,
      parentCategory,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  deleteCategory(@Param('id') id: string) {
    return this.categoryService.deleteCategory(id);
  }
}
