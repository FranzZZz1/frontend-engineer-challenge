import { type ReactNode } from 'react';
import Logo from '@static/icons/logo.svg';

import styles from './CenteredAuthLayout.module.scss';

type CenteredAuthLayoutProps = {
  children: ReactNode;
};

export function CenteredAuthLayout({ children }: CenteredAuthLayoutProps) {
  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <Logo />
      </header>

      <main className={styles.content}>
        <div className={styles.card}>{children}</div>
      </main>
    </div>
  );
}
