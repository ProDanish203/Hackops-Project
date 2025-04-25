import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { throwError } from 'src/common/utils/helpers';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getUsers({
    page = 1,
    limit = 10,
    search = '',
    filter = '',
  }: PaginationDto) {
    try {
      const skip = (page - 1) * limit;

      let sortDirection: 'asc' | 'desc' = 'asc';
      if (filter.toLowerCase() === 'ztoa') {
        sortDirection = 'desc';
      }

      const total = await this.prisma.user.count({
        where: {
          name: {
            startsWith: search,
            mode: 'insensitive',
          },
        },
      });

      const users = await this.prisma.user.findMany({
        where: {
          name: {
            startsWith: search,
            mode: 'insensitive',
          },
        },
        skip,
        take: Number(limit),
        orderBy: {
          name: sortDirection,
        },
        select: {
          id: true,
          name: true,
          email: true,
          profileImage: true,
          role: true,
          loginProvider: true,
          isEmailVerified: true,
          lastLoginAt: true,
          lastActiveAt: true,
          createdAt: true,
          updatedAt: true,
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
        message: '',
        data: users,
        pagination,
      };
    } catch (error) {
      throw throwError(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
