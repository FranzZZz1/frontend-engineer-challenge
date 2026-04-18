import { type BaseQueryFn, type FetchArgs, fetchBaseQuery, type FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { API_URL } from '@shared/config/env';
import { type RootState } from '@shared/store';
import { Mutex } from 'async-mutex';

import { REFRESH_TOKEN_MUTATION } from './graphql/mutations';
import { type GraphQLResponse, type RefreshTokenPayload } from './graphql/types';

const mutex = new Mutex();

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).session.accessToken;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

export type GraphQLBaseQueryArgs = {
  query: string;
  variables?: Record<string, unknown>;
};

const graphqlBaseQuery: BaseQueryFn<GraphQLBaseQueryArgs, unknown, FetchBaseQueryError> = async (
  { query, variables },
  api,
  extraOptions,
) => {
  const result = await rawBaseQuery(
    {
      url: '',
      method: 'POST',
      body: { query, variables },
    } as FetchArgs,
    api,
    extraOptions,
  );
  if (result.error) {
    return result;
  }

  const data = result.data as GraphQLResponse<unknown>;

  if (data.errors?.length) {
    return {
      error: {
        status: 'CUSTOM_ERROR',
        data: data.errors,
      } as FetchBaseQueryError,
    };
  }

  return {
    data,
  };
};

export const baseQueryWithReauth: BaseQueryFn<GraphQLBaseQueryArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  await mutex.waitForUnlock();

  let result = await graphqlBaseQuery(args, api, extraOptions);

  const graphQL = result.data as GraphQLResponse<unknown> | undefined;

  const isUnauthenticated =
    result.error?.status === 401 || graphQL?.errors?.some((e) => e.extensions?.code === 'UNAUTHENTICATED');

  if (isUnauthenticated) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshResult = await graphqlBaseQuery({ query: REFRESH_TOKEN_MUTATION }, api, extraOptions);

        const refreshData = refreshResult.data as GraphQLResponse<{
          refreshToken: RefreshTokenPayload;
        }>;

        if (refreshData.data?.refreshToken.accessToken) {
          const { setAccessToken } = await import('@entities/session');
          api.dispatch(setAccessToken(refreshData.data.refreshToken.accessToken));
          result = await graphqlBaseQuery(args, api, extraOptions);
        } else {
          const { clearSession } = await import('@entities/session');
          api.dispatch(clearSession());
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await graphqlBaseQuery(args, api, extraOptions);
    }
  }

  return result;
};
