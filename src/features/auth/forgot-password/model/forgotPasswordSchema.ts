import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  email: z.string({ message: 'Введите email' }).min(1, 'Введите email').email('Введите корректный email'),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
