"use client";
import Link from 'next/link';
import { use } from 'react';
import EventList from '../../../../ui/admin/EventList';
import useSWR from 'swr';
import { Openday } from '../../../../lib/definitions';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { data: opendays } = useSWR('/api/opendays', fetcher);
  const openday = opendays?.find((o: Openday) => o.id === resolvedParams.id);

  return (
    <div className="flex grow flex-col rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Events for {openday?.title || 'OpenDay'}</h1>
        <Link href="/admin" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors">
          Back to Admin
        </Link>
      </div>
      <EventList opendayId={resolvedParams.id} />
    </div>
  );
}