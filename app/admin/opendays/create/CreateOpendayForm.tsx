"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createOpenday } from '@/app/lib/actions';
import { useLoading } from '@/app/ui/LoadingContext';

export default function CreateOpendayForm() {
  const router = useRouter();
  const { setLoading } = useLoading();
  const [title, setTitle] = useState('');
  const [campus, setCampus] = useState('');
  const [starttime, setStarttime] = useState('');
  const [endtime, setEndtime] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const start = Math.floor(new Date(starttime).getTime() / 1000);
    const end = Math.floor(new Date(endtime).getTime() / 1000);
    console.log('Submitting:', { title, campus, starttime, endtime, start, end });
    if (!title || !campus || isNaN(start) || isNaN(end)) {
      setLoading(false);
      alert('Please fill in all fields with valid values.');
      return;
    }
    await createOpenday({ title, campus, starttime: start, endtime: end });
    setLoading(false);
    router.push('/admin');
  }
  const handleCancel = () => {
    setLoading(true);
    router.push('/admin');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded shadow">
      <div>
        <label className="block mb-1">Title</label>
        <input className="border p-2 w-full" value={title} onChange={e => setTitle(e.target.value)} />
      </div>
      <div>
        <label className="block mb-1">Campus</label>
        <input className="border p-2 w-full" value={campus} onChange={e => setCampus(e.target.value)} />
      </div>
      <div>
        <label className="block mb-1">Start Time</label>
        <input
          className="border p-2 w-full"
          type="datetime-local"
          value={starttime}
          onChange={e => setStarttime(e.target.value)}
        />
      </div>
      <div>
        <label className="block mb-1">End Time</label>
        <input
          className="border p-2 w-full"
          type="datetime-local"
          value={endtime}
          onChange={e => setEndtime(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded flex items-center min-w-[80px]">
          Save
        </button>
        <button type="button" className="bg-gray-300 text-gray-800 px-4 py-2 rounded flex items-center min-w-[80px]" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
