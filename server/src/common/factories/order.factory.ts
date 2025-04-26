import { faker } from "@faker-js/faker/.";
import { PaymentMethod, Prisma, Product, User } from "@prisma/client";
import { CreateOrderDto } from "src/order/dto/order.dto";

export const createOrderBodyFactoryWithProductAndUser = (
  product: Product,
  user: User,
  overrides?: Partial<CreateOrderDto>,
) => {
  return {
    orderItems: [
      {
        productId: product.id,
        quantity: faker.number.int({ min: 1, max: 5 }),
      },
    ],
    shippingAddress: {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
    },
    billingAddress: {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
    },
    paymentMethod: PaymentMethod.cash_on_delivery,
    name: user.name,
    email: user.email,
    phone: faker.phone.number(),
    notes: faker.lorem.sentence(),
    ...overrides,
  } satisfies CreateOrderDto;
};