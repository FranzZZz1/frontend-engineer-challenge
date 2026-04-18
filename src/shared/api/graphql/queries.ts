export const VALIDATE_SESSION_QUERY = `
  query ValidateSession {
    validateSession {
      valid
      userId
      email
    }
  }
`;

export const ME_QUERY = `
  query Me {
    me {
      id
      email
      createdAt
    }
  }
`;

export const CHECK_EMAIL_AVAILABILITY_QUERY = `
  query CheckEmailAvailability($email: String!) {
    checkEmailAvailability(email: $email) {
      available
    }
  }
`;
