import { ArrowPathIcon } from '@heroicons/react/24/outline';
import OpendayList from './OpendayList';
import Link from 'next/link';

export default function Opendays() {
  return (
    <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
      <div className="flex justify-end mb-4">
        <Link href="/admin/opendays/create">
          <button className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition-colors">
            Create new Openday
          </button>
        </Link>
      </div>
      <OpendayList />
      <div className="flex items-center pb-2 pt-6">
        <ArrowPathIcon className="h-5 w-5 text-gray-500" />
        <h3 className="ml-2 text-sm text-gray-500 ">Updated just now</h3>
      </div>
    </div>
  );
}
