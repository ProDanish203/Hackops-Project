import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { Prisma, PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker/.';
import { MulterFile } from 'src/common/types/type';
import { PrismaService } from 'src/common/services/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { StorageService } from 'src/common/services/storage.service';
import { RegisterDto } from '../dto/auth.dto';
import { randomBytes } from 'crypto';
import { MailerService } from 'src/common/services/mailer.service';
import { cleanUp } from 'src/common/_spec/utils';
import { mockImage } from 'src/common/_spec/utils';


describe('AuthController', () => {
  let authController: AuthController;
  let prisma: PrismaClient;

  beforeAll(async () => {
    prisma = new PrismaClient();
    await cleanUp(prisma)
  });

  afterEach(async () => {
    await cleanUp(prisma)
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
      controllers: [AuthController],
      providers: [AuthService, PrismaService, StorageService, MailerService],
    }).compile();

    authController = app.get<AuthController>(AuthController);
  });

  describe('Register', () => {
    describe('isOk', () => {
      test('default', async () => {
        const payload: RegisterDto = {
          email: faker.internet.email(),
          name: faker.person.fullName(),
          password: faker.internet.password(),
          role: 'USER',
        };
        const result = await authController.register(mockImage, { ...payload });
        expect(result).toBeDefined();
        expect(result.success).toBe(true);
        expect(result.message).toBe('User registered successfully');
        expect(result.data).toEqual(
          expect.objectContaining({
            email: payload.email,
            name: payload.name,
            role: payload.role,
          }),
        );
      });
    });
    describe('isErr', () => {
      test('email already exists', async () => {
        const prismaPayload: Prisma.UserCreateInput = {
          email: faker.internet.email(),
          name: faker.person.fullName(),
          password: faker.internet.password(),
          profileImage: 'test.jpg',
          salt: randomBytes(16).toString('hex'),
        };
        const payload: RegisterDto = {
          email: faker.internet.email(),
          name: faker.person.fullName(),
          password: faker.internet.password(),
          role: 'USER',
        };
        await prisma.user.create({ data: { ...prismaPayload } });
        try {
          await authController.register(mockImage, { ...payload });
        } catch (error) {
          expect(error.status).toBe(400);
          expect(error.message).toBe('Email already in use');
        }
      });
    });
  });
  describe('Login', () => {
    describe('isOk', () => {
      test('default', async () => {
        const payloadRegister: RegisterDto = {
          email: faker.internet.email(),
          name: faker.person.fullName(),
          password: faker.internet.password(),
          role: 'USER',
        };
        await authController.register(mockImage, { ...payloadRegister });
        const response: Response = new Response();
        (response as any).cookie = jest.fn(); // mock cookie
        const result = await authController.login(response as any, {
          email: payloadRegister.email,
          password: payloadRegister.password,
        });
        expect(result).toBeDefined();
        expect(result.token).toBeDefined();
        expect(result).toEqual(
          expect.objectContaining({
            success: true,
            message: 'User logged in successfully',
          }),
        );
      });
    });
    describe('isErr', () => {
      test('user does not exist', async () => {
        const payload: RegisterDto = {
          email: faker.internet.email(),
          name: faker.person.fullName(),
          password: faker.internet.password(),
          role: 'USER',
        };
        try {
          await authController.login({} as any, {
            email: payload.email,
            password: payload.password,
          });
        } catch (error) {
          expect(error.status).toBe(400);
          expect(error.message).toBe('Invalid Credentials');
        }
      });
    });
  });
  describe('Forgot Password', () => {
    describe('isOk', () => {
      test('default', async () => {
        const payloadRegister: RegisterDto = {
          email: faker.internet.email(),
          name: faker.person.fullName(),
          password: faker.internet.password(),
          role: 'USER',
        };
        await authController.register(mockImage, { ...payloadRegister });
        const result = await authController.forgotPassword({
          email: payloadRegister.email,
        });
        expect(result).toBeDefined();
        expect(result.success).toBe(true);
        expect(result.message).toBe('Password reset link sent to your email');
      });
    });
    describe('isErr', () => {
      test('user does not exist', async () => {
        const payload: RegisterDto = {
          email: faker.internet.email(),
          name: faker.person.fullName(),
          password: faker.internet.password(),
          role: 'USER',
        };
        try {
          await authController.forgotPassword({ email: payload.email });
        } catch (error) {
          expect(error.status).toBe(400);
          expect(error.message).toBe('User not found');
        }
      });
    });
  });
  describe('Reset Password', () => {
    describe('isErr', () => {
      test('invalid token', async () => {
        const payload: RegisterDto = {
          email: faker.internet.email(),
          name: faker.person.fullName(),
          password: faker.internet.password(),
          role: 'USER',
        };
        try {
          await authController.resetPassword({
            token: 'invalid token',
            password: payload.password,
          });
        } catch (error) {
          expect(error.status).toBe(400);
          expect(error.message).toBe('Invalid or expired token');
        }
      });
    });
  });
});