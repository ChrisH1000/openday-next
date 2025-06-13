import { ArrowPathIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { fetchOpendays } from '../../lib/data';
import Link from 'next/link';
import { cabin } from '@/app/ui/fonts';
import clsx from 'clsx';
// import { LatestInvoice } from '@/app/lib/definitions';
export default async function Opendays() { // Make component async, remove the props
  const opendays = await fetchOpendays();
  const liveOpendays = opendays.filter((openday) => openday.status === 'live');
  const underConstructionOpendays = opendays.filter((openday) => openday.status === 'under construction');
  const archivedOpendays = opendays.filter((openday) => openday.status === 'archived');
  console.log(opendays);
  return (
    <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
      <div className="bg-green-50 p-2">
        <h2 className={`${cabin.className} mb-4 text-xl md:text-1xl pt-2`}>Live OpenDays</h2>
        {/* Header row: hide on mobile, show on md+ */}
        <div className="hidden md:grid grid-cols-12 gap-2 px-2 py-1 font-semibold text-gray-700 text-sm md:text-base border-b border-gray-200">
          <div className="col-span-5">Title / Campus</div>
          <div className="col-span-5">Date / Time</div>
          <div className="col-span-2 text-center">Edit</div>
        </div>
        {liveOpendays.map((openday, i) => {
          return (
            <div
              key={openday.id}
              className={clsx(
                'grid md:grid-cols-12 grid-cols-1 items-start md:items-center p-4 bg-white',
                {
                  'border-t': i !== 0,
                },
              )}
            >
              {/* Title & Campus */}
              <div className="md:col-span-5 min-w-0">
                <p className="truncate text-sm md:text-base font-medium">
                  <Link
                    key={openday.title}
                    href={`/admin/opendays/${openday.id}`}
                  >
                    {openday.title}
                  </Link>
                </p>
                {/* Show campus always on mobile, only on md+ as subtext */}
                <p className="text-sm text-gray-500 md:block">
                  {openday.campus}
                </p>
              </div>
              {/* Date/Time */}
              <div className="md:col-span-5 mt-2 md:mt-0">
                <p className={`${cabin.className} truncate text-sm font-medium md:text-base`}>
                  {formatTimestamp(openday.starttime)} {formatTimestamp(openday.starttime, false)} till {formatTimestamp(openday.endtime, false)}
                </p>
              </div>
              {/* Edit button */}
              <div className="md:col-span-2 flex md:justify-center items-center mt-2 md:mt-0">
                <Link href={`/admin/opendays/${openday.id}/edit`}>
                  <PencilSquareIcon className="h-5 w-5 text-gray-500" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center pb-2 pt-6">
        <ArrowPathIcon className="h-5 w-5 text-gray-500" />
        <h3 className="ml-2 text-sm text-gray-500 ">Updated just now</h3>
      </div>
    </div>
  );

  function formatTimestamp(timestamp: number, doDate: boolean = true) {
    const date = new Date(timestamp * 1000); // Convert to milliseconds

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-based
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    if (doDate) {
      return `${day}/${month}/${year}`;
    } else {
      return `${hours}:${minutes}`;
    }
  }
}
