'use client';

import { type ReactNode, useEffect, useRef } from 'react';
import { clearSession, setAccessToken } from '@entities/session';
import { REFRESH_TOKEN_MUTATION } from '@shared/api/graphql/mutations';
import { type GraphQLResponse, type RefreshTokenPayload } from '@shared/api/graphql/types';
import { API_URL } from '@shared/config/env';
import { useAppDispatch, useAppSelector } from '@shared/store/hooks';

export function AuthRehydrationProvider({ children }: { children: ReactNode }): ReactNode {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((s) => s.session.isAuthenticated);
  const attempted = useRef(false);

  useEffect(() => {
    if (isAuthenticated || attempted.current) return;

    attempted.current = true;

    const refresh = async () => {
      try {
        const res = await fetch(API_URL, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: REFRESH_TOKEN_MUTATION }),
        });

        const json = (await res.json()) as GraphQLResponse<{ refreshToken: RefreshTokenPayload }>;

        if (json.data?.refreshToken.accessToken) {
          dispatch(setAccessToken(json.data.refreshToken.accessToken));
        } else {
          dispatch(clearSession());
        }
      } catch {
        dispatch(clearSession());
      }
    };

    refresh();
  }, [dispatch, isAuthenticated]);

  return children;
}
