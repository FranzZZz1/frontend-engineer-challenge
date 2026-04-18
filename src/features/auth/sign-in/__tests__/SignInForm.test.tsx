import { Provider } from 'react-redux';
import { sessionReducer } from '@entities/session';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SignInForm } from '../ui/SignInForm';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

const mockLoginFn = jest.fn();

jest.mock('@shared/api', () => ({
  authApi: {
    reducerPath: 'authApi',
    reducer: (state = {}) => state,
    middleware: () => (next: unknown) => (action: unknown) => (next as (a: unknown) => unknown)(action),
  },
  useLoginMutation: () => [mockLoginFn, { isLoading: false }],
  useApiError: () => ({ getErrorMessage: (e: unknown) => String(e) }),
}));

const makeTestStore = () =>
  configureStore({
    reducer: {
      session: sessionReducer,
      authApi: (state = {}) => state,
    },
  });

const renderWithStore = (ui: React.ReactElement) => {
  const store = makeTestStore();
  return render(<Provider store={store}>{ui}</Provider>);
};

describe('SignInForm', () => {
  beforeEach(() => {
    mockLoginFn.mockReset();
  });

  it('renders email and password fields', () => {
    renderWithStore(<SignInForm />);
    expect(screen.getByPlaceholderText(/введите e-mail/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/введите пароль/i)).toBeInTheDocument();
  });

  it('shows validation errors on empty submit', async () => {
    renderWithStore(<SignInForm />);
    await userEvent.click(screen.getByRole('button', { name: /войти/i }));

    await waitFor(() => {
      expect(screen.getByText(/e-mail обязателен/i)).toBeInTheDocument();
    });
  });

  it('shows email format error for invalid email', async () => {
    renderWithStore(<SignInForm />);
    await userEvent.type(screen.getByPlaceholderText(/введите e-mail/i), 'notanemail');
    await userEvent.click(screen.getByRole('button', { name: /войти/i }));

    await waitFor(() => {
      expect(screen.getByText(/корректный e-mail/i)).toBeInTheDocument();
    });
  });

  it('calls login mutation with correct values on valid submit', async () => {
    mockLoginFn.mockResolvedValue({ data: { login: { accessToken: 'tok', userId: '1' } } });

    renderWithStore(<SignInForm />);
    await userEvent.type(screen.getByPlaceholderText(/введите e-mail/i), 'user@test.com');
    await userEvent.type(screen.getByPlaceholderText(/введите пароль/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /войти/i }));

    await waitFor(() => {
      expect(mockLoginFn).toHaveBeenCalledWith({ email: 'user@test.com', password: 'password123' });
    });
  });
});
