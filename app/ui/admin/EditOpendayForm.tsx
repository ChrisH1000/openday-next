"use client";

// EditOpendayForm component
import { useState } from 'react';
import { updateOpenday } from '@/app/lib/actions';
import { useRouter } from 'next/navigation';

export default function EditOpendayForm({ openday }: { openday: any }) {
  const router = useRouter();
  const [title, setTitle] = useState(openday.title);
  const [campus, setCampus] = useState(openday.campus);
  const [starttime, setStarttime] = useState(openday.starttime);
  const [endtime, setEndtime] = useState(openday.endtime);
  const [status, setStatus] = useState(openday.status);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateOpenday({ id: openday.id, title, campus, starttime, endtime, status });
    // Optionally redirect or show success
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
        <label className="block mb-1">Start Time (Unix)</label>
        <input className="border p-2 w-full" value={starttime} onChange={e => setStarttime(Number(e.target.value))} />
      </div>
      <div>
        <label className="block mb-1">End Time (Unix)</label>
        <input className="border p-2 w-full" value={endtime} onChange={e => setEndtime(Number(e.target.value))} />
      </div>
      <div>
        <label className="block mb-1">Status</label>
        <select className="border p-2 w-full" value={status} onChange={e => setStatus(e.target.value)}>
          <option value="live">Live</option>
          <option value="under construction">Under Construction</option>
          <option value="archived">Archived</option>
        </select>
      </div>
      <div className="flex gap-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
        <button type="button" className="bg-gray-300 text-gray-800 px-4 py-2 rounded" onClick={() => router.push('/admin')}>Cancel</button>
      </div>
    </form>
  );
}
