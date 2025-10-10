"use client";

// EditOpendayForm component
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLoading } from '@/app/ui/LoadingContext';
import { parseErrorResponse } from '@/app/lib/client-errors';

interface Openday {
  id: string;
  title: string;
  campus: string;
  starttime: number;
  endtime: number;
  status: string;
}

export default function EditOpendayForm({ openday }: { openday: Openday }) {
  const router = useRouter();
  const { setLoading } = useLoading();
  const [title, setTitle] = useState(openday.title);
  const [campus, setCampus] = useState(openday.campus);
  const [starttime, setStarttime] = useState<string>(() => {
    // Convert unix timestamp to yyyy-MM-ddTHH:mm for datetime-local input
    if (!openday.starttime) return '';
    try {
      const date = new Date(openday.starttime * 1000);
      const tzOffset = date.getTimezoneOffset() * 60000;
      const localISO = new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
      return localISO;
    } catch (e) {
      console.error('Error converting starttime:', e);
      return '';
    }
  });
  const [endtime, setEndtime] = useState<string>(() => {
    if (!openday.endtime) return '';
    try {
      const date = new Date(openday.endtime * 1000);
      const tzOffset = date.getTimezoneOffset() * 60000;
      const localISO = new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
      return localISO;
    } catch (e) {
      console.error('Error converting endtime:', e);
      return '';
    }
  });
  const [status, setStatus] = useState(openday.status);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    // Validate inputs
    if (!title || !campus || !starttime || !endtime || !status) {
      setError('Please fill in all fields.');
      return;
    }

    const start = Math.floor(new Date(starttime).getTime() / 1000);
    const end = Math.floor(new Date(endtime).getTime() / 1000);

    if (isNaN(start) || isNaN(end)) {
      setError('Please enter valid date and time values.');
      return;
    }

    if (start >= end) {
      setError('End time must be after start time.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/opendays/${openday.id}/edit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, campus, starttime: start, endtime: end, status }),
      });

      if (!response.ok) {
        const parsed = await parseErrorResponse(response);
        setError(parsed.message);
        setFieldErrors(parsed.details ?? {});
        setLoading(false);
        return;
      }
      setLoading(false);
      router.push('/admin');
    } catch (err) {
      console.error('Error updating openday:', err);
      setError(err instanceof Error ? err.message : 'Failed to update OpenDay. Please try again.');
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setLoading(true);
    router.push('/admin');
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
          placeholder="Enter OpenDay title"
        />
        {fieldErrors.title && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.title}</p>
        )}
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Campus</label>
        <input
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          value={campus}
          onChange={e => setCampus(e.target.value)}
          placeholder="Enter campus name"
        />
        {fieldErrors.campus && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.campus}</p>
        )}
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Start Time</label>
        <input
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          type="datetime-local"
          value={starttime}
          onChange={e => setStarttime(e.target.value)}
        />
        {fieldErrors.starttime && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.starttime}</p>
        )}
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">End Time</label>
        <input
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          type="datetime-local"
          value={endtime}
          onChange={e => setEndtime(e.target.value)}
        />
        {fieldErrors.endtime && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.endtime}</p>
        )}
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
        <select
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          value={status}
          onChange={e => setStatus(e.target.value)}
        >
          <option value="live">Live</option>
          <option value="under construction">Under Construction</option>
          <option value="archived">Archived</option>
        </select>
        {fieldErrors.status && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.status}</p>
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
