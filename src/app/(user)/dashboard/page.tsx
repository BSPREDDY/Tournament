import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/src/lib/auth';
import DashboardContent from '@/src/app/(user)/dashboard/dashboard-content';

export default async function DashboardPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect('/auth/login');
    }

    return <DashboardContent user={user} />;
}
