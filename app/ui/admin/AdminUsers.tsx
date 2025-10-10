"use client";

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

import { useLoading } from '@/app/ui/LoadingContext';

import AdminUserList from './AdminUserList';

type AdminUsersProps = {
  currentUserId: string;
};

export default function AdminUsers({ currentUserId }: AdminUsersProps) {
  const { setLoading } = useLoading();
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [minutesAgo, setMinutesAgo] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMinutesAgo(Math.floor((Date.now() - lastUpdate.getTime()) / 60000));
    }, 1000);
    return () => clearInterval(interval);
  }, [lastUpdate]);

  const handleCreateClick = () => {
    setLoading(true);
  };

  const handleRefreshTimestamp = useCallback(() => {
    setLastUpdate(new Date());
  }, []);

  return (
    <div className="flex grow flex-col justify-between rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Admin Users</h2>
        <Link href="/admin/users/create" prefetch={false} onClick={handleCreateClick}>
          <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 min-w-[160px] font-medium">
            + Create Admin User
          </button>
        </Link>
      </div>
      <AdminUserList currentUserId={currentUserId} onRefresh={handleRefreshTimestamp} />
      <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          {minutesAgo === 0
            ? 'Updated just now'
            : `Updated ${minutesAgo} minute${minutesAgo > 1 ? 's' : ''} ago`}
        </div>
        <button
          onClick={handleRefreshTimestamp}
          className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          Refresh
        </button>
      </div>
    </div>
  );
}