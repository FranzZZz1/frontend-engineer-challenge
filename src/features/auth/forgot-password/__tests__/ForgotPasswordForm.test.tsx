import { Provider } from 'react-redux';
import { sessionReducer } from '@entities/session';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ForgotPasswordForm } from '../ui/ForgotPasswordForm';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock(
  '@static/icons/chevron.svg',
  () =>
    function ChevronIcon() {
      return <svg data-testid="chevron" />;
    },
);

const mockRequestResetFn = jest.fn();

jest.mock('@shared/api', () => ({
  authApi: {
    reducerPath: 'authApi',
    reducer: (state = {}) => state,
    middleware: () => (next: unknown) => (action: unknown) => (next as (a: unknown) => unknown)(action),
  },
  useRequestPasswordResetMutation: () => [mockRequestResetFn, { isLoading: false }],
}));

const makeTestStore = () =>
  configureStore({
    reducer: {
      session: sessionReducer,
      authApi: (state = {}) => state,
    },
  });

const renderWithStore = (ui: React.ReactElement) => render(<Provider store={makeTestStore()}>{ui}</Provider>);

describe('ForgotPasswordForm', () => {
  beforeEach(() => {
    mockRequestResetFn.mockReset();
  });

  it('renders the email input field', () => {
    renderWithStore(<ForgotPasswordForm />);
    expect(screen.getByPlaceholderText(/введите e-mail/i)).toBeInTheDocument();
  });

  it('shows validation error on empty submit', async () => {
    renderWithStore(<ForgotPasswordForm />);
    await userEvent.click(screen.getByRole('button', { name: /восстановить пароль/i }));

    await waitFor(() => {
      expect(screen.getByText(/введите email/i)).toBeInTheDocument();
    });
  });

  it('shows email format error for invalid email', async () => {
    renderWithStore(<ForgotPasswordForm />);
    await userEvent.type(screen.getByPlaceholderText(/введите e-mail/i), 'notanemail');
    await userEvent.click(screen.getByRole('button', { name: /восстановить пароль/i }));

    await waitFor(() => {
      expect(screen.getByText(/корректный email/i)).toBeInTheDocument();
    });
  });

  it('calls requestReset and shows success state after submit', async () => {
    mockRequestResetFn.mockResolvedValue({});

    renderWithStore(<ForgotPasswordForm />);
    await userEvent.type(screen.getByPlaceholderText(/введите e-mail/i), 'user@test.com');
    await userEvent.click(screen.getByRole('button', { name: /восстановить пароль/i }));

    await waitFor(() => {
      expect(mockRequestResetFn).toHaveBeenCalledWith('user@test.com');
      expect(screen.getByText(/проверьте свою почту/i)).toBeInTheDocument();
    });
  });

  it('shows success state even when request fails (UX: always confirm)', async () => {
    mockRequestResetFn.mockResolvedValue({ error: { status: 'FETCH_ERROR', error: 'network error' } });

    renderWithStore(<ForgotPasswordForm />);
    await userEvent.type(screen.getByPlaceholderText(/введите e-mail/i), 'user@test.com');
    await userEvent.click(screen.getByRole('button', { name: /восстановить пароль/i }));

    await waitFor(() => {
      expect(screen.getByText(/проверьте свою почту/i)).toBeInTheDocument();
    });
  });
});
