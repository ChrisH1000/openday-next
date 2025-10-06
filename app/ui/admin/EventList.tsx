"use client";
import useSWR from 'swr';
import Spinner from '@/app/ui/Spinner';

type Event = {
  id: string;
  title: string;
  description: string;
  interests: string;
  openday_fk: string;
};

const fetcher = (url: string) => fetch(url).then(res => res.json());

function useEvents(opendayId: string) {
  return useSWR(`/api/opendays/${opendayId}/events`, fetcher);
}

export default function EventList({ opendayId }: { opendayId: string }) {
  const { data: events, error, isLoading } = useEvents(opendayId);

  if (isLoading) return <Spinner />;
  if (error) return <div>Error loading events</div>;
  if (!events || events.length === 0) return <div>No events found</div>;

  return (
    <div className="grid gap-4">
      {events.map((event: Event) => (
        <div key={event.id} className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold">{event.title}</h2>
          <p>{event.description}</p>
          <p>Interests: {event.interests}</p>
        </div>
      ))}
    </div>
  );
}