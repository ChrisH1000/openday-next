// Edit OpenDay page
import EditOpendayForm from '@/app/ui/admin/EditOpendayForm';
import { fetchOpendayById } from '@/app/lib/data';
import { notFound } from 'next/navigation';

export default async function EditOpendayPage({ params }: { params: { id: string } }) {
  const openday = await fetchOpendayById(params.id);
  if (!openday) return notFound();
  return <EditOpendayForm openday={openday} />;
}
