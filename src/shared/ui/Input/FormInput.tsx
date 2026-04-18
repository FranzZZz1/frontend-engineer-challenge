'use client';

import { type DetailedHTMLProps, type InputHTMLAttributes, useId, useState } from 'react';
import { type Control, type FieldValues, type Path, useController, type UseControllerProps } from 'react-hook-form';

import { Input } from './Input';

import styles from './Input.module.scss';

type FormInputProps<T extends FieldValues> = UseControllerProps<T> &
  Omit<DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, 'id'> & {
    name: Path<T>;
    control: Control<T>;
    label?: string;
    type?: string;
    placeholder?: string;
    hasGlobalError?: boolean;
  };

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      {' '}
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />{' '}
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />{' '}
      <line x1="1" y1="1" x2="23" y2="23" />{' '}
    </svg>
  ) : (
    <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      {' '}
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /> <circle cx="12" cy="12" r="3" />{' '}
    </svg>
  );
}

export function FormInput<T extends FieldValues>({
  name,
  control,
  label = '',
  type = 'text',
  placeholder = '',
  hasGlobalError = false,
}: FormInputProps<T>) {
  const id = useId();
  const [showPassword, setShowPassword] = useState(false);

  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const isPassword = type === 'password';

  const getInputType = () => {
    if (!isPassword) return type;
    return showPassword ? 'text' : 'password';
  };

  const inputType = getInputType();

  return (
    <div className={styles.wrapper}>
      <div className={styles.input__wrapper}>
        <Input
          {...field}
          id={id}
          type={inputType}
          hasError={!!error || hasGlobalError}
          aria-invalid={!!error}
          aria-describedby={`${id}-error`}
          placeholder={placeholder}
        />

        {!!label && (
          <label htmlFor={id} className={styles.label}>
            {label}
          </label>
        )}

        {isPassword ? (
          <button
            type="button"
            className={styles.toggle}
            onClick={() => {
              setShowPassword((v) => !v);
            }}
          >
            <EyeIcon open={showPassword} />
          </button>
        ) : null}
      </div>

      {!!error && (
        <span id={`${id}-error`} role="alert" className={styles.error}>
          {error.message}
        </span>
      )}
    </div>
  );
}
