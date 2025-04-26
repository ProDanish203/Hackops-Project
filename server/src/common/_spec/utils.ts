import {PrismaClient} from '@prisma/client'
import { MulterFile } from '../types/type';

export const cleanUp = async (prismaClient: PrismaClient) => {
  console.log('Starting database cleanup...'); // Add logging

  try {
    await prismaClient.orderItem.deleteMany({});
    console.log('Deleted OrderItems');
  } catch (error) {
    console.error('Error deleting OrderItems:', error);
    throw error; // Re-throw to fail the test if cleanup fails critically
  }

  try {
    await prismaClient.order.deleteMany({});
    console.log('Deleted Orders');
  } catch (error) {
    console.error('Error deleting Orders:', error);
    throw error;
  }

  try {
    await prismaClient.product.deleteMany({});
    console.log('Deleted Products');
  } catch (error) {
    console.error('Error deleting Products:', error);
    throw error;
  }

  try {
    await prismaClient.category.deleteMany({});
    console.log('Deleted Categories');
  } catch (error) {
    console.error('Error deleting Categories:', error);
    throw error;
  }

  try {
    await prismaClient.address.deleteMany({});
    console.log('Deleted Addresses');
  } catch (error) {
    console.error('Error deleting Addresses:', error);
    throw error;
  }

  try {
    await prismaClient.user.deleteMany({});
    console.log('Deleted Users');
  } catch (error) {
    console.error('Error deleting Users:', error);
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