import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { PrismaService } from 'src/common/services/prisma.service';
import { StorageService } from 'src/common/services/storage.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService, PrismaService, StorageService],
})
export class ProductModule {}
