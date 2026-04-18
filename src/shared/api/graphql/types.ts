import { type GraphQLError } from '@shared/api';

export type RegisterInput = {
  email: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type ResetPasswordInput = {
  token: string;
  newPassword: string;
};

export type RegisterPayload = {
  userId: string;
};

export type LoginPayload = {
  accessToken: string;
  userId: string;
};

export type RefreshTokenPayload = {
  accessToken: string;
};

export type RequestPasswordResetPayload = {
  success: boolean;
};

export type ResetPasswordPayload = {
  success: boolean;
};

export type GraphQLResponse<T> = {
  data?: T;
  errors?: GraphQLError[];
};
