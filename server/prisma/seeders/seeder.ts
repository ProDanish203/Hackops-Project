import { PrismaClient, Role, LoginProvider, PaymentMethod, OrderStatus, PaymentStatus } from '@prisma/client'
import { faker } from '@faker-js/faker'
import * as crypto from 'crypto'

const hashPassword = (password: string) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex');
  return { salt, hash };
};

const prisma = new PrismaClient()

async function seed() {
  console.log('📦 Starting seeding...')

  const categories = await Promise.all(
    Array.from({ length: 5 }).map(() => {
      const name = faker.commerce.department()
      return prisma.category.create({
        data: {
          name,
          slug: faker.helpers.slugify(name.toLowerCase()),
          description: faker.commerce.productDescription(),
          image: `${faker.animal.petName()}.jpg`,
        },
      })
    }),
  )

  const products = await Promise.all(
    categories.flatMap(category =>
      Array.from({ length: 10 }).map(() =>
        prisma.product.create({
          data: {
            name: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price: parseFloat(faker.commerce.price()),
            stock: faker.number.int({ min: 1, max: 100 }),
            images: [`${faker.animal.petName()}.jpg`],
            categoryId: category.id,
          },
        }),
      ),
    ),
  )

  const users = await Promise.all(
    Array.from({ length: 5 }).map(async () => {
      const password = hashPassword('password123')
      return prisma.user.create({
        data: {
          email: faker.internet.email(),
          name: faker.person.fullName(),
          password: password.hash,
          salt: password.salt,
          profileImage: `${faker.animal.petName()}.png`,
          role: Role.USER,
          loginProvider: LoginProvider.EMAIL,
        },
      })
    }),
  )

  // Seed addresses
  const addresses = await Promise.all(
    users.map(() =>
      prisma.address.create({
        data: {
          street: faker.location.streetAddress(),
          city: faker.location.city(),
          state: faker.location.state(),
        },
      }),
    ),
  )

  // Seed orders (one per user)
  const orders = await Promise.all(
    users.map((user, idx) =>
      prisma.order.create({
        data: {
          totalAmount: products[idx * 2].price + products[idx * 2 + 1].price,
          paymentMethod: faker.helpers.arrayElement(Object.values(PaymentMethod)),
          shippingAddressId: addresses[idx].id,
          billingAddressId: addresses[idx].id,
          name: user.name,
          email: user.email,
          phone: faker.phone.number(),
          customerId: user.id,
          trackingNumber: faker.helpers.replaceSymbols('TRK########'),
          orderStatus: OrderStatus.pending,
          paymentStatus: PaymentStatus.pending,
          estimatedDeliveryDate: faker.date.soon({ days: 7 }),
        },
      }),
    ),
  )
}

seed()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
    .then(() => {
        console.log('📦 Seeding completed!')
    })


    // run: npx ts-node --esm --transpile-only src/common/seeders/seeder.ts