import {PrismaClient} from '@prisma/client'
import { MulterFile } from '../types/type';

export const cleanUp = async (prismaClient: PrismaClient) => {

  try {
    await prismaClient.orderItem.deleteMany({});
  } catch (error) {
    throw error;
  }

  try {
    await prismaClient.order.deleteMany({});
  } catch (error) {
    throw error;
  }

  try {
    await prismaClient.product.deleteMany({});
  } catch (error) {
    throw error;
  }

  try {
    await prismaClient.category.deleteMany({});
  } catch (error) {
    throw error;
  }

  try {
    await prismaClient.address.deleteMany({});
  } catch (error) {
    throw error;
  }

  try {
  } catch (error) {
    throw error;
  }
};
export const mockImage: MulterFile = {
  buffer: Buffer.from(''),
  encoding: 'utf-8',
  fieldname: 'image',
  mimetype: 'image/jpeg',
  originalname: 'test.jpg',
  size: 100,
  filename: 'test.jpg',
};