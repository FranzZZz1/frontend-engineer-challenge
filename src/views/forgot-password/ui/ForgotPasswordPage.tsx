import { ForgotPasswordForm } from '@features/auth/forgot-password';
import { CenteredAuthLayout } from '@widgets/auth-layout';

export function ForgotPasswordPage() {
  return (
    <CenteredAuthLayout>
      <ForgotPasswordForm />
    </CenteredAuthLayout>
  );
}
