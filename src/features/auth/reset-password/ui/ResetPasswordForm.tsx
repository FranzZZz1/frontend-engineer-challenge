'use client';

import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useApiError, useResetPasswordMutation } from '@shared/api';
import { routes } from '@shared/router/paths';
import { Button } from '@shared/ui/Button';
import { FormInput } from '@shared/ui/Input';

import { type ResetPasswordFormValues, resetPasswordSchema } from '../model/resetPasswordSchema';

import styles from './ResetPasswordForm.module.scss';

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [resetPassword, { isLoading, isError, isSuccess }] = useResetPasswordMutation();
  const { getErrorMessage } = useApiError();

  const { control, handleSubmit, setError } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  if (!token) {
    return (
      <div className={styles.message} role="alert">
        <h1 className={styles.title}>Произошла ошибка</h1>
        <p>Ссылка для сброса пароля недействительна или устарела.</p>
        <Button theme="light" href={routes.forgotPassword}>
          Назад в авторизацию
        </Button>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.message} aria-live="polite">
        <h1 className={styles.title}>Пароль не был восстановлен</h1>
        <p className={styles.description}>
          По каким-то причинам мы не смогли изменить ваш пароль. Попробуйте ещё раз через некоторое время.
        </p>
        <Button theme="light" href={routes.login}>
          Назад в авторизацию
        </Button>
        <Link href={routes.forgotPassword} className={styles.link}>
          Попробовать заново
        </Link>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className={styles.message} aria-live="polite">
        <h1 className={styles.title}>Пароль был восстановлен</h1>
        <p className={styles.description}>Перейдите на страницу авторизации, чтобы войти в систему с новым паролем</p>
        <Button theme="light" href={routes.login}>
          Назад в авторизацию
        </Button>
      </div>
    );
  }

  const onSubmit = async (values: ResetPasswordFormValues) => {
    try {
      await resetPassword({ token, newPassword: values.newPassword }).unwrap();
    } catch (e: unknown) {
      setError('confirmPassword', { message: getErrorMessage(e) });
    }
  };

  return (
    <form noValidate className={styles.form} aria-label="Форма сброса пароля" onSubmit={handleSubmit(onSubmit)}>
      <h1 className={styles.title}>Задайте пароль</h1>
      <p className={styles.description}>Напишите новый пароль, который будете использовать для входа</p>

      <div className={styles.fields}>
        <FormInput
          name="newPassword"
          control={control}
          label="Пароль"
          type="password"
          autoComplete="new-password"
          placeholder="Введите пароль"
        />
        <FormInput
          name="confirmPassword"
          control={control}
          label="Повторите пароль"
          type="password"
          autoComplete="new-password"
          placeholder="Повторите пароль"
        />
      </div>

      <Button fullWidth type="submit" disabled={isLoading}>
        Сохранить пароль
      </Button>
    </form>
  );
}
