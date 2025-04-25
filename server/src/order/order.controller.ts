import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { Request } from 'express';
import {
  CreateOrderDto,
  ChangeOrderStatusDto,
  OrderQueryDto,
} from './dto/order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('add')
  @UseGuards(AuthGuard)
  createOrder(@Req() request: Request, @Body() createOrderDto: CreateOrderDto) {
    const userId = request.user?.id;
    return this.orderService.createOrder(createOrderDto, userId);
  }

  @Get()
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  getAllOrders(@Query() orderQueryDto: OrderQueryDto) {
    return this.orderService.getAllOrders(orderQueryDto);
  }

  @Patch(':id/status')
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  changeOrderStatus(
    @Param('id') id: string,
    @Body() changeOrderStatusDto: ChangeOrderStatusDto,
  ) {
    return this.orderService.changeOrderStatus(id, changeOrderStatusDto);
  }

  @Get(':id')
  getOrderDetails(@Param('id') id: string) {
    return this.orderService.getOrderDetails(id);
  }
}
