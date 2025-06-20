"use client";
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import Spinner from '@/app/ui/Spinner';

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
      {loading ? <Spinner className="text-blue-500" /> : <PencilSquareIcon className="h-5 w-5 text-gray-500" />}
    </button>
  );
}

export function DeleteButton({ onDelete }: { onDelete: () => Promise<void> }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete();
    } catch {
      toast.error('Failed to delete OpenDay.');
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleDelete}
      className="flex items-center justify-center ml-2"
      aria-label="Delete"
      disabled={loading}
    >
      {loading ? <Spinner className="text-red-500" /> : <TrashIcon className="h-5 w-5 text-red-500" />}
    </button>
  );
}
