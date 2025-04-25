import { EMAIL_TYPES, EmailTypes } from './../lib/constants';
import * as nodemailer from 'nodemailer';
// import * as bcrypt from 'bcrypt';
import { throwError } from '../utils/helpers';
import { HttpStatus } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

export class MailerService {
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async sendVerificationMail({
    type,
    email,
    userId,
  }: {
    type: EmailTypes;
    email: string;
    userId: string;
  }) {
    try {
      if (!this.prisma) {
        console.error('Prisma is undefined');
        throw new Error('Database service is not initialized');
      }
      // const token = await bcrypt.hash(userId.toString(), 10);
      const token = 'as';
      if (!token) return false;

      if (type == EMAIL_TYPES.VERIFY) {
        await this.prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            verifyToken: token,
            verifyTokenExpiry: new Date(Date.now() + 3600000),
          },
        });
      } else if (type == EMAIL_TYPES.RESET) {
        await this.prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            forgotPasswordToken: token,
            forgotPasswordTokenExpiry: new Date(Date.now() + 3600000),
          },
        });
      }

      const transporter = await nodemailer.createTransport({
        pool: true,
        service: 'gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const subject = `Boilerplate | ${type === EMAIL_TYPES.VERIFY ? 'Verify your account' : 'Reset Password'} `;

      const html = `
    <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>${type === EMAIL_TYPES.VERIFY}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f2f2f2;
                    padding: 20px;
                }
                .container {
                    background-color: white;
                    padding: 20px;
                    border-radius: 5px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .button {
                    background-color: #4CAF50;
                    border: none;
                    color: white;
                    padding: 10px 20px;
                    text-align: center;
                    text-decoration: none;
                    display: inline-block;
                    font-size: 16px;
                    border-radius: 4px;
                    cursor: pointer;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>${type === EMAIL_TYPES.VERIFY ? 'Verify your email' : 'Reset password'}</h2>
                <p>Please click the button below to ${type === EMAIL_TYPES.VERIFY ? 'verify your email' : 'reset your password'}:</p>
                <a href="${process.env.BASE_DOMAIN}/${type === EMAIL_TYPES.VERIFY ? 'verify-email' : 'reset-password'}?token=${token}">
                    <button class="button">${type === EMAIL_TYPES.VERIFY ? 'Verify Email' : 'Reset Password'}</button>
                </a>
            </div>
        </body>
        </html>
    `;

      const mailOptions = {
        from: 'danishsidd203@gmail.com',
        to: email,
        html,
        subject,
      };

      const mailResponse = await transporter.sendMail(mailOptions);
      return mailResponse;
    } catch (error) {
      throw throwError(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
