import { Provider } from 'react-redux';
import { sessionReducer } from '@entities/session';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SignUpForm } from '../ui/SignUpForm';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

const mockRegisterFn = jest.fn();

jest.mock('@shared/api', () => ({
  authApi: {
    reducerPath: 'authApi',
    reducer: (state = {}) => state,
    middleware: () => (next: unknown) => (action: unknown) => (next as (a: unknown) => unknown)(action),
  },
  useRegisterMutation: () => [mockRegisterFn, { isLoading: false }],
  useApiError: () => ({ getErrorMessage: (e: unknown) => String(e) }),
}));

const makeTestStore = () =>
  configureStore({
    reducer: {
      session: sessionReducer,
      authApi: (state = {}) => state,
    },
  });

const renderWithStore = (ui: React.ReactElement) => render(<Provider store={makeTestStore()}>{ui}</Provider>);

describe('SignUpForm', () => {
  beforeEach(() => {
    mockRegisterFn.mockReset();
  });

  it('renders email, password and confirmPassword fields', () => {
    renderWithStore(<SignUpForm />);
    expect(screen.getByPlaceholderText(/введите e-mail/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/введите пароль/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/повторите пароль/i)).toBeInTheDocument();
  });

  it('shows required validation errors on empty submit', async () => {
    renderWithStore(<SignUpForm />);
    await userEvent.click(screen.getByRole('button', { name: /зарегистрироваться/i }));

    await waitFor(() => {
      expect(screen.getByText(/e-mail обязателен/i)).toBeInTheDocument();
    });
  });

  it('shows email format error for invalid email', async () => {
    renderWithStore(<SignUpForm />);
    await userEvent.type(screen.getByPlaceholderText(/введите e-mail/i), 'notanemail');
    await userEvent.click(screen.getByRole('button', { name: /зарегистрироваться/i }));

    await waitFor(() => {
      expect(screen.getByText(/корректный e-mail/i)).toBeInTheDocument();
    });
  });

  it('shows password strength error when password is too short', async () => {
    renderWithStore(<SignUpForm />);
    await userEvent.type(screen.getByPlaceholderText(/введите e-mail/i), 'user@test.com');
    await userEvent.type(screen.getByPlaceholderText(/введите пароль/i), 'short');
    await userEvent.click(screen.getByRole('button', { name: /зарегистрироваться/i }));

    await waitFor(() => {
      expect(screen.getByText(/не менее 8 символов/i)).toBeInTheDocument();
    });
  });

  it('shows error when passwords do not match', async () => {
    renderWithStore(<SignUpForm />);
    await userEvent.type(screen.getByPlaceholderText(/введите e-mail/i), 'user@test.com');
    await userEvent.type(screen.getByPlaceholderText(/введите пароль/i), 'Password1');
    await userEvent.type(screen.getByPlaceholderText(/повторите пароль/i), 'Password2');
    await userEvent.click(screen.getByRole('button', { name: /зарегистрироваться/i }));

    await waitFor(() => {
      expect(screen.getByText(/пароли не совпадают/i)).toBeInTheDocument();
    });
  });

  it('calls register mutation with email and password on valid submit', async () => {
    mockRegisterFn.mockResolvedValue({});

    renderWithStore(<SignUpForm />);
    await userEvent.type(screen.getByPlaceholderText(/введите e-mail/i), 'user@test.com');
    await userEvent.type(screen.getByPlaceholderText(/введите пароль/i), 'Password1');
    await userEvent.type(screen.getByPlaceholderText(/повторите пароль/i), 'Password1');
    await userEvent.click(screen.getByRole('button', { name: /зарегистрироваться/i }));

    await waitFor(() => {
      expect(mockRegisterFn).toHaveBeenCalledWith({ email: 'user@test.com', password: 'Password1' });
    });
  });
});
