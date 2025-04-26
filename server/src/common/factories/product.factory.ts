import { faker } from '@faker-js/faker';
import { CreateProductDto } from '../../product/dto/product.dto';

export function createProductBodyFactory(categoryId: string): CreateProductDto {
  return {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: parseFloat(faker.commerce.price()), 
    stock: faker.number.int({ min: 0, max: 100 }),
    categoryId: categoryId,
  };
}
