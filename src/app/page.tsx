import { redirect } from 'next/navigation';
import { routes } from '@shared/router/paths';

export default function RootPage() {
  redirect(routes.login);
}
