"use client";

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import { TrashIcon } from '@heroicons/react/24/outline';

import EditButton from '@/app/ui/admin/EditButton';
import Spinner from '@/app/ui/Spinner';

type AdminUser = {
  id: string;
  name: string;
  email: string;
  admin: boolean;
};

type AdminUserListProps = {
  currentUserId: string;
  onRefresh?: () => void;
};

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to load admin users.');
  }
  return response.json() as Promise<AdminUser[]>;
};

export default function AdminUserList({ currentUserId, onRefresh }: AdminUserListProps) {
  const { data, error, isLoading, mutate } = useSWR<AdminUser[]>('/api/admin/users', fetcher);

  useEffect(() => {
    if (data) {
      onRefresh?.();
    }
  }, [data, onRefresh]);

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <Spinner className="h-10 w-10 text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg">
        Failed to load admin users. Please try refreshing the page.
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="p-12 text-center text-gray-500 dark:text-gray-400">
        <p className="text-lg">No admin users found</p>
        <p className="text-sm mt-2">Create your first admin user to get started</p>
      </div>
    );
  }

  const sortedUsers = [...data].sort((a, b) => {
    if (a.admin === b.admin) {
      return a.name.localeCompare(b.name);
    }
    return a.admin ? -1 : 1;
  });

  const handleDelete = (user: AdminUser) => {
    const ConfirmDelete = () => {
      const [loading, setLoading] = useState(false);

      const handleConfirm = async () => {
        setLoading(true);
        try {
          const response = await fetch(`/api/admin/users/${user.id}`, { method: 'DELETE' });
          if (!response.ok) {
            const payload = await response.json().catch(() => null);
            const message = payload?.error ?? 'Failed to delete admin user.';
            throw new Error(message);
          }
          toast.success('Admin user deleted successfully.');
          await mutate();
          onRefresh?.();
          toast.dismiss();
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Failed to delete admin user.';
          toast.error(message);
        } finally {
          setLoading(false);
        }
      };

      return (
        <div>
          <p className="mb-4">
            Are you sure you want to delete <span className="font-semibold">{user.name}</span>?
          </p>
          <div className="flex justify-end space-x-2">
            <button
              className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              onClick={() => toast.dismiss()}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50"
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </div>
      );
    };

    toast.info(<ConfirmDelete />, { autoClose: false, closeOnClick: false });
  };

  return (
    <div className="mt-6 space-y-4">
      {sortedUsers.map((user) => {
        const isSelf = user.id === currentUserId;
        return (
          <div
            key={user.id}
            className="flex flex-col md:flex-row md:items-center md:justify-between p-4 bg-white dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm md:text-base font-medium text-gray-900 dark:text-white truncate">
                {user.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-300 truncate mt-1">{user.email}</p>
            </div>
            <div className="flex items-center gap-2 mt-3 md:mt-0">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${user.admin ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-200' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>
                {user.admin ? 'Admin' : 'Planner'}
              </span>
              <EditButton href={`/admin/users/${user.id}/edit`} />
              <button
                onClick={() => handleDelete(user)}
                className="flex items-center justify-center p-2 rounded-lg bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors disabled:opacity-50"
                aria-label="Delete"
                disabled={isSelf}
                title={isSelf ? 'You cannot delete your own account' : 'Delete user'}
              >
                <TrashIcon className="h-5 w-5 text-red-500" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}