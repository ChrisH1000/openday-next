"use client";
import Link from 'next/link';
import clsx from 'clsx';
import EditButton, { DeleteButton } from './EditButton';
import { cabin } from '@/app/ui/fonts';
import { toast } from 'react-toastify';
import { useState } from 'react';
import useSWR from 'swr';
import Spinner from '@/app/ui/Spinner';

type Openday = {
  id: string;
  title: string;
  campus: string;
  starttime: number;
  endtime: number;
  status: string;
};

const fetcher = (url: string) => fetch(url).then(res => res.json());

function useOpendays() {
  return useSWR('/api/opendays', fetcher);
}

function formatTimestamp(timestamp: number, doDate: boolean = true) {
  const date = new Date(timestamp * 1000);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  if (doDate) {
    return `${day}/${month}/${year}`;
  } else {
    return `${hours}:${minutes}`;
  }
}

const STATUS_LABELS: Record<string, { label: string; bgColor: string; textColor: string; badgeColor: string }> = {
  live: { 
    label: 'Live', 
    bgColor: 'bg-green-50 dark:bg-green-900/30', 
    textColor: 'text-green-800 dark:text-green-200',
    badgeColor: 'bg-green-500'
  },
  'under construction': { 
    label: 'Under Construction', 
    bgColor: 'bg-gray-100 dark:bg-gray-700/50', 
    textColor: 'text-gray-800 dark:text-gray-200',
    badgeColor: 'bg-gray-500'
  },
  archived: { 
    label: 'Archived', 
    bgColor: 'bg-red-50 dark:bg-red-900/30', 
    textColor: 'text-red-800 dark:text-red-200',
    badgeColor: 'bg-red-500'
  },
};

export default function OpendayList() {
  const { data: opendays, error, isLoading } = useOpendays();

  if (isLoading) return (
    <div className="flex justify-center p-12">
      <Spinner className="h-10 w-10 text-blue-500" />
    </div>
  );
  if (error) return (
    <div className="p-6 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg">
      Failed to load OpenDays. Please try refreshing the page.
    </div>
  );
  if (!opendays || opendays.length === 0) return (
    <div className="p-12 text-center text-gray-500 dark:text-gray-400">
      <p className="text-lg">No OpenDays found</p>
      <p className="text-sm mt-2">Create your first OpenDay to get started</p>
    </div>
  );

  return (
    <div className="mt-6 first:mt-0">
      {Object.entries(STATUS_LABELS).map(([status, { label, bgColor, textColor, badgeColor }]) => {
        const filtered = opendays.filter((day: Openday) =>
          day.status?.toLowerCase().trim() === status.toLowerCase().trim()
        );
        return filtered.length ? (
          <div key={status} className={`mb-8 ${bgColor} p-4 rounded-xl border border-gray-200 dark:border-gray-700`}>
            <div className="flex items-center mb-4">
              <span className={`inline-block w-3 h-3 rounded-full ${badgeColor} mr-2`}></span>
              <h2 className={`${cabin.className} text-xl font-bold ${textColor}`}>{label}</h2>
              <span className="ml-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs font-medium px-2 py-1 rounded-full">
                {filtered.length}
              </span>
            </div>
            <div className="space-y-4">
              {filtered.map((openday: Openday, i: number) => (
                <div
                  key={openday.id}
                  className={clsx(
                    'grid grid-cols-1 md:grid-cols-12 items-start md:items-center p-4 bg-white dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow',
                    { 'border-t border-gray-200 dark:border-gray-600': i !== 0 },
                  )}
                >
                  <div className="md:col-span-5 min-w-0">
                    <p className="truncate text-sm md:text-base font-medium text-gray-900 dark:text-white">
                      <Link 
                        href={`/admin/opendays/${openday.id}`} 
                        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {openday.title}
                      </Link>
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{openday.campus}</p>
                  </div>
                  <div className="md:col-span-5 mt-2 md:mt-0">
                    <p className={`${cabin.className} truncate text-sm font-medium md:text-base text-gray-700 dark:text-gray-300`}>
                      {formatTimestamp(openday.starttime)} {formatTimestamp(openday.starttime, false)} - {formatTimestamp(openday.endtime, false)}
                    </p>
                  </div>
                  <div className="md:col-span-2 flex md:justify-end items-center mt-2 md:mt-0 space-x-2">
                    <EditButton href={`/admin/opendays/${openday.id}/edit`} />
                    <DeleteButton onDelete={async () => {
                      const ConfirmDelete = () => {
                        const [loading, setLoading] = useState(false);
                        const handleConfirm = async () => {
                          setLoading(true);
                          try {
                            const response = await fetch(`/api/opendays/${openday.id}`, { method: 'DELETE' });
                            if (!response.ok) throw new Error('Network response was not ok');
                            toast.success('OpenDay deleted successfully.');
                            window.location.reload();
                          } catch {
                            toast.error('Failed to delete OpenDay.');
                          }
                          setLoading(false);
                        };
                        return (
                          <div>
                            <p className="mb-4">Are you sure you want to delete this OpenDay?</p>
                            <div className="flex justify-end space-x-2">
                              <button 
                                className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                                onClick={() => toast.dismiss()}
                                disabled={loading}
                              >
                                Cancel
                              </button>
                              <button 
                                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
                                onClick={handleConfirm} 
                                disabled={loading}
                              >
                                {loading ? 'Deleting...' : 'Delete'}
                              </button>
                            </div>
                          </div>
                        );
                      };
                      toast.info(<ConfirmDelete />, { autoClose: false, closeOnClick: false });
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null;
      })}
    </div>
  );
}
