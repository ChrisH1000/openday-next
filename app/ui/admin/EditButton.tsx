"use client";
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function EditButton({ href }: { href: string }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    startTransition(() => {
      router.push(href);
    });
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center justify-center"
      aria-label="Edit"
      disabled={loading}
    >
      {loading ? (
        <svg className="animate-spin h-5 w-5 text-blue-500" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      ) : (
        <PencilSquareIcon className="h-5 w-5 text-gray-500" />
      )}
    </button>
  );
}

export function DeleteButton({ onDelete }: { onDelete: () => Promise<void> }) {
  const [loading, setLoading] = useState(false);
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this OpenDay?')) {
      setLoading(true);
      try {
        await onDelete();
      } catch {
        alert('Failed to delete OpenDay.');
      }
      setLoading(false);
    }
  };
  return (
    <button
      onClick={handleDelete}
      className="flex items-center justify-center ml-2"
      aria-label="Delete"
      disabled={loading}
    >
      {loading ? (
        <svg className="animate-spin h-5 w-5 text-red-500" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      ) : (
        <TrashIcon className="h-5 w-5 text-red-500" />
      )}
    </button>
  );
}
