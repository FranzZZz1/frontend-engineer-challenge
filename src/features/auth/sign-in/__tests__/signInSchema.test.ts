import { signInSchema } from '../model/signInSchema';

describe('signInSchema', () => {
  it('passes with valid data', () => {
    const result = signInSchema.safeParse({ email: 'user@example.com', password: 'secret' });
    expect(result.success).toBe(true);
  });

  it('fails with missing email', () => {
    const result = signInSchema.safeParse({ email: '', password: 'secret' });
    expect(result.success).toBe(false);
  });

  it('fails with invalid email format', () => {
    const result = signInSchema.safeParse({ email: 'notanemail', password: 'secret' });
    expect(result.success).toBe(false);
  });

  it('fails with missing password', () => {
    const result = signInSchema.safeParse({ email: 'user@example.com', password: '' });
    expect(result.success).toBe(false);
  });
});
