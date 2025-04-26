import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from '../category.controller';
import { CategoryService } from '../category.service';
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker'; // Fixed the import syntax
import { PrismaService } from 'src/common/services/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { StorageService } from 'src/common/services/storage.service';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto';
import { cleanUp } from 'src/common/_spec/utils';
import { mockImage } from 'src/common/_spec/utils';

type MulterFile = {
  buffer: Buffer;
  encoding: string;
  fieldname: string;
  mimetype: string;
  originalname: string;
  size: number;
  filename: string;
};

describe('CategoryController', () => {
  let categoryController: CategoryController;
  let prismaService: PrismaService;
  let prisma: PrismaClient;

  const mockUserId = '12345678-1234-1234-1234-123456789012';
  
  const defaultUser = {
    id: mockUserId,
    role: 'ADMIN',
    email: 'admin@example.com',
    name: 'Admin User'
  };
  
  // Mock request with default user
  const mockReq = {
    user: defaultUser
  };
  
  beforeAll(async () => {
    prisma = new PrismaClient();
    await cleanUp(prisma);
  });

  afterEach(async () => {
    await cleanUp(prisma);
    jest.clearAllMocks();
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
      controllers: [CategoryController],
      providers: [
        CategoryService,
        {
          provide: PrismaService,
          useValue: {
            category: {
              create: jest.fn().mockImplementation((data) => {
                return Promise.resolve({
                  id: faker.string.uuid(),
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  ...data.data,
                });
              }),
              findUnique: jest.fn().mockImplementation(({ where }) => {
                if (where.id === 'non-existent-id') {
                  return Promise.resolve(null);
                }
                return Promise.resolve({
                  id: where.id || faker.string.uuid(),
                  name: faker.commerce.department(),
                  description: faker.commerce.productDescription(),
                  slug: faker.helpers.slugify(faker.commerce.department().toLowerCase()),
                  image: 'test-image.jpg',
                  createdById: mockUserId,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                });
              }),
              findMany: jest.fn().mockImplementation(() => {
                return Promise.resolve([
                  {
                    id: faker.string.uuid(),
                    name: faker.commerce.department(),
                    description: faker.commerce.productDescription(),
                    slug: faker.helpers.slugify(faker.commerce.department().toLowerCase()),
                    image: 'test-image.jpg',
                    createdById: mockUserId,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  }
                ]);
              }),
              count: jest.fn().mockImplementation(() => {
                return Promise.resolve(1);
              }),
              update: jest.fn().mockImplementation((data) => {
                if (data.where.id === 'non-existent-id') {
                  return Promise.resolve(null);
                }
                return Promise.resolve({
                  id: data.where.id,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  ...data.data,
                });
              }),
              delete: jest.fn().mockImplementation(({ where }) => {
                if (where.id === 'non-existent-id') {
                  return Promise.resolve(null);
                }
                return Promise.resolve({
                  id: where.id,
                  name: faker.commerce.department(),
                  description: faker.commerce.productDescription(),
                  slug: faker.helpers.slugify(faker.commerce.department().toLowerCase()),
                  image: 'test-image.jpg',
                  createdById: mockUserId,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                });
              }),
              updateMany: jest.fn().mockImplementation(() => {
                return Promise.resolve({ count: 1 });
              }),
            }
          },
        },
        {
          provide: StorageService,
          useValue: {
            uploadFile: jest.fn().mockImplementation(() => 
              Promise.resolve({ filename: 'test-image.jpg' })
            ),
            removeFile: jest.fn().mockImplementation(() => 
              Promise.resolve(true)
            ),
            getImageUrl: jest.fn().mockImplementation((filename) => 
              `https://example.com/${filename}`
            ),
          },
        },
      ],
    }).compile();

    categoryController = app.get<CategoryController>(CategoryController);
    prismaService = app.get<PrismaService>(PrismaService);
  });

  describe('Create Category', () => {
    describe('isOk', () => {
      test('default', async () => {
        const payload: CreateCategoryDto = {
          name: faker.commerce.department(),
          description: faker.commerce.productDescription(),
          slug: faker.helpers.slugify(faker.commerce.department().toLowerCase()),
        };
        
        const result = await categoryController.createCategory(
          mockReq as any,
          payload,
          mockImage,
        );
        
        expect(result).toBeDefined();
        expect(result.success).toBe(true);
        expect(result.message).toBe('Category created successfully');
        expect(result.data).toEqual(
          expect.objectContaining({
            name: payload.name,
            description: payload.description,
            slug: payload.slug,
          }),
        );
      });
    });

    describe('isErr', () => {
      test('unauthorized access', async () => {
        const payload: CreateCategoryDto = {
          name: faker.commerce.department(),
          description: faker.commerce.productDescription(),
          slug: faker.helpers.slugify(faker.commerce.department().toLowerCase()),
        };
        try {
          await categoryController.createCategory(
            { user: null } as any,
            payload,
            mockImage,
          );
          expect(true).toBe(false);
        } catch (error) {
          expect(error.status).toBe(401);
          expect(error.message).toBe('Unauthorized Access');
        }
      });
      
      test('missing name', async () => {
        const payload: CreateCategoryDto = {
          description: faker.commerce.productDescription(),
          slug: faker.helpers.slugify(faker.commerce.department().toLowerCase()),
        } as CreateCategoryDto; // Missing name
        
        jest.spyOn(prismaService.category, 'create').mockImplementationOnce(() => {
          throw new Error('Category Name is required');
        });
        
        try {
          await categoryController.createCategory(
            mockReq as any,
            payload,
            mockImage,
          );
          // If we reach here, the test should fail
          expect(true).toBe(false);
        } catch (error) {
          expect(error.status).toBe(400);
          expect(error.message).toBe('Category Name is required');
        }
      });
    });
  });

  describe('Get Categories', () => {
    describe('isOk', () => {
      test('default', async () => {
        const result = await categoryController.getCategories({});
        expect(result).toBeDefined();
        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        expect(Array.isArray(result.data)).toBe(true);
        expect(result.pagination).toBeDefined();
      });
      
      test('with search and filter', async () => {
        const result = await categoryController.getCategories({
          search: "Test",
          filter: "ztoa",
          page: 1,
          limit: 10
        });
        expect(result).toBeDefined();
        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        expect(result.pagination).toBeDefined();
      });
    });
  });
  
  describe('Get Category Names', () => {
    describe('isOk', () => {
      test('default', async () => {
        const result = await categoryController.getCategoryNames(mockReq as any);
        expect(result).toBeDefined();
        expect(result.success).toBe(true);
        expect(result.message).toBe('Categories retrieved successfully');
        expect(result.data).toBeDefined();
        expect(Array.isArray(result.data)).toBe(true);
      });
    });
    
    describe('isErr', () => {
      test('unauthorized access', async () => {
        try {
          await categoryController.getCategoryNames({ user: null } as any);
          expect(true).toBe(false);
        } catch (error) {
          expect(error.status).toBe(401);
          expect(error.message).toBe('Unauthorized Access');
        }
      });
    });
  });

  describe('Update Category', () => {
    describe('isOk', () => {
      test('default', async () => {
        const categoryId = faker.string.uuid();
        const updatePayload: UpdateCategoryDto = {
          name: faker.commerce.department(),
        };
        
        const result = await categoryController.updateCategory(
          categoryId,
          updatePayload,
          mockImage,
        );
        
        expect(result).toBeDefined();
        expect(result.success).toBe(true);
        expect(result.message).toBe('Category updated successfully');
        expect(result.data).toEqual(
          expect.objectContaining({
            name: updatePayload.name,
          }),
        );
      });
    });

    describe('isErr', () => {
      test('category not found', async () => {
        jest.spyOn(prismaService.category, 'findUnique').mockResolvedValueOnce(null);
        
        const updatePayload: UpdateCategoryDto = {
          name: faker.commerce.department(),
        };
        
        try {
          await categoryController.updateCategory(
            'non-existent-id',
            updatePayload,
            mockImage,
          );
          expect(true).toBe(false);
        } catch (error) {
          expect(error.status).toBe(400); 
          expect(error.message).toBe('Category not found');
        }
      });
    });
  });

  describe('Delete Category', () => {
    describe('isOk', () => {
      test('default', async () => {
        const categoryId = faker.string.uuid();
        
        const result = await categoryController.deleteCategory(categoryId);
        
        expect(result).toBeDefined();
        expect(result.success).toBe(true);
        expect(result.message).toBe('Category deleted successfully');
      });
    });

    describe('isErr', () => {
      test('category not found', async () => {
        jest.spyOn(prismaService.category, 'findUnique').mockResolvedValueOnce(null);
        
        try {
          await categoryController.deleteCategory('non-existent-id');
          expect(true).toBe(false);
        } catch (error) {
          expect(error.status).toBe(400); 
          expect(error.message).toBe('Category not found');
        }
      });
    });
  });
});