"use client";
import Link from 'next/link';
import { use } from 'react';
import EventList from '../../../../ui/admin/EventList';
import useSWR from 'swr';
import { Openday } from '../../../../lib/definitions';
import { useLoading } from '@/app/ui/LoadingContext';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { setLoading } = useLoading();
  const { data: opendays } = useSWR('/api/opendays', fetcher);
  const openday = opendays?.find((o: Openday) => o.id === resolvedParams.id);

  const handleCreateClick = () => {
    setLoading(true);
  };

  return (
    <div className="flex grow flex-col rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Events for {openday?.title || 'OpenDay'}</h1>
        <div className="flex gap-2">
          <Link
            href={`/admin/opendays/${resolvedParams.id}/events/create`}
            prefetch={false}
            onClick={handleCreateClick}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-medium"
          >
            + Create Event
          </Link>
          <Link href="/admin" className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white px-4 py-2 rounded transition-colors">
            Back to Admin
          </Link>
        </div>
      </div>
      <EventList opendayId={resolvedParams.id} openday={openday} />
    </div>
  );
}