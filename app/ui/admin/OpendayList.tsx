"use client";
import Link from 'next/link';
import clsx from 'clsx';
import EditButton, { DeleteButton } from './EditButton';
import { cabin } from '@/app/ui/fonts';

type Openday = {
  id: string;
  title: string;
  campus: string;
  starttime: number;
  endtime: number;
  status: string;
};

function formatTimestamp(timestamp: number, doDate: boolean = true) {
  const date = new Date(timestamp * 1000);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  if (doDate) {
    return `${day}/${month}/${year}`;
  } else {
    return `${hours}:${minutes}`;
  }
}

export default function OpendayList({ opendays, title, bgColor }: { opendays: Openday[]; title: string; bgColor: string }) {
  return (
    <div className={bgColor + " p-2 mt-6 first:mt-0"}>
      <h2 className={`${cabin.className} mb-4 text-xl md:text-1xl pt-2`}>{title}</h2>
      {opendays.length === 0 && (
        <div className="p-4 text-gray-400">No OpenDays</div>
      )}
      {opendays.map((openday, i) => (
        <div
          key={openday.id}
          className={clsx(
            'grid md:grid-cols-12 grid-cols-1 items-start md:items-center p-4 bg-white',
            { 'border-t': i !== 0 },
          )}
        >
          <div className="md:col-span-5 min-w-0">
            <p className="truncate text-sm md:text-base font-medium">
              <Link key={openday.title} href={`/admin/opendays/${openday.id}`}>
                {openday.title}
              </Link>
            </p>
            <p className="text-sm text-gray-500 md:block">{openday.campus}</p>
          </div>
          <div className="md:col-span-5 mt-2 md:mt-0">
            <p className={`${cabin.className} truncate text-sm font-medium md:text-base`}>
              {formatTimestamp(openday.starttime)} {formatTimestamp(openday.starttime, false)} till {formatTimestamp(openday.endtime, false)}
            </p>
          </div>
          <div className="md:col-span-2 flex md:justify-center items-center mt-2 md:mt-0">
            <EditButton href={`/admin/opendays/${openday.id}/edit`} />
            <DeleteButton id={openday.id} onDelete={async () => {
              await fetch(`/api/opendays/${openday.id}/edit`, { method: 'DELETE' });
              window.location.reload();
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}
