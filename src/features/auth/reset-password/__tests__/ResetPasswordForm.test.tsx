import { Provider } from 'react-redux';
import { sessionReducer } from '@entities/session';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ResetPasswordForm } from '../ui/ResetPasswordForm';

const mockGetParam = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  useSearchParams: () => ({ get: mockGetParam }),
}));

const mockResetFn = jest.fn();

jest.mock('@shared/api', () => ({
  authApi: {
    reducerPath: 'authApi',
    reducer: (state = {}) => state,
    middleware: () => (next: unknown) => (action: unknown) => (next as (a: unknown) => unknown)(action),
  },
  useResetPasswordMutation: () => [mockResetFn, { isLoading: false, isError: false, isSuccess: false }],
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

describe('ResetPasswordForm', () => {
  beforeEach(() => {
    mockResetFn.mockReset();
    mockGetParam.mockReturnValue('valid-token-123');
  });

  it('renders password fields when token is present', () => {
    renderWithStore(<ResetPasswordForm />);
    expect(screen.getByPlaceholderText(/введите пароль/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/повторите пароль/i)).toBeInTheDocument();
  });

  it('shows invalid link message when token is missing', () => {
    mockGetParam.mockReturnValue(null);
    renderWithStore(<ResetPasswordForm />);
    expect(screen.getByText(/ссылка для сброса пароля недействительна/i)).toBeInTheDocument();
  });

  it('shows validation error when fields are empty on submit', async () => {
    renderWithStore(<ResetPasswordForm />);
    await userEvent.click(screen.getByRole('button', { name: /сохранить пароль/i }));

    await waitFor(() => {
      expect(screen.getByText(/не менее 8 символов/i)).toBeInTheDocument();
    });
  });

  it('shows error when passwords do not match', async () => {
    renderWithStore(<ResetPasswordForm />);
    await userEvent.type(screen.getByPlaceholderText(/введите пароль/i), 'Password1');
    await userEvent.type(screen.getByPlaceholderText(/повторите пароль/i), 'Password2');
    await userEvent.click(screen.getByRole('button', { name: /сохранить пароль/i }));

    await waitFor(() => {
      expect(screen.getByText(/пароли не совпадают/i)).toBeInTheDocument();
    });
  });

  it('calls resetPassword mutation with token and new password on valid submit', async () => {
    mockResetFn.mockResolvedValue({});

    renderWithStore(<ResetPasswordForm />);
    await userEvent.type(screen.getByPlaceholderText(/введите пароль/i), 'Password1');
    await userEvent.type(screen.getByPlaceholderText(/повторите пароль/i), 'Password1');
    await userEvent.click(screen.getByRole('button', { name: /сохранить пароль/i }));

    await waitFor(() => {
      expect(mockResetFn).toHaveBeenCalledWith({
        token: 'valid-token-123',
        newPassword: 'Password1',
      });
    });
  });
});
