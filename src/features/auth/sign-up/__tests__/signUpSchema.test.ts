import { signUpSchema } from '../model/signUpSchema';

describe('signUpSchema', () => {
  it('passes with valid data', () => {
    const result = signUpSchema.safeParse({
      email: 'user@example.com',
      password: 'Password1',
      confirmPassword: 'Password1',
    });
    expect(result.success).toBe(true);
  });

  it('fails with missing email', () => {
    const result = signUpSchema.safeParse({ email: '', password: 'Password1', confirmPassword: 'Password1' });
    expect(result.success).toBe(false);
  });

  it('fails with invalid email format', () => {
    const result = signUpSchema.safeParse({ email: 'notanemail', password: 'Password1', confirmPassword: 'Password1' });
    expect(result.success).toBe(false);
  });

  it('fails when password is shorter than 8 characters', () => {
    const result = signUpSchema.safeParse({ email: 'user@example.com', password: 'Pass1', confirmPassword: 'Pass1' });
    expect(result.success).toBe(false);
  });

  it('fails when password has no uppercase letter', () => {
    const result = signUpSchema.safeParse({
      email: 'user@example.com',
      password: 'password1',
      confirmPassword: 'password1',
    });
    expect(result.success).toBe(false);
  });

  it('fails when password has no digit', () => {
    const result = signUpSchema.safeParse({
      email: 'user@example.com',
      password: 'Password',
      confirmPassword: 'Password',
    });
    expect(result.success).toBe(false);
  });

  it('fails when passwords do not match', () => {
    const result = signUpSchema.safeParse({
      email: 'user@example.com',
      password: 'Password1',
      confirmPassword: 'Password2',
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe('Пароли не совпадают');
  });
});
