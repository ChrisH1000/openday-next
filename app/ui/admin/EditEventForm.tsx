"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLoading } from '@/app/ui/LoadingContext';
import { Event } from '@/app/lib/definitions';
import { parseErrorResponse } from '@/app/lib/client-errors';

export default function EditEventForm({ event, opendayId }: { event: Event; opendayId: string }) {
  const router = useRouter();
  const { setLoading } = useLoading();
  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description);
  const [interests, setInterests] = useState(event.interests);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    if (!title || !description || !interests) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/opendays/${opendayId}/events/${event.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, interests }),
      });

      if (!response.ok) {
        const parsed = await parseErrorResponse(response);
        setError(parsed.message);
        setFieldErrors(parsed.details ?? {});
        setLoading(false);
        return;
      }

      setLoading(false);
      router.push(`/admin/opendays/${opendayId}/events`);
    } catch (err) {
      console.error('Error updating event:', err);
      setError(err instanceof Error ? err.message : 'Failed to update Event. Please try again.');
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setLoading(true);
    router.push(`/admin/opendays/${opendayId}/events`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
        <input
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Enter event title"
        />
        {fieldErrors.title && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.title}</p>
        )}
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
        <textarea
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Enter event description"
          rows={4}
        />
        {fieldErrors.description && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.description}</p>
        )}
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Interests</label>
        <input
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          value={interests}
          onChange={e => setInterests(e.target.value)}
          placeholder="Enter interests (comma separated)"
        />
        {fieldErrors.interests && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.interests}</p>
        )}
      </div>

      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center min-w-[80px] transition-colors duration-200"
        >
          Save
        </button>
        <button
          type="button"
          className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-100 px-4 py-2 rounded-lg flex items-center min-w-[80px] transition-colors duration-200"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
