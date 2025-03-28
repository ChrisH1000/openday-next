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
        {liveOpendays.map((openday, i) => {
          return (
            <div
              key={openday.id}
              className={clsx(
                'flex flex-row items-center justify-between p-4 bg-white',
                {
                  'border-t': i !== 0,
                },
              )}
            >
              <div className="flex">
                <div className="min-w-0">
                  <p className="truncate text-sm md:text-base">
                  <Link
                    key={openday.title}
                    href={`/admin/opendays/${openday.id}`}
                  >
                    {openday.title}
                  </Link>
                  </p>
                  <p className="hidden text-sm text-gray-500 sm:block">
                    {openday.campus}
                  </p>
                </div>
              </div>
              <div className="flex">
                <p
                  className={`${cabin.className} truncate text-sm font-medium md:text-base`}
                >
                  {formatTimestamp(openday.starttime)} {formatTimestamp(openday.starttime, false)} till {formatTimestamp(openday.endtime, false)}
                </p>
              </div>
              <div className="flex items-center">
                <PencilSquareIcon className="h-5 w-5 text-gray-500" />
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
