'use client';

import { type InputHTMLAttributes } from 'react';
import cx from 'clsx';

import styles from './Input.module.scss';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  hasError?: boolean;
  withRightIcon?: boolean;
};

export function Input({ className, hasError = false, withRightIcon = false, ...props }: InputProps) {
  return (
    <input
      className={cx(
        styles.input,
        hasError && styles.input__error,
        withRightIcon && styles['input--with-icon'],
        className,
      )}
      {...props}
    />
  );
}
