import { z } from 'zod';

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, 'Пароль должен содержать не менее 8 символов')
      .regex(/[A-Z]/, 'Пароль должен содержать заглавную букву')
      .regex(/[0-9]/, 'Пароль должен содержать цифру'),
    confirmPassword: z.string().min(1, 'Подтвердите пароль'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
