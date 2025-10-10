"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import { useLoading } from '@/app/ui/LoadingContext';
import { lusitana } from '@/app/ui/fonts';

type AdminUser = {
  id: string;
  name: string;
  email: string;
  admin: boolean;
};

type FieldErrors = Partial<Record<'name' | 'email' | 'password' | 'admin', string[]>>;

type EditAdminUserFormProps = {
  user: AdminUser;
};

export default function EditAdminUserForm({ user }: EditAdminUserFormProps) {
  const router = useRouter();
  const { setLoading } = useLoading();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('');
  const [admin, setAdmin] = useState(user.admin);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const resetErrors = () => {
    setError('');
    setFieldErrors({});
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    resetErrors();

    const payload: Record<string, unknown> = {};

    if (name.trim() !== user.name) payload.name = name.trim();
    if (email.trim().toLowerCase() !== user.email.toLowerCase()) payload.email = email.trim();
    if (admin !== user.admin) payload.admin = admin;
    if (password.trim().length > 0) payload.password = password;

    if (Object.keys(payload).length === 0) {
      setError('No changes to save.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        const message = body?.error ?? 'Failed to update admin user.';
        if (body?.fieldErrors) {
          setFieldErrors(body.fieldErrors as FieldErrors);
        }
        throw new Error(message);
      }

      toast.success('Admin user updated successfully.');
      router.push('/admin');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update admin user.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setLoading(true);
    router.push('/admin');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <h1 className={`${lusitana.className} text-2xl font-bold text-gray-900 dark:text-white mb-6`}>
          Edit Admin User
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Name
            </label>
            <input
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter full name"
            />
            {fieldErrors.name && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-300">{fieldErrors.name[0]}</p>
            )}
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@example.com"
            />
            {fieldErrors.email && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-300">{fieldErrors.email[0]}</p>
            )}
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              New password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Leave blank to keep current password"
              minLength={password ? 8 : undefined}
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-300">
              Leave blank to keep the existing password. Minimum 8 characters when setting a new password.
            </p>
            {fieldErrors.password && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-300">{fieldErrors.password[0]}</p>
            )}
          </div>

          <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/40 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Admin access</p>
              <p className="text-xs text-gray-500 dark:text-gray-300">
                Admin users can manage other administrators and event content.
              </p>
            </div>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only"
                checked={admin}
                onChange={(event) => setAdmin(event.target.checked)}
              />
              <span className={`relative inline-block h-6 w-11 rounded-full transition-colors ${admin ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                <span
                  className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${admin ? 'translate-x-5' : ''}`}
                />
              </span>
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg shadow hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-medium"
            >
              Save Changes
            </button>
            <button
              type="button"
              className="flex-1 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white px-6 py-3 rounded-lg shadow hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors font-medium"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}