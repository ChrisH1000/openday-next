"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLoading } from '@/app/ui/LoadingContext';
import { lusitana } from '@/app/ui/fonts';
import { parseErrorResponse } from '@/app/lib/client-errors';

export default function CreateOpendayForm() {
  const router = useRouter();
  const { setLoading } = useLoading();
  const [title, setTitle] = useState('');
  const [campus, setCampus] = useState('');
  const [starttime, setStarttime] = useState('');
  const [endtime, setEndtime] = useState('');
  const [status, setStatus] = useState('under construction');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    if (!title || !campus || !starttime || !endtime) {
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
      const response = await fetch('/api/opendays', {
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
      setLoading(false);
      setError(err instanceof Error ? err.message : 'Failed to create OpenDay. Please try again.');
      console.error('Error creating openday:', err);
    }
  }

  const handleCancel = () => {
    setLoading(true);
    router.push('/admin');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <h1 className={`${lusitana.className} text-2xl font-bold text-gray-900 dark:text-white mb-6`}>
          Create New OpenDay
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Title
            </label>
            <input
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Enter OpenDay title"
            />
            {fieldErrors.title && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.title}</p>
            )}
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Campus
            </label>
            <input
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              value={campus}
              onChange={e => setCampus(e.target.value)}
              placeholder="Enter campus name"
            />
            {fieldErrors.campus && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.campus}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Start Time
              </label>
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
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                End Time
              </label>
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
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              value={status}
              onChange={e => setStatus(e.target.value)}
            >
              <option value="under construction">Under Construction</option>
              <option value="live">Live</option>
              <option value="archived">Archived</option>
            </select>
            {fieldErrors.status && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.status}</p>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg shadow hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-medium"
            >
              Create OpenDay
            </button>
            <button
              type="button"
              className="flex-1 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white px-6 py-3 rounded-lg shadow hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors font-medium"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
