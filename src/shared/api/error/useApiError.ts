import { useCallback } from 'react';

import { parseApiError } from './parseApiError';

export function useApiError() {
  const getErrorMessage = useCallback((error: unknown) => {
    const parsed = parseApiError(error);

    switch (parsed.type) {
      case 'graphql':
        return parsed.messages[0];
      case 'network':
        return parsed.message;
      case 'unknown':
      default:
        return parsed.message;
    }
  }, []);

  return { getErrorMessage };
}
