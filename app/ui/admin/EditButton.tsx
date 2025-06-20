"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import Spinner from '@/app/ui/Spinner';
import { useLoading } from '@/app/ui/LoadingContext';
import { toast } from 'react-toastify';

export default function EditButton({ href }: { href: string }) {
  const router = useRouter();
  const { setLoading } = useLoading();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    router.push(href);
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center justify-center"
      aria-label="Edit"
    >
      <PencilSquareIcon className="h-5 w-5 text-gray-500" />
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
