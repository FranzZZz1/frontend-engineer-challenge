'use client';

import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { setSession } from '@entities/session';
import { zodResolver } from '@hookform/resolvers/zod';
import { useApiError, useLoginMutation } from '@shared/api';
import { routes } from '@shared/router/paths';
import { useAppDispatch } from '@shared/store/hooks';
import { Button } from '@shared/ui/Button';
import { FormInput } from '@shared/ui/Input';

import { type SignInFormValues, signInSchema } from '../model/signInSchema';

import styles from './SignInForm.module.scss';

export function SignInForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { getErrorMessage } = useApiError();

  const onSubmit = async (values: SignInFormValues) => {
    try {
      const result = await login(values).unwrap();

      const loginData = result.data?.login;

      if (!loginData) {
        setError('password', {
          message: 'Ошибка авторизации',
        });
        return;
      }

      const { accessToken, userId } = loginData;

      dispatch(setSession({ accessToken, userId }));
      router.push(routes.dashboard);
    } catch (e: unknown) {
      setError('password', {
        message: getErrorMessage(e),
      });
    }
  };

  return (
    <form noValidate className={styles.form} aria-label="Форма входа" onSubmit={handleSubmit(onSubmit)}>
      <h1 className={styles.title}>Войти в систему</h1>

      <div className={styles.fields}>
        <FormInput
          label="E-mail"
          placeholder="Введите e-mail"
          name="email"
          type="email"
          autoComplete="email"
          hasGlobalError={!!errors.root}
          control={control}
        />
        <FormInput
          label="Пароль"
          placeholder="Введите пароль"
          name="password"
          type="password"
          autoComplete="current-password"
          hasGlobalError={!!errors.root}
          control={control}
        />
      </div>

      <Button fullWidth type="submit" disabled={isLoading}>
        Войти
      </Button>

      <Link href={routes.forgotPassword} className={styles.forgot__link}>
        Забыли пароль?
      </Link>
    </form>
  );
}
