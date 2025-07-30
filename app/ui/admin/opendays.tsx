"use client";
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import OpendayList from './OpendayList';
import Link from 'next/link';
import { useLoading } from '@/app/ui/LoadingContext';

export default function Opendays() {
  const { setLoading } = useLoading();
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [minutesAgo, setMinutesAgo] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMinutesAgo(Math.floor((Date.now() - lastUpdate.getTime()) / 60000));
    }, 1000);
    return () => clearInterval(interval);
  }, [lastUpdate]);

  // Call setLastUpdate(new Date()) wherever your data is refreshed

  const handleCreateClick = () => {
    setLoading(true);
  };

  return (
    <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
      <div className="flex justify-end mb-4">
        <Link href="/admin/opendays/create" prefetch={false} onClick={handleCreateClick}>
          <button className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition-colors min-w-[160px]">
            Create new Openday
          </button>
        </Link>
      </div>
      <OpendayList />
      <div className="flex items-center pb-2 pt-6 group">
        <ArrowPathIcon className="h-5 w-5 text-gray-500 transition-transform duration-300 group-hover:animate-spin" />
        <h3 className="ml-2 text-sm text-gray-500 ">
          {minutesAgo === 0
            ? "Updated just now"
            : `Updated ${minutesAgo} minute${minutesAgo > 1 ? "s" : ""} ago`}
        </h3>
      </div>
    </div>
  );
}
