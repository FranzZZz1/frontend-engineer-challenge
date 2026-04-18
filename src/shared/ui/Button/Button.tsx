'use client';

import { type AnchorHTMLAttributes, type ButtonHTMLAttributes } from 'react';
import Link, { type LinkProps as NextLinkProps } from 'next/link';
import cx from 'clsx';

import styles from './Button.module.scss';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined; newWindow?: false };
type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> &
  NextLinkProps & { href: string; disabled?: boolean; newWindow?: boolean };

export type ButtonThemes = {
  theme?: 'primary' | 'light';
};

type ButtonAdditionalProps = {
  fullWidth?: boolean;
};

export type ButtonComponentProps = (ButtonProps | LinkProps) & ButtonThemes & ButtonAdditionalProps;

export function Button({
  children,
  theme = 'primary',
  fullWidth = false,
  className,
  disabled,
  href,
  ...props
}: ButtonComponentProps) {
  const classNames = cx(styles.button, styles[theme], fullWidth && styles.fullWidth, className);

  if (href && !disabled) {
    const { newWindow, ...restProps } = props;
    return (
      <Link
        href={href}
        className={classNames}
        {...(restProps as AnchorHTMLAttributes<HTMLAnchorElement>)}
        rel={newWindow ? 'noopener noreferrer' : undefined}
        target={newWindow ? '_blank' : undefined}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      disabled={disabled}
      className={classNames}
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}
