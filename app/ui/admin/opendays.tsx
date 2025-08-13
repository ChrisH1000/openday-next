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
    <div className="flex grow flex-col justify-between rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">OpenDays Management</h2>
        <Link href="/admin/opendays/create" prefetch={false} onClick={handleCreateClick}>
          <button className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-2 rounded-lg shadow hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 min-w-[160px] font-medium">
            + Create New OpenDay
          </button>
        </Link>
      </div>
      <OpendayList />
      <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <ArrowPathIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform duration-300 group-hover:animate-spin" />
          <h3 className="ml-2 text-sm text-gray-500 dark:text-gray-400">
            {minutesAgo === 0
              ? "Updated just now"
              : `Updated ${minutesAgo} minute${minutesAgo > 1 ? "s" : ""} ago`}
          </h3>
        </div>
        <button 
          onClick={() => setLastUpdate(new Date())}
          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          Refresh
        </button>
      </div>
    </div>
  );
}
