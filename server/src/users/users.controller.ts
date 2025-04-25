// user.controller.ts
import {
  Controller,
  Get,
  Query,
  UseGuards,
  Req,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { Request } from 'express';
import { throwError } from 'src/common/utils/helpers';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  getUsers(@Query() paginationDto: PaginationDto) {
    return this.userService.getUsers(paginationDto);
  }

  @Get('current-user')
  @UseGuards(AuthGuard)
  @Roles(...Object.values(Role))
  getCurrentUser(@Req() request: Request) {
    if (!request.user) {
      throw throwError('Unauthorized Access', HttpStatus.UNAUTHORIZED);
    }
    return {
      success: true,
      message: 'Current User',
      data: request.user,
    };
  }
}
