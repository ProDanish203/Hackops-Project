import { Role } from '@prisma/client';

export interface QueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  filter?: string;
  search?: string;
}

export interface PaginationInfo {
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
  filename: string;
}

export interface GoogleUser {
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
  accessToken: string;
  refreshToken: string;
}

export type JwtPayload = {
  id: string;
  email: string;
  role: Role;
};
