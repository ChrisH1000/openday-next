"use client";
import useSWR from 'swr';
import Spinner from '@/app/ui/Spinner';
import EditButton, { DeleteButton } from './EditButton';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { Event } from '@/app/lib/definitions';

const fetcher = (url: string) => fetch(url).then(res => res.json());

function useEvents(opendayId: string) {
  return useSWR(`/api/opendays/${opendayId}/events`, fetcher);
}

function formatTimestamp(timestamp: number) {
  const date = new Date(timestamp * 1000);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
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
          className="p-4 bg-white dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{event.title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{event.description}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500">Interests: {event.interests}</p>
            </div>
            <div className="flex items-center space-x-2 ml-4">
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

          {event.sessions && event.sessions.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sessions:</h3>
              <div className="space-y-2">
                {event.sessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between text-sm bg-gray-50 dark:bg-gray-600/30 p-2 rounded">
                    <span className="text-gray-600 dark:text-gray-400">
                      {formatTimestamp(session.starttime)} - {formatTimestamp(session.endtime)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}