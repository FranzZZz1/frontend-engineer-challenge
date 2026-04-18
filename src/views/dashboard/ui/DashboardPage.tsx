'use client';

import { useRouter } from 'next/navigation';
import { clearSession } from '@entities/session';
import { useLogoutMutation } from '@shared/api';
import { routes } from '@shared/router/paths';
import { useAppDispatch } from '@shared/store/hooks';
import { Button } from '@shared/ui/Button';
import Logo from '@static/icons/logo.svg';

import styles from './DashboardPage.module.scss';

export function DashboardPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [logout, { isLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } finally {
      dispatch(clearSession());
      router.push(routes.login);
    }
  };

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <Logo />
        <Button theme="light" disabled={isLoading} onClick={handleLogout}>
          Выйти
        </Button>
      </header>

      <main className={styles.main}>
        <h1 className={styles.title}>Добро пожаловать</h1>
        <p className={styles.subtitle}>Вы успешно вошли в систему Orbitto</p>
      </main>
    </div>
  );
}
