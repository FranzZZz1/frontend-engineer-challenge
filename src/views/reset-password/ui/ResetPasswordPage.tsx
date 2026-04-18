import { Suspense } from 'react';
import { ResetPasswordForm } from '@features/auth/reset-password';
import { CenteredAuthLayout } from '@widgets/auth-layout';

export function ResetPasswordPage() {
  return (
    <CenteredAuthLayout>
      <Suspense fallback={<div>Загрузка...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </CenteredAuthLayout>
  );
}
