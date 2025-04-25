import { HttpException, HttpStatus } from '@nestjs/common';
import * as crypto from 'crypto';

export const throwError = (
  message: string | any,
  statusCode?: number,
): HttpException => {
  return new HttpException(
    message,
    statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
  );
};

export const getRandomFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString('hex');

export const generateTrackingNumber = () => {
  const prefix = 'TRK';
  const timestamp = new Date().getTime().toString().slice(-8);
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');
  return `${prefix}-${timestamp}-${random}`.toUpperCase();
};
