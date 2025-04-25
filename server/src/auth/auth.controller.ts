import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ValidationPipe,
  Res,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterFile } from 'src/common/types/type';
import {
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
  VerifyEmailDto,
} from './dto/auth.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Role } from '@prisma/client';
import { GoogleOAuthGuard } from 'src/common/guards/google-auth.guard';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseInterceptors(FileInterceptor('image'))
  register(
    @UploadedFile() image: MulterFile,
    @Body(ValidationPipe) registerDto: RegisterDto,
  ) {
    return this.authService.register(registerDto, image);
  }

  @Post('login')
  login(
    @Res({ passthrough: true }) response: Response,
    @Body(ValidationPipe) loginDto: LoginDto,
  ) {
    return this.authService.login(response, loginDto);
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  @Roles(...Object.values(Role))
  logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.logout(request, response);
  }

  @Post('forgot-password')
  forgotPassword(@Body(ValidationPipe) forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  resetPassword(@Body(ValidationPipe) resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Post('send-verification-email')
  @UseGuards(AuthGuard)
  @Roles(...Object.values(Role))
  sendVerificationEmail(@Req() request: Request) {
    return this.authService.sendVerificationEmail(request);
  }

  @Post('verify-email')
  @UseGuards(AuthGuard)
  @Roles(...Object.values(Role))
  verifyEmail(
    @Req() request: Request,
    @Body(ValidationPipe) { token }: VerifyEmailDto,
  ) {
    return this.authService.verifyEmail({ request, token });
  }

  @UseGuards(GoogleOAuthGuard)
  @Get('google')
  async googleAuth(@Req() req) {}

  @UseGuards(GoogleOAuthGuard)
  @Get('google-auth-redirect')
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    await this.authService.signInWithGoogle(req.user, res);
    return res.redirect(`${process.env.GOOGLE_REDIRECT_URL_CLIENT_REACT}`);
  }
}
