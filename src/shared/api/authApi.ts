import { createApi } from '@reduxjs/toolkit/query/react';

import {
  LOGIN_MUTATION,
  LOGOUT_MUTATION,
  REGISTER_MUTATION,
  REQUEST_PASSWORD_RESET_MUTATION,
  RESET_PASSWORD_MUTATION,
} from './graphql/mutations';
import {
  type GraphQLResponse,
  type LoginInput,
  type LoginPayload,
  type RegisterInput,
  type RegisterPayload,
  type RequestPasswordResetPayload,
  type ResetPasswordInput,
  type ResetPasswordPayload,
} from './graphql/types';
import { baseQueryWithReauth } from './baseQuery';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    register: builder.mutation<GraphQLResponse<{ register: RegisterPayload }>, RegisterInput>({
      query: (input) => ({
        query: REGISTER_MUTATION,
        variables: { input },
      }),
    }),

    login: builder.mutation<GraphQLResponse<{ login: LoginPayload }>, LoginInput>({
      query: (input) => ({
        query: LOGIN_MUTATION,
        variables: { input },
      }),
    }),

    logout: builder.mutation<GraphQLResponse<{ logout: boolean }>, void>({
      query: () => ({
        query: LOGOUT_MUTATION,
      }),
    }),

    requestPasswordReset: builder.mutation<
      GraphQLResponse<{ requestPasswordReset: RequestPasswordResetPayload }>,
      string
    >({
      query: (email) => ({
        query: REQUEST_PASSWORD_RESET_MUTATION,
        variables: { email },
      }),
    }),

    resetPassword: builder.mutation<GraphQLResponse<{ resetPassword: ResetPasswordPayload }>, ResetPasswordInput>({
      query: (input) => ({
        query: RESET_PASSWORD_MUTATION,
        variables: { input },
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useRequestPasswordResetMutation,
  useResetPasswordMutation,
} = authApi;
