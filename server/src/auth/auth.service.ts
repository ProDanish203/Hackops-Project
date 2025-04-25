import { HttpStatus, Injectable } from '@nestjs/common';
import { Request, Response, CookieOptions } from 'express';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from 'src/common/services/mailer.service';
import { PrismaService } from 'src/common/services/prisma.service';
import { StorageService } from 'src/common/services/storage.service';
import { throwError } from 'src/common/utils/helpers';
import { GoogleUser, JwtPayload, MulterFile } from 'src/common/types/type.d';
import { EMAIL_TYPES } from 'src/common/lib/constants';
import { Role } from '@prisma/client';
import {
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
} from './dto/auth.dto';
import { hashPassword, verifyPassword } from 'src/common/utils/hash';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly uploadService: StorageService,
    private readonly mailerService: MailerService,
  ) {}

  async register(
    { email, name, password, role }: RegisterDto,
    image: MulterFile,
  ) {
    try {
      const userExists = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (userExists)
        throw throwError('Email already in use', HttpStatus.CONFLICT);

      const { hash, salt } = hashPassword(password);

      const image_url = await this.uploadService.uploadFile(image);
      if (!image_url)
        throw throwError('Image upload failed', HttpStatus.BAD_REQUEST);

      const user = await this.prisma.user.create({
        data: {
          email,
          name,
          profileImage: image_url.filename,
          password: hash,
          salt,
          role,
        },
      });

      if (!user)
        throw throwError('Failed to register user', HttpStatus.BAD_REQUEST);

      return {
        message: 'User registered successfully',
        data: user,
        success: true,
      };
    } catch (error) {
      throw throwError(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async login(response: Response, { email, password }: LoginDto) {
    try {
      const userExists = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!userExists)
        throw throwError('Invalid Credentials', HttpStatus.NOT_FOUND);

      const isValidPassword = verifyPassword({
        password,
        salt: userExists.salt,
        hash: userExists.password,
      });

      if (!isValidPassword)
        throw throwError('Invalid Credentials', HttpStatus.NOT_FOUND);

      const token = await this.setJwtTokenToCookies(response, {
        email: userExists.email,
        id: userExists.id,
        role: userExists.role,
      });

      return {
        message: 'User logged in successfully',
        data: userExists,
        token,
        success: true,
      };
    } catch (error) {
      throw throwError(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async setJwtTokenToCookies(res: Response, payload: JwtPayload) {
    const token = await this.jwtService.signAsync(payload);

    const cookieOptions: CookieOptions = {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      sameSite: 'none',
      httpOnly: true,
      secure: true,
    };

    res.cookie('token', token, cookieOptions);

    return token;
  }

  async logout(request: Request, response: Response) {
    try {
      if (!request.user)
        throw throwError('User not found', HttpStatus.NOT_FOUND);

      const cookieOptions = {
        sameSite: 'none' as 'none',
        httpOnly: true,
        secure: true,
      };

      response.clearCookie('token', cookieOptions);

      return {
        message: 'User logged out successfully',
        success: true,
        data: {},
      };
    } catch (error) {
      throw throwError(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async forgotPassword({ email }: ForgotPasswordDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) throw throwError('User not found', HttpStatus.NOT_FOUND);

      const emailResponse = await this.mailerService.sendVerificationMail({
        email: user.email,
        type: EMAIL_TYPES.RESET,
        userId: user.id,
      });
      if (!emailResponse)
        throw throwError(
          'Failed to send verification email',
          HttpStatus.BAD_REQUEST,
        );

      return {
        message: 'Password reset link sent to your email',
        success: true,
        data: {},
      };
    } catch (error) {
      console.log(error);
      throw throwError(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async resetPassword({ token, password }: ResetPasswordDto) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          forgotPasswordToken: token,
          forgotPasswordTokenExpiry: {
            gte: new Date(Date.now()),
          },
        },
      });

      if (!user)
        throw throwError('Invalid or expired token', HttpStatus.BAD_REQUEST);

      const { hash, salt } = hashPassword(password);

      const updatedUser = await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          password: hash,
          salt,
          forgotPasswordToken: null,
          forgotPasswordTokenExpiry: null,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          hasNotifications: true,
          isEmailVerified: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!updatedUser)
        throw throwError('Failed to reset password', HttpStatus.BAD_REQUEST);

      return {
        message: 'Password reset successfully',
        data: updatedUser,
        success: true,
      };
    } catch (error) {
      throw throwError(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async sendVerificationEmail(request: Request) {
    try {
      if (!request.user)
        throw throwError('Unauthorized Access', HttpStatus.UNAUTHORIZED);

      const emailResponse = await this.mailerService.sendVerificationMail({
        email: request.user.email,
        type: EMAIL_TYPES.VERIFY,
        userId: request.user.id,
      });

      if (!emailResponse)
        throw throwError(
          'Failed to send verification email',
          HttpStatus.BAD_REQUEST,
        );

      return {
        message: 'Verification email sent',
        success: true,
        data: {},
      };
    } catch (error) {
      throw throwError(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async verifyEmail({ request, token }: { request: Request; token: string }) {
    try {
      if (!request.user)
        throw throwError('Unauthorized Access', HttpStatus.UNAUTHORIZED);

      const validToken = await this.prisma.user.findFirst({
        where: {
          id: request.user.id,
          verifyToken: token,
          verifyTokenExpiry: {
            gte: new Date(Date.now()),
          },
        },
      });

      if (!validToken)
        throw throwError('Invalid or expired token', HttpStatus.BAD_REQUEST);

      await this.prisma.user.update({
        where: {
          id: request.user.id,
        },
        data: {
          verifyToken: null,
          verifyTokenExpiry: null,
          isEmailVerified: true,
        },
      });

      return {
        message: 'Email verified successfully',
        success: true,
        data: {},
      };
    } catch (error) {
      throw throwError(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  private async registerGoogleUser(res: Response, user: GoogleUser) {
    try {
      const fullName =
        !user.firstName && !user.lastName
          ? user.email
          : `${user.lastName || ''} ${user.firstName || ''}`.trim();

      const newUser = await this.prisma.user.create({
        data: {
          email: user.email,
          name: fullName,
          profileImage: user.picture,
          // TODO: remove password and salt from user model
          password: 'google',
          salt: 'google',
        },
      });

      const payload = {
        email: user.email,
        id: newUser.id,
        role: Role.USER,
      };

      const token = await this.setJwtTokenToCookies(res, payload);

      return {
        message: 'User registered and logged in successfully',
        success: true,
        data: { user: newUser },
        token,
      };
    } catch (error) {
      throw throwError(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async signInWithGoogle(user: GoogleUser, res: Response) {
    try {
      if (!user) throw throwError('Unauthenticated', HttpStatus.UNAUTHORIZED);

      const existingUser = await this.findUserByEmail(user.email);

      if (!existingUser) return this.registerGoogleUser(res, user);

      const payload = {
        email: user.email,
        id: existingUser.id,
        role: Role.USER,
      };

      const token = await this.setJwtTokenToCookies(res, payload);

      return {
        message: 'User logged in successfully',
        success: true,
        data: { user: existingUser },
        token,
      };
    } catch (error) {
      throw throwError(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findUserByEmail(email: string) {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!user) return null;
    return user;
  }
}
