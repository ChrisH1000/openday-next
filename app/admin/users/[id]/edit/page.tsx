import { notFound } from 'next/navigation';

import { getAdminUser } from '@/app/lib/users';
import EditAdminUserForm from '@/app/ui/admin/EditAdminUserForm';

export default async function EditAdminUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getAdminUser(id);

  if (!user) {
    return notFound();
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Admin User</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Update the profile and access permissions for this administrator.
        </p>
      </div>
      <EditAdminUserForm user={user} />
    </div>
  );
}