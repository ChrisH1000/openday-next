import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { fetchOpendays } from '../../lib/data';
import OpendayList from './OpendayList';

export default async function Opendays() {
  const opendays = await fetchOpendays();
  const liveOpendays = opendays.filter((openday) => openday.status === 'live');
  const underConstructionOpendays = opendays.filter((openday) => openday.status === 'under construction');
  const archivedOpendays = opendays.filter((openday) => openday.status === 'archived');
  console.log(opendays);
  return (
    <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
      <OpendayList opendays={liveOpendays} title="Live OpenDays" bgColor="bg-green-50" />
      <OpendayList opendays={underConstructionOpendays} title="Under Construction" bgColor="bg-yellow-50" />
      <OpendayList opendays={archivedOpendays} title="Archived" bgColor="bg-gray-100" />
      <div className="flex items-center pb-2 pt-6">
        <ArrowPathIcon className="h-5 w-5 text-gray-500" />
        <h3 className="ml-2 text-sm text-gray-500 ">Updated just now</h3>
      </div>
    </div>
  );
}
