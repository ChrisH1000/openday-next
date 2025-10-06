"use client";
import { use } from 'react';
import EditEventForm from '../../../../../../ui/admin/EditEventForm';
import useSWR from 'swr';
import Spinner from '../../../../../../ui/Spinner';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Page({ params }: { params: Promise<{ id: string; eventId: string }> }) {
  const resolvedParams = use(params);
  const { data: events, error, isLoading } = useSWR(`/api/opendays/${resolvedParams.id}/events`, fetcher);
  
  if (isLoading) return (
    <div className="flex justify-center p-12">
      <Spinner className="h-10 w-10 text-blue-500" />
    </div>
  );
  
  if (error) return (
    <div className="p-6 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg">
      Failed to load Event. Please try refreshing the page.
    </div>
  );
  
  const event = events?.find((e: any) => e.id === resolvedParams.eventId);
  
  if (!event) return (
    <div className="p-6 text-gray-500 dark:text-gray-400">
      Event not found.
    </div>
  );
  
  return <EditEventForm event={event} opendayId={resolvedParams.id} />;
}
