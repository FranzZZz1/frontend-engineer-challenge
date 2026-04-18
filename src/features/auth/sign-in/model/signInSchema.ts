import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string().min(1, 'E-mail обязателен').email('Введите корректный e-mail'),
  password: z.string().min(1, 'Пароль обязателен'),
});

export type SignInFormValues = z.infer<typeof signInSchema>;
