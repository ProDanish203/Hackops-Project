import { HttpStatus, Injectable, HttpException } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { StorageService } from 'src/common/services/storage.service';
import { throwError } from 'src/common/utils/helpers';
import {
  CreateOrderDto,
  ChangeOrderStatusDto,
  OrderQueryDto,
} from './dto/order.dto';
import { Prisma } from '@prisma/client';
import { generateTrackingNumber } from 'src/common/utils/helpers';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto, userId?: string) {
    try {
      const {
        orderItems,
        couponCode,
        discount,
        shippingAddress,
        billingAddress,
        paymentMethod,
        name,
        email,
        phone,
        notes,
      } = createOrderDto;

      if (!orderItems || !paymentMethod || !shippingAddress || !billingAddress)
        throw throwError('All fields are required', HttpStatus.BAD_REQUEST);

      const shippingAddressRecord = await this.prisma.address.create({
        data: shippingAddress,
      });

      const billingAddressRecord = await this.prisma.address.create({
        data: billingAddress,
      });

      let totalAmount = 0;
      const trackingNumber = generateTrackingNumber();

      const order = await this.prisma.order.create({
        data: {
          totalAmount: 0,
          couponCode,
          discount,
          paymentMethod,
          trackingNumber,
          name,
          email,
          phone,
          notes,
          customerId: userId || null,
          shippingAddressId: shippingAddressRecord.id,
          billingAddressId: billingAddressRecord.id,
          orderStatus: 'pending',
          paymentStatus: 'pending',
        },
      });

      for (const item of orderItems) {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
        });

        if (!product)
          throw throwError('Product not found', HttpStatus.NOT_FOUND);

        const itemTotal = product.price * item.quantity;
        totalAmount += itemTotal;

        await this.prisma.orderItem.create({
          data: {
            quantity: item.quantity,
            price: product.price,
            itemTotal,
            productId: product.id,
            orderId: order.id,
          },
        });
      }

      const updatedOrder = await this.prisma.order.update({
        where: { id: order.id },
        data: { totalAmount },
      });

      return {
        success: true,
        message: 'Order has been placed successfully',
        data: updatedOrder,
      };
    } catch (error) {
      console.error(error);
      throw throwError(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async changeOrderStatus(
    id: string,
    changeOrderStatusDto: ChangeOrderStatusDto,
  ) {
    try {
      const { status } = changeOrderStatusDto;

      const order = await this.prisma.order.findUnique({
        where: { id },
      });

      if (!order) throw throwError('Order not found', HttpStatus.NOT_FOUND);

      const updatedOrder = await this.prisma.order.update({
        where: { id },
        data: { orderStatus: status },
      });

      return {
        success: true,
        message: 'Order status updated successfully',
        data: updatedOrder,
      };
    } catch (error) {
      console.error(error);
      if (error instanceof HttpException) {
        throw error; // Preserve the original error
      }
      throw throwError(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getAllOrders(orderQueryDto: OrderQueryDto) {
    try {
      const { page = 1, limit = 10, search = '', status } = orderQueryDto;
      const skip = (page - 1) * limit;

      const whereCondition: Prisma.OrderWhereInput = {};

      if (search)
        whereCondition.trackingNumber = {
          startsWith: search,
          mode: 'insensitive',
        };

      if (status) whereCondition.orderStatus = status;

      const total = await this.prisma.order.count({
        where: whereCondition,
      });

      const orders = await this.prisma.order.findMany({
        where: whereCondition,
        skip,
        take: Number(limit),
        orderBy: [{ createdAt: 'desc' }],
        select: {
          id: true,
          trackingNumber: true,
          name: true,
          orderStatus: true,
          createdAt: true,
          totalAmount: true,
          customer: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

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
        message: 'Orders fetched successfully',
        data: orders,
        pagination,
      };
    } catch (error) {
      console.error(error);
      throw throwError(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getOrderDetails(id: string) {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          orderItems: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  images: true,
                },
              },
            },
          },
          shippingAddress: true,
          billingAddress: true,
        },
      });

      if (!order) throw throwError('Order not found', HttpStatus.NOT_FOUND);

      const orderWithImages = {
        ...order,
        orderItems: order.orderItems.map((item) => ({
          ...item,
          product: {
            ...item.product,
            coverImage:
              item.product.images.length > 0
                ? this.storageService.getImageUrl(item.product.images[0])
                : null,
          },
        })),
      };

      orderWithImages.orderItems.forEach((item) => {
        if (item.product) delete item.product.images;
      });

      return {
        success: true,
        message: 'Order details fetched successfully',
        data: orderWithImages,
      };
    } catch (error) {
      console.error(error);
      if (error instanceof HttpException) {
        throw error; // Preserve the original error
      }
      throw throwError(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
