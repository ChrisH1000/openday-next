// Edit OpenDay page
import EditOpendayForm from '@/app/ui/admin/EditOpendayForm';
import { fetchOpendayById } from '@/app/lib/data';
import { notFound } from 'next/navigation';

export default async function EditOpendayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const openday = await fetchOpendayById(id);
  if (!openday) return notFound();
  
  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit OpenDay</h1>
        <p className="text-gray-600 dark:text-gray-400">Update the details for this OpenDay event</p>
      </div>
      <EditOpendayForm openday={openday} />
    </div>
  );
}
