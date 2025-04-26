import {PrismaClient} from '@prisma/client'
import { MulterFile } from '../types/type';

export const cleanUp = async (prismaClient: PrismaClient) => {
  await prismaClient.orderItem.deleteMany({});

  await prismaClient.order.deleteMany({});

  await prismaClient.product.deleteMany({});
  await prismaClient.category.deleteMany({});

  await prismaClient.address.deleteMany({});

  await prismaClient.user.deleteMany({});
}

export const mockImage: MulterFile = {
  buffer: Buffer.from(''),
  encoding: 'utf-8',
  fieldname: 'image',
  mimetype: 'image/jpeg',
  originalname: 'test.jpg',
  size: 100,
  filename: 'test.jpg',
};