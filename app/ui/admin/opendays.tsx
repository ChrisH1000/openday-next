import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { fetchOpendays } from '../../lib/data';
import { createOpenday } from '../../lib/actions';
import OpendayList from './OpendayList';

export default async function Opendays() {
  async function handleCreateOpenday(formData: FormData) {
    'use server';
    const title = formData.get('title') as string;
    const campus = formData.get('campus') as string;
    // Convert date strings to Unix timestamps (seconds)
    const starttimeStr = formData.get('starttime') as string;
    const endtimeStr = formData.get('endtime') as string;
    const starttime = Math.floor(new Date(starttimeStr).getTime() / 1000);
    const endtime = Math.floor(new Date(endtimeStr).getTime() / 1000);
    await createOpenday({ title, campus, starttime, endtime });
  }

  return (
    <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
      <form action={handleCreateOpenday} className="mb-6 flex flex-col md:flex-row gap-2 items-start md:items-end bg-white p-4 rounded shadow">
        <input name="title" placeholder="Title" className="border p-2 rounded" required />
        <input name="campus" placeholder="Campus" className="border p-2 rounded" required />
        <input name="starttime" placeholder="Start Date & Time" className="border p-2 rounded" type="datetime-local" required />
        <input name="endtime" placeholder="End Date & Time" className="border p-2 rounded" type="datetime-local" required />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Create OpenDay</button>
      </form>
      <OpendayList bgColor="bg-white" />
      <div className="flex items-center pb-2 pt-6">
        <ArrowPathIcon className="h-5 w-5 text-gray-500" />
        <h3 className="ml-2 text-sm text-gray-500 ">Updated just now</h3>
      </div>
    </div>
  );
}
