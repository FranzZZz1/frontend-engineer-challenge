'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRequestPasswordResetMutation } from '@shared/api';
import { routes } from '@shared/router/paths';
import { Button } from '@shared/ui/Button';
import { FormInput } from '@shared/ui/Input';
import Chevron from '@static/icons/chevron.svg';

import { type ForgotPasswordFormValues, forgotPasswordSchema } from '../model/forgotPasswordSchema';

import styles from './ForgotPasswordForm.module.scss';

export function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false);
  const [requestReset, { isLoading }] = useRequestPasswordResetMutation();

  const { control, handleSubmit } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      await requestReset(values.email);
    } finally {
      // Резолвим в любом случае для защиты от перебора email-ов.
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className={styles.success} aria-live="polite">
        <h1 className={styles.back__link}>Проверьте свою почту</h1>
        <p className={styles.description}>Мы отправили на почту письмо с ссылкой для восстановления пароля</p>
        <Button fullWidth theme="light" href={routes.login} disabled={isLoading} className={styles.success__button}>
          Назад в авторизацию
        </Button>
      </div>
    );
  }

  return (
    <form noValidate className={styles.form} aria-label="Форма восстановления пароля" onSubmit={handleSubmit(onSubmit)}>
      <Link href={routes.login} className={styles.back__link} aria-label="Назад ко входу">
        <Chevron /> Восстановление пароля
      </Link>

      <p className={styles.description}>Укажите адрес почты на который был зарегистрирован аккаунт</p>

      <FormInput
        name="email"
        type="email"
        label="E-mail"
        placeholder="Введите e-mail"
        autoComplete="email"
        control={control}
      />

      <Button fullWidth theme="light" type="submit" disabled={isLoading}>
        Восстановить пароль
      </Button>
    </form>
  );
}
