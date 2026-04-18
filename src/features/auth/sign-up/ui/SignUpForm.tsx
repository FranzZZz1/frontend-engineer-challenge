'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useApiError, useRegisterMutation } from '@shared/api';
import { routes } from '@shared/router/paths';
import { Button } from '@shared/ui/Button';
import { FormInput } from '@shared/ui/Input';

import { type SignUpFormValues, signUpSchema } from '../model/signUpSchema';

import styles from './SignUpForm.module.scss';

export function SignUpForm() {
  const router = useRouter();
  const [register, { isLoading }] = useRegisterMutation();

  const { control, handleSubmit, setError } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const { getErrorMessage } = useApiError();

  const onSubmit = async (values: SignUpFormValues) => {
    try {
      await register({ email: values.email, password: values.password }).unwrap();
      router.push(routes.login);
    } catch (e: unknown) {
      setError('confirmPassword', {
        message: getErrorMessage(e),
      });
    }
  };

  return (
    <form noValidate className={styles.form} aria-label="Форма регистрации" onSubmit={handleSubmit(onSubmit)}>
      <h1 className={styles.title}>Регистрация в системе</h1>

      <div className={styles.fields}>
        <FormInput
          label="E-mail"
          type="email"
          autoComplete="email"
          placeholder="Введите e-mail"
          name="email"
          control={control}
        />
        <FormInput
          label="Пароль"
          type="password"
          autoComplete="new-password"
          placeholder="Введите пароль"
          name="password"
          control={control}
        />
        <FormInput
          label="Повторите пароль"
          type="password"
          autoComplete="new-password"
          placeholder="Повторите пароль"
          name="confirmPassword"
          control={control}
        />
      </div>

      <Button fullWidth type="submit" disabled={isLoading}>
        Зарегистрироваться
      </Button>
    </form>
  );
}
