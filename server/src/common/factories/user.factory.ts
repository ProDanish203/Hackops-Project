import { faker } from "@faker-js/faker/.";
import { Prisma } from "@prisma/client";
import { randomBytes,randomUUID } from "crypto";

export const createUserBodyFactory = (overrides?: Partial<Prisma.UserCreateInput>): Prisma.UserCreateInput => ({
    email: faker.internet.email(),
    name: faker.person.fullName(),
    password: faker.internet.password(),
    profileImage: 'test.jpg',
    salt: randomBytes(16).toString('hex'),
    ...overrides,
})



export const userBodyFactory = (
  overrides?: Partial<Prisma.UserCreateInput>,
) => {
  return {
    email: faker.internet.email(),
    name: faker.person.fullName(),
    password: faker.internet.password(),
    role: 'USER',
    salt: randomUUID(),
    profileImage: faker.image.url(),
    ...overrides,
  } satisfies Prisma.UserCreateInput;
};