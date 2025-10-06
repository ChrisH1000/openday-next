"use client";
import useSWR from 'swr';
import Spinner from '@/app/ui/Spinner';
import EditButton, { DeleteButton } from './EditButton';
import { toast } from 'react-toastify';
import { useState } from 'react';

type Event = {
  id: string;
  title: string;
  description: string;
  interests: string;
  openday_fk: string;
};

const fetcher = (url: string) => fetch(url).then(res => res.json());

function useEvents(opendayId: string) {
  return useSWR(`/api/opendays/${opendayId}/events`, fetcher);
}

export default function EventList({ opendayId }: { opendayId: string }) {
  const { data: events, error, isLoading } = useEvents(opendayId);

  if (isLoading) return (
    <div className="flex justify-center p-12">
      <Spinner className="h-10 w-10 text-blue-500" />
    </div>
  );
  if (error) return (
    <div className="p-6 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg">
      Failed to load Events. Please try refreshing the page.
    </div>
  );
  if (!events || events.length === 0) return (
    <div className="p-12 text-center text-gray-500 dark:text-gray-400">
      <p className="text-lg">No Events found</p>
      <p className="text-sm mt-2">Create your first Event to get started</p>
    </div>
  );

  return (
    <div className="space-y-4">
      {events.map((event: Event) => (
        <div
          key={event.id}
          className="grid grid-cols-1 md:grid-cols-12 items-start md:items-center p-4 bg-white dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow"
        >
          <div className="md:col-span-10 min-w-0">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{event.title}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{event.description}</p>
            <p className="text-xs text-gray-500 dark:text-gray-500">Interests: {event.interests}</p>
          </div>
          <div className="md:col-span-2 flex md:justify-end items-center mt-2 md:mt-0 space-x-2">
            <EditButton href={`/admin/opendays/${opendayId}/events/${event.id}/edit`} />
            <DeleteButton onDelete={async () => {
              const ConfirmDelete = () => {
                const [loading, setLoading] = useState(false);
                const handleConfirm = async () => {
                  setLoading(true);
                  try {
                    const response = await fetch(`/api/opendays/${opendayId}/events/${event.id}`, { method: 'DELETE' });
                    if (!response.ok) throw new Error('Network response was not ok');
                    toast.success('Event deleted successfully.');
                    window.location.reload();
                  } catch {
                    toast.error('Failed to delete Event.');
                  }
                  setLoading(false);
                };
                return (
                  <div>
                    <p className="mb-4">Are you sure you want to delete this Event?</p>
                    <div className="flex justify-end space-x-2">
                      <button
                        className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                        onClick={() => toast.dismiss()}
                        disabled={loading}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50"
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
  );
}