import { forgotPasswordSchema } from '../model/forgotPasswordSchema';

describe('forgotPasswordSchema', () => {
  it('passes with valid email', () => {
    const result = forgotPasswordSchema.safeParse({ email: 'user@example.com' });
    expect(result.success).toBe(true);
  });

  it('fails with missing email', () => {
    const result = forgotPasswordSchema.safeParse({ email: '' });
    expect(result.success).toBe(false);
  });

  it('fails with invalid email format', () => {
    const result = forgotPasswordSchema.safeParse({ email: 'notanemail' });
    expect(result.success).toBe(false);
  });
});
