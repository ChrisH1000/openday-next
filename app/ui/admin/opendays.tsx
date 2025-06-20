"use client";
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import OpendayList from './OpendayList';
import Link from 'next/link';
import { useLoading } from '@/app/ui/LoadingContext';
import { useState } from 'react';

export default function Opendays() {
  const { setLoading } = useLoading();

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
      <div className="flex items-center pb-2 pt-6">
        <ArrowPathIcon className="h-5 w-5 text-gray-500" />
        <h3 className="ml-2 text-sm text-gray-500 ">Updated just now</h3>
      </div>
    </div>
  );
}
