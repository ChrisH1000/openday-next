// Edit OpenDay page
import EditOpendayForm from '@/app/ui/admin/EditOpendayForm';
import { fetchOpendayById } from '@/app/lib/data';
import { notFound } from 'next/navigation';

type PageProps = {
  params: { id: string };
};

export default async function EditOpendayPage({ params }: PageProps) {
  const openday = await fetchOpendayById(params.id);
  if (!openday) return notFound();
  return <EditOpendayForm openday={openday} />;
}
