import { type ReactNode } from 'react';
import Link from 'next/link';
import Logo from '@static/icons/logo.svg';

import styles from './SplitAuthLayout.module.scss';

type SplitAuthLayoutProps = {
  children: ReactNode;
  footerText: string;
  footerLinkText: string;
  footerLinkHref: string;
};

export function SplitAuthLayout({ children, footerText, footerLinkText, footerLinkHref }: SplitAuthLayoutProps) {
  return (
    <div className={styles.root}>
      <div className={styles.form__panel}>
        <header className={styles.header}>
          <Logo />
        </header>

        <main className={styles.form__content}>{children}</main>

        <footer className={styles.footer}>
          <span className={styles.footer__text}>{footerText}</span>
          <Link href={footerLinkHref} className={styles.footer__link}>
            {footerLinkText}
          </Link>
        </footer>
      </div>

      <div className={styles.background} />
    </div>
  );
}
