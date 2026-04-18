export type GraphQLError = {
  message: string;
  extensions?: {
    code?: string;
  };
};

export type ApiError =
  | {
      type: 'graphql';
      messages: string[];
    }
  | {
      type: 'network';
      message: string;
    }
  | {
      type: 'unknown';
      message: string;
    };
