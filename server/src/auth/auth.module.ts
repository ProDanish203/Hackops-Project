import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/common/services/prisma.service';
import { StorageService } from 'src/common/services/storage.service';
import { MailerService } from 'src/common/services/mailer.service';
import { GoogleStrategy } from './strategies/google-oauth.strategy';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRY },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    StorageService,
    MailerService,
    GoogleStrategy,
  ],
})
export class AuthModule {}
