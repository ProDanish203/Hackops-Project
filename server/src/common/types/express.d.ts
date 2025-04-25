import { Prisma, User } from '@prisma/client';

type UserWithoutPassword = Omit<User, 'password'>;

type UserPayload = Prisma.UserGetPayload<{
  select: {
    id: true;
    email: true;
    name: true;
    role: true;
  };
}>;

declare global {
  namespace Express {
    interface User extends UserPayload {}
    interface Request {
      user?: UserWithoutPassword;
    }
  }
}