import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from '../order.controller';
import { OrderService } from '../order.service';
import { PrismaClient, OrderStatus, PaymentMethod, Role, User, Category, Product } from '@prisma/client';
import { faker } from '@faker-js/faker/.';
import { PrismaService } from 'src/common/services/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { StorageService } from 'src/common/services/storage.service';
import { CreateOrderDto, ChangeOrderStatusDto } from '../dto/order.dto';
import { cleanUp } from 'src/common/_spec/utils';
import { randomBytes } from 'crypto';
import { createUserBodyFactory } from 'src/common/factories/user.factory';
import { createOrderBodyFactoryWithProductAndUser } from 'src/common/factories/order.factory';

const mockStorageService = {
  uploadFile: jest.fn().mockResolvedValue('mock-file-url'),
  deleteFile: jest.fn().mockResolvedValue(true),
  getImageUrl: jest.fn().mockReturnValue('mock-image-url'),
};

describe('OrderController', () => {
  let orderController: OrderController;
  let prisma: PrismaClient;
  let user: User;
  let mockReq: any;
  let category: Category;
  let product: Product

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
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: process.env.JWT_EXPIRY },
        }),
      ],
      controllers: [OrderController],
      providers: [
        OrderService,
        PrismaService,
        {
          provide: StorageService,
          useValue: mockStorageService,
        },
      ],
    }).compile();

    user = await prisma.user.create({
      data: {
        ...createUserBodyFactory()
      }
    });

    category = await prisma.category.create({
      data: {
        name: faker.commerce.department(),  
        slug: faker.helpers.slugify(faker.commerce.department().toLowerCase()),
        image: 'test.jpg',
      },
    });

    product = await prisma.product.create({
      data: {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.number.int({ min: 10, max: 1000 }),
        stock: faker.number.int({ min: 1, max: 100 }),
        images: ['test.jpg'],
        categoryId: category.id
      },
    });

    mockReq = {
      user: { id: user.id },
    }

    orderController = app.get<OrderController>(OrderController);
  });
  describe('Get All Orders', () => {
    describe('isOk', () => {
      test('default', async () => {
        const admin = await prisma.user.create({
          data: {
            email: faker.internet.email(),
            name: faker.person.fullName(),
            password: faker.internet.password(),
            profileImage: 'test.jpg',
            salt: randomBytes(16).toString('hex'),
            role: Role.ADMIN,
          },
        });

        const mockReq = {
          user: { id: admin.id, role: Role.ADMIN },
        };

        const result = await orderController.getAllOrders({});
        expect(result).toBeDefined();
        expect(result.success).toBe(true);
        expect(result.message).toBe('Orders fetched successfully');
        expect(Array.isArray(result.data)).toBe(true);
      });
    });

    describe('isErr', () => {
      test('non-admin access', async () => {
        try {
          await orderController.getAllOrders({});
        } catch (error) {
          expect(error.status).toBe(401);
          expect(error.message).toBe('Unauthorized Access');
        }
      });
    });
  });
});