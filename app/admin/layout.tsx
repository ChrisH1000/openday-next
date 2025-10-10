import SideNav from '@/app/ui/sidenav';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

// export const experimental_ppr = true;
export const dynamic = 'force-dynamic';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  // Check if user is admin
  const adminUser = session.user as typeof session.user & { admin?: boolean };

  if (!adminUser?.admin) {
    redirect('/planner');
  }

  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden bg-gray-100 dark:bg-gray-900">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12 bg-white dark:bg-gray-800">
        {children}
      </div>
    </div>
  );
}