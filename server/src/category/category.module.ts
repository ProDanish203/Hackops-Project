import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { StorageService } from 'src/common/services/storage.service';
import { PrismaService } from 'src/common/services/prisma.service';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, PrismaService, StorageService],
})
export class CategoryModule {}
