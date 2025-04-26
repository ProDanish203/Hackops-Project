import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { Prisma, PrismaClient, Role } from '@prisma/client';
import { faker } from '@faker-js/faker/.';
import { PrismaService } from 'src/common/services/prisma.service';
import { cleanUp } from 'src/common/_spec/utils';
import { HttpStatus } from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { createUserBodyFactory } from 'src/common/factories/user.factory';

jest.mock('src/common/guards/auth.guard', () => {
  return {
    AuthGuard: jest.fn().mockImplementation(() => {
      return {
        canActivate: jest.fn().mockReturnValue(true),
      };
    }),
  };
});

describe('UsersController', () => {
  let usersController: UsersController;
  let prisma: PrismaClient;

  beforeAll(async () => {
    prisma = new PrismaClient();
    await cleanUp(prisma);
  });

  afterEach(async () => {
    await cleanUp(prisma);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          global: true,
          secret: process.env.JWT_SECRET || 'test-secret',
          signOptions: { expiresIn: process.env.JWT_EXPIRY || '1h' },
        }),
      ],
      controllers: [UsersController],
      providers: [
        UsersService, 
        PrismaService, 
        {
          provide: Reflector,
          useValue: {
            get: jest.fn().mockReturnValue([Role.ADMIN, Role.USER]),
          },
        }
      ],
    }).compile();

    usersController = app.get<UsersController>(UsersController);
  });

  describe('getUsers', () => {
    describe('isOk', () => {
      test('should return users with pagination', async () => {
        await prisma.user.create({
          data: {
            ...createUserBodyFactory()
          },
        })

        const paginationDto: PaginationDto = {
          page: 1,
          limit: 10,
        };

        const mockReq = {
          user: {
            id: 'admin-user-id',
            role: Role.ADMIN,
          },
        };

        const result = await usersController.getUsers(paginationDto);
        expect(result).toBeDefined();
        expect(result.success).toBe(true);
      });
    });
  });

  describe('getCurrentUser', () => {
    describe('isOk', () => {
      test('should return current user data', async () => {
        const userId = 'test-user-id';
        const mockUser = {
          id: userId,
          name: faker.person.fullName(),
          email: faker.internet.email(),
          role: Role.USER,
        };

        const mockRequest = {
          user: mockUser,
        };

        const result = await usersController.getCurrentUser(mockRequest as any);
        expect(result).toBeDefined();
        expect(result.success).toBe(true);
        expect(result.message).toBe('Current User');
        expect(result.data).toEqual(mockUser);
      });
    });

    describe('isErr', () => {
      test('should throw error when no user in request', async () => {
        const mockRequest = {};

        try {
          await usersController.getCurrentUser(mockRequest as any);
          fail('Expected an error to be thrown');
        } catch (error) {
          expect(error).toBeDefined();
          expect(error.status).toBe(HttpStatus.UNAUTHORIZED);
          expect(error.message).toBe('Unauthorized Access');
        }
      });
    });
  });
});