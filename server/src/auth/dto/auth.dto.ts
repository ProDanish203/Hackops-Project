import { Role } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsStrongPassword,
} from 'class-validator';

export class RegisterDto {
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsStrongPassword({}, { message: 'Password is too weak' })
  password: string;

  @IsOptional()
  @IsEnum(Role, { message: 'Invalid user role' })
  role: Role;
}

export class LoginDto {
  @IsEmail({}, { message: 'Invalid email' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}

export class ForgotPasswordDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;
}

export class ResetPasswordDto {
  @IsNotEmpty({ message: 'Verification Token is required' })
  token: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsStrongPassword({}, { message: 'Password is too weak' })
  password: string;
}

export class VerifyEmailDto {
  @IsNotEmpty({ message: 'Verification Token is required' })
  token: string;
}

export type AuthResponse = Omit<RegisterDto, 'password'>;
