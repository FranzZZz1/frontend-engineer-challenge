import { type FetchBaseQueryError } from '@reduxjs/toolkit/query';

import { type ApiError, type GraphQLError } from './types';

function isGraphQLErrorArray(data: unknown): data is GraphQLError[] {
  if (!Array.isArray(data)) return false;

  const first = data[0];

  return (
    typeof first === 'object' &&
    first !== null &&
    'message' in first &&
    typeof (first as { message: unknown }).message === 'string'
  );
}

export function parseApiError(error: unknown): ApiError {
  if (typeof error === 'object' && error !== null && 'status' in error) {
    const err = error as FetchBaseQueryError;

    if (err.status === 'CUSTOM_ERROR' && err.data && isGraphQLErrorArray(err.data)) {
      return {
        type: 'graphql',
        messages: err.data.map((e) => e.message),
      };
    }

    if ('error' in err) {
      return {
        type: 'network',
        message: String(err.error),
      };
    }
  }

  return {
    type: 'unknown',
    message: 'Something went wrong',
  };
}
