import { Category, PrismaClient, Product, Role, User } from "@prisma/client";
import { ProductController } from "../product.controller";
import { cleanUp, mockImage } from "src/common/_spec/utils";
import { Test, TestingModule } from "@nestjs/testing";
import { JwtModule } from "@nestjs/jwt";
import { ProductService } from "../product.service";
import { PrismaService } from "src/common/services/prisma.service";
import { StorageService } from "src/common/services/storage.service";
import { createUserBodyFactory } from "src/common/factories/user.factory";
import { faker } from "@faker-js/faker/.";


describe('ProductController', () => {
  let productController: ProductController;
  let prisma: PrismaClient;
  let user: User;
  let mockReq: any;

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
      controllers: [ProductController],
      providers: [
        ProductService,
        PrismaService,
        StorageService,
      ],
    }).compile();

    user = await prisma.user.create({
      data: {
        ...createUserBodyFactory({role: Role.ADMIN
        })
      }
    });

    mockReq = {
      user: { id: user.id },
    }

    productController = app.get<ProductController>(ProductController);
  });
  describe('createProduct', () => {
    it('should throw an error if no image', async () => {
        const category = await prisma.category.create({
            data: {
            name: faker.commerce.department(),  
            slug: faker.helpers.slugify(faker.commerce.department().toLowerCase()),
            image: 'test.jpg',
            },
        });

      const productData = {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price()), 
        stock: faker.number.int({ min: 0, max: 100 }),
        categoryId: category.id,
      };

      await expect(productController.createProduct(mockReq, productData, [])).rejects.toThrow();
    });
  });
});