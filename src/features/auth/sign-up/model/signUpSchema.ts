import { z } from 'zod';

export const signUpSchema = z
  .object({
    email: z.string().min(1, 'E-mail обязателен').email('Введите корректный e-mail'),
    password: z
      .string()
      .min(8, 'Пароль должен содержать не менее 8 символов')
      .regex(/[A-Z]/, 'Пароль должен содержать заглавную букву')
      .regex(/[0-9]/, 'Пароль должен содержать цифру'),
    confirmPassword: z.string().min(1, 'Подтвердите пароль'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

export type SignUpFormValues = z.infer<typeof signUpSchema>;
