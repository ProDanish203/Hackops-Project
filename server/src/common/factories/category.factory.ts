import { faker } from '@faker-js/faker';
import { CreateCategoryDto, UpdateCategoryDto } from 'src/category/dto/category.dto';

export const createCategoryBodyFactory = (): CreateCategoryDto => {
  const name = faker.commerce.department();
  return {
    name,
    description: faker.commerce.productDescription(),
    slug: faker.helpers.slugify(name.toLowerCase()),
  };
};

export const updateCategoryBodyFactory = (): UpdateCategoryDto => {
  const name = faker.commerce.department();
  return {
    name,
    description: faker.commerce.productDescription(),
    slug: faker.helpers.slugify(name.toLowerCase()),
  };
};
