import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { PrismaService } from 'src/common/services/prisma.service';
import { StorageService } from 'src/common/services/storage.service';

@Module({
  controllers: [OrderController],
  providers: [OrderService, PrismaService, StorageService],
})
export class OrderModule {}
