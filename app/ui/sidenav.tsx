import { PowerIcon } from '@heroicons/react/24/outline';
import NavLinks from '@/app/ui/nav-links';
import { signOut } from '@/auth';
import ThemeToggle from '@/app/ui/ThemeToggle';

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2 bg-gray-100 dark:bg-gray-900">
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-200 dark:bg-gray-800 md:block"></div>
        <div className="flex flex-row md:flex-col gap-2">
          <ThemeToggle />
          <form
            action={async () => {
              'use server';
              await signOut();
            }}
          >
            <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-200 dark:bg-gray-800 p-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white md:flex-none md:justify-start md:p-2 md:px-3 transition-colors duration-200">
              <PowerIcon className="w-6 text-gray-600 dark:text-gray-400" />
              <div className="hidden md:block">Sign Out</div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
