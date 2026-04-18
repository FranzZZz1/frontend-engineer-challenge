import { SignUpForm } from '@features/auth/sign-up';
import { routes } from '@shared/router/paths';
import { SplitAuthLayout } from '@widgets/auth-layout';

export function RegisterPage() {
  return (
    <SplitAuthLayout footerText="Уже есть аккаунт?" footerLinkText="Войти" footerLinkHref={routes.login}>
      <SignUpForm />
    </SplitAuthLayout>
  );
}
