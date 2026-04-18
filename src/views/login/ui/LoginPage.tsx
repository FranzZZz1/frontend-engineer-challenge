import { SignInForm } from '@features/auth/sign-in';
import { routes } from '@shared/router/paths';
import { SplitAuthLayout } from '@widgets/auth-layout';

export function LoginPage() {
  return (
    <SplitAuthLayout
      footerText="Еще не зарегистрированы?"
      footerLinkText="Регистрация"
      footerLinkHref={routes.register}
    >
      <SignInForm />
    </SplitAuthLayout>
  );
}
