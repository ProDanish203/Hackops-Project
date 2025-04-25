import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsNotEmpty({ message: 'Product Name is required' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Product Description is required' })
  @IsString()
  description: string;

  @IsNotEmpty({ message: 'Product Price is required' })
  @IsNumber()
  @Type(() => Number)
  price: number;

  @IsNotEmpty({ message: 'Product Category is required' })
  @IsString()
  categoryId: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  stock?: number = 0;
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  price?: number;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  stock?: number;
}

export class ProductQueryDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  search?: string = '';

  @IsOptional()
  @IsString()
  filter?: string = '';
}
