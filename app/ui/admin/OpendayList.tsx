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

const STATUS_LABELS: Record<string, { label: string; bgColor: string }> = {
  live: { label: 'Live', bgColor: 'bg-green-50' },
  'under construction': { label: 'Under Construction', bgColor: 'bg-gray-100' },
  archived: { label: 'Archived', bgColor: 'bg-red-50' },
};

export default function OpendayList() {
  const { data: opendays, error, isLoading } = useOpendays();

  if (isLoading) return <div className="flex justify-center p-8"><Spinner className="h-8 w-8 text-blue-500" /></div>;
  if (error) return <div className="p-4 text-red-500">Failed to load OpenDays.</div>;
  if (!opendays || opendays.length === 0) return <div className="p-4 text-gray-400">No OpenDays</div>;

  return (
    <div className="mt-6 first:mt-0">
      {Object.entries(STATUS_LABELS).map(([status, { label, bgColor }]) => {
        const filtered = opendays.filter((day: Openday) =>
          day.status?.toLowerCase().trim() === status.toLowerCase().trim()
        );
        return filtered.length ? (
          <div key={status} className={`mb-8 ${bgColor} p-2 rounded`}>
            <h2 className={`${cabin.className} mb-4 text-xl md:text-1xl pt-2`}>{label}</h2>
            {filtered.map((openday: Openday, i: number) => (
              <div
                key={openday.id}
                className={clsx(
                  'grid md:grid-cols-12 grid-cols-1 items-start md:items-center p-4 bg-white',
                  { 'border-t': i !== 0 },
                )}
              >
                <div className="md:col-span-5 min-w-0">
                  <p className="truncate text-sm md:text-base font-medium">
                    <Link key={openday.title} href={`/admin/opendays/${openday.id}`}>
                      {openday.title}
                    </Link>
                  </p>
                  <p className="text-sm text-gray-500 md:block">{openday.campus}</p>
                </div>
                <div className="md:col-span-5 mt-2 md:mt-0">
                  <p className={`${cabin.className} truncate text-sm font-medium md:text-base`}>
                    {formatTimestamp(openday.starttime)} {formatTimestamp(openday.starttime, false)} till {formatTimestamp(openday.endtime, false)}
                  </p>
                </div>
                <div className="md:col-span-2 flex md:justify-center items-center mt-2 md:mt-0">
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
                          <p>Are you sure you want to delete this OpenDay?</p>
                          <button className="mr-2 text-red-500" onClick={handleConfirm} disabled={loading}>
                            {loading ? 'Deleting...' : 'Confirm'}
                          </button>
                          <button onClick={() => toast.dismiss()} disabled={loading}>Cancel</button>
                        </div>
                      );
                    };
                    toast.info(<ConfirmDelete />, { autoClose: false, closeOnClick: false });
                  }} />
                </div>
              </div>
            ))}
          </div>
        ) : null;
      })}
    </div>
  );
}
