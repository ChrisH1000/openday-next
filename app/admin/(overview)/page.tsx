import Opendays from '@/app/ui/admin/opendays';
import { cabin } from '@/app/ui/fonts';
import { Suspense } from 'react';
import {
  OpendaysSkeleton
} from '@/app/ui/skeletons';

export default async function Page() {
  return (
    <main>
      <h1 className={`${cabin.className} mb-4 text-xl md:text-2xl`}>
        Admin
      </h1>
      <div className="flex h-full flex-col px-3 py-4 md:px-2">
        <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
          <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
          <div className="flex w-full flex-col md:col-span-4">
            <Suspense fallback={<OpendaysSkeleton />}>
              <Opendays />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  )
}