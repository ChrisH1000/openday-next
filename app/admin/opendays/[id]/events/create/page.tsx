"use client";
import { use } from 'react';
import CreateEventForm from '../../../../../ui/admin/CreateEventForm';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  
  return <CreateEventForm opendayId={resolvedParams.id} />;
}
