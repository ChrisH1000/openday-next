import { auth } from '@/auth';
import Opendays from '@/app/ui/admin/opendays';
import AdminUsers from '@/app/ui/admin/AdminUsers';
import AdminStats from '@/app/ui/admin/AdminStats';
import { lusitana } from '@/app/ui/fonts';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  // Check if user is admin
  const adminUser = session.user as typeof session.user & { admin?: boolean; id?: string };

  if (!adminUser?.admin) {
    redirect('/planner');
  }

  const currentUserId = adminUser.id ?? '';

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl md:text-3xl font-bold text-gray-900 dark:text-white`}>
          Admin Dashboard
        </h1>
      </div>

      <div className="mt-6">
        <AdminStats />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <div className="col-span-1 md:col-span-4 lg:col-span-8">
          <Opendays />
        </div>
        <div className="col-span-1 md:col-span-4 lg:col-span-8">
          <AdminUsers currentUserId={currentUserId} />
        </div>
      </div>
    </div>
  );
}