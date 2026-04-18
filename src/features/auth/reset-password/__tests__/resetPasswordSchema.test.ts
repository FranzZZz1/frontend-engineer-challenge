import { resetPasswordSchema } from '../model/resetPasswordSchema';

describe('resetPasswordSchema', () => {
  it('passes with valid data', () => {
    const result = resetPasswordSchema.safeParse({ newPassword: 'Password1', confirmPassword: 'Password1' });
    expect(result.success).toBe(true);
  });

  it('fails when password is shorter than 8 characters', () => {
    const result = resetPasswordSchema.safeParse({ newPassword: 'Pass1', confirmPassword: 'Pass1' });
    expect(result.success).toBe(false);
  });

  it('fails when password has no uppercase letter', () => {
    const result = resetPasswordSchema.safeParse({ newPassword: 'password1', confirmPassword: 'password1' });
    expect(result.success).toBe(false);
  });

  it('fails when password has no digit', () => {
    const result = resetPasswordSchema.safeParse({ newPassword: 'Password', confirmPassword: 'Password' });
    expect(result.success).toBe(false);
  });

  it('fails when passwords do not match', () => {
    const result = resetPasswordSchema.safeParse({ newPassword: 'Password1', confirmPassword: 'Password2' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe('Пароли не совпадают');
  });
});
