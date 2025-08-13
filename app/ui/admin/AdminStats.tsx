'use client';

import { useState, useEffect } from 'react';
import { lusitana } from '@/app/ui/fonts';
import { 
  CalendarIcon, 
  BuildingOfficeIcon, 
  ClockIcon, 
  UsersIcon 
} from '@heroicons/react/24/outline';

type Openday = {
  id: string;
  title: string;
  campus: string;
  starttime: number;
  endtime: number;
  status: string;
};

const fetchOpendays = async () => {
  try {
    const res = await fetch('/api/opendays');
    if (!res.ok) throw new Error('Failed to fetch');
    return await res.json();
  } catch (error) {
    console.error('Failed to fetch opendays:', error);
    return [];
  }
};

const formatTimestamp = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

export default function AdminStats() {
  const [opendays, setOpendays] = useState<Openday[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOpendays = async () => {
      const data = await fetchOpendays();
      setOpendays(data);
      setLoading(false);
    };
    
    loadOpendays();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg border border-gray-200 dark:border-gray-700 animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  const liveCount = opendays.filter(day => day.status === 'live').length;
  const upcomingCount = opendays.filter(day => 
    day.status === 'under construction' && 
    day.starttime > Math.floor(Date.now() / 1000)
  ).length;
  const campusCount = new Set(opendays.map(day => day.campus)).size;
  const totalDuration = opendays.reduce((total, day) => 
    total + (day.endtime - day.starttime), 0
  );

  const hours = Math.floor(totalDuration / 3600);
  const days = Math.floor(hours / 24);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {/* Live Events Card */}
      <div className="rounded-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-900/10 p-6 shadow-lg border border-green-200 dark:border-green-800">
        <div className="flex items-center">
          <div className="rounded-lg bg-green-500/10 p-3">
            <CalendarIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-green-800 dark:text-green-200">Live Events</h3>
            <p className={`${lusitana.className} text-2xl font-bold text-green-900 dark:text-green-100`}>
              {liveCount}
            </p>
          </div>
        </div>
      </div>

      {/* Upcoming Events Card */}
      <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-900/10 p-6 shadow-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-center">
          <div className="rounded-lg bg-blue-500/10 p-3">
            <ClockIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">Upcoming</h3>
            <p className={`${lusitana.className} text-2xl font-bold text-blue-900 dark:text-blue-100`}>
              {upcomingCount}
            </p>
          </div>
        </div>
      </div>

      {/* Campuses Card */}
      <div className="rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-900/10 p-6 shadow-lg border border-purple-200 dark:border-purple-800">
        <div className="flex items-center">
          <div className="rounded-lg bg-purple-500/10 p-3">
            <BuildingOfficeIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-purple-800 dark:text-purple-200">Campuses</h3>
            <p className={`${lusitana.className} text-2xl font-bold text-purple-900 dark:text-purple-100`}>
              {campusCount}
            </p>
          </div>
        </div>
      </div>

      {/* Total Duration Card */}
      <div className="rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-900/10 p-6 shadow-lg border border-amber-200 dark:border-amber-800">
        <div className="flex items-center">
          <div className="rounded-lg bg-amber-500/10 p-3">
            <UsersIcon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">Total Duration</h3>
            <p className={`${lusitana.className} text-2xl font-bold text-amber-900 dark:text-amber-100`}>
              {days > 0 ? `${days}d` : `${hours}h`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}