import { redirect } from 'next/navigation';

/**
 * /auth → /auth/role-selection
 */
export default function AuthPage() {
    redirect('/auth/role-selection');
}
