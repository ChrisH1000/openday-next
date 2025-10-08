"use client";
import useSWR from 'swr';
import EditButton, { DeleteButton } from './EditButton';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { Event, Session } from '@/app/lib/definitions';
import { EventSkeleton } from '@/app/ui/skeletons';

const fetcher = (url: string) => fetch(url).then(res => res.json());

function useEvents(opendayId: string) {
  return useSWR(`/api/opendays/${opendayId}/events`, fetcher);
}

function formatTimestamp(timestamp: number) {
  const date = new Date(timestamp * 1000);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

function parseTimeToTimestamp(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return Math.floor(date.getTime() / 1000);
}

export default function EventList({ opendayId }: { opendayId: string }) {
  const { data: events, error, isLoading, mutate: mutateEvents } = useEvents(opendayId);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [newSessionStart, setNewSessionStart] = useState('');
  const [newSessionEnd, setNewSessionEnd] = useState('');
  const [showAddSession, setShowAddSession] = useState<string | null>(null);

  const handleAddSession = async (eventId: string) => {
    if (!newSessionStart || !newSessionEnd) return;
    try {
      const starttime = parseTimeToTimestamp(newSessionStart);
      const endtime = parseTimeToTimestamp(newSessionEnd);
      const response = await fetch(`/api/opendays/${opendayId}/events/${eventId}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ starttime, endtime }),
      });
      if (!response.ok) throw new Error('Failed to add session');
      toast.success('Session added successfully.');
      mutateEvents();
      setNewSessionStart('');
      setNewSessionEnd('');
      setShowAddSession(null);
    } catch {
      toast.error('Failed to add session.');
    }
  };

  const handleEditSession = async (eventId: string, sessionId: string, starttime: number, endtime: number) => {
    try {
      const response = await fetch(`/api/opendays/${opendayId}/events/${eventId}/sessions/${sessionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ starttime, endtime }),
      });
      if (!response.ok) throw new Error('Failed to update session');
      toast.success('Session updated successfully.');
      mutateEvents();
      setEditingSessionId(null);
    } catch {
      toast.error('Failed to update session.');
    }
  };

  const handleDeleteSession = async (eventId: string, sessionId: string) => {
    try {
      const response = await fetch(`/api/opendays/${opendayId}/events/${eventId}/sessions/${sessionId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete session');
      toast.success('Session deleted successfully.');
      mutateEvents();
    } catch {
      toast.error('Failed to delete session.');
    }
  };

  if (isLoading) return <EventSkeleton />;
  if (error) return (
    <div className="p-6 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg">
      Failed to load Events. Please try refreshing the page.
    </div>
  );
  if (!events || events.length === 0) return (
    <div className="p-12 text-center text-gray-500 dark:text-gray-400">
      <p className="text-lg">No Events found</p>
      <p className="text-sm mt-2">Create your first Event to get started</p>
    </div>
  );

  return (
    <div className="space-y-4">
      {events.map((event: Event) => (
        <div
          key={event.id}
          className="p-4 bg-white dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{event.title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{event.description}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500">Interests: {event.interests}</p>
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <EditButton href={`/admin/opendays/${opendayId}/events/${event.id}/edit`} />
              <DeleteButton onDelete={async () => {
                const ConfirmDelete = () => {
                  const [loading, setLoading] = useState(false);
                  const handleConfirm = async () => {
                    setLoading(true);
                    try {
                      const response = await fetch(`/api/opendays/${opendayId}/events/${event.id}`, { method: 'DELETE' });
                      if (!response.ok) throw new Error('Network response was not ok');
                      toast.success('Event deleted successfully.');
                      window.location.reload();
                    } catch {
                      toast.error('Failed to delete Event.');
                    }
                    setLoading(false);
                  };
                  return (
                    <div>
                      <p className="mb-4">Are you sure you want to delete this Event?</p>
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
                          {loading ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  );
                };
                toast.info(<ConfirmDelete />, { autoClose: false, closeOnClick: false });
              }} />
            </div>
          </div>

          {event.sessions && event.sessions.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Sessions:</h3>
                <button
                  onClick={() => setShowAddSession(showAddSession === event.id ? null : event.id)}
                  className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
                >
                  + Add Session
                </button>
              </div>
              {showAddSession === event.id && (
                <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                  <div className="flex items-center space-x-2">
                    <input
                      type="time"
                      value={newSessionStart}
                      onChange={(e) => setNewSessionStart(e.target.value)}
                      className="text-sm border border-gray-300 rounded px-2 py-1 bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      placeholder="Start time"
                    />
                    <span>-</span>
                    <input
                      type="time"
                      value={newSessionEnd}
                      onChange={(e) => setNewSessionEnd(e.target.value)}
                      className="text-sm border border-gray-300 rounded px-2 py-1 bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      placeholder="End time"
                    />
                    <button
                      onClick={() => handleAddSession(event.id)}
                      className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setShowAddSession(null);
                        setNewSessionStart('');
                        setNewSessionEnd('');
                      }}
                      className="text-xs bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                {event.sessions.map((session: Session) => (
                  <div key={session.id} className="flex items-center justify-between text-sm bg-gray-50 dark:bg-gray-600/30 p-2 rounded">
                    {editingSessionId === session.id ? (
                      <div className="flex items-center space-x-2 flex-1">
                        <input
                          type="time"
                          defaultValue={formatTimestamp(session.starttime)}
                          onChange={(e) => {
                            const starttime = parseTimeToTimestamp(e.target.value);
                            session.starttime = starttime;
                          }}
                          className="text-sm border border-gray-300 rounded px-2 py-1 bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        />
                        <span>-</span>
                        <input
                          type="time"
                          defaultValue={formatTimestamp(session.endtime)}
                          onChange={(e) => {
                            const endtime = parseTimeToTimestamp(e.target.value);
                            session.endtime = endtime;
                          }}
                          className="text-sm border border-gray-300 rounded px-2 py-1 bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        />
                        <button
                          onClick={() => handleEditSession(event.id, session.id, session.starttime, session.endtime)}
                          className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingSessionId(null)}
                          className="text-xs bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="text-gray-600 dark:text-gray-400">
                          {formatTimestamp(session.starttime)} - {formatTimestamp(session.endtime)}
                        </span>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => setEditingSessionId(session.id)}
                            className="text-xs bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              const ConfirmDelete = () => {
                                const [loading, setLoading] = useState(false);
                                const handleConfirm = async () => {
                                  setLoading(true);
                                  try {
                                    await handleDeleteSession(event.id, session.id);
                                  } catch {}
                                  setLoading(false);
                                };
                                return (
                                  <div>
                                    <p className="mb-4">Are you sure you want to delete this session?</p>
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
                                        {loading ? 'Deleting...' : 'Delete'}
                                      </button>
                                    </div>
                                  </div>
                                );
                              };
                              toast.info(<ConfirmDelete />, { autoClose: false, closeOnClick: false });
                            }}
                            className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          {(!event.sessions || event.sessions.length === 0) && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Sessions:</h3>
                <button
                  onClick={() => setShowAddSession(showAddSession === event.id ? null : event.id)}
                  className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
                >
                  + Add Session
                </button>
              </div>
              {showAddSession === event.id && (
                <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                  <div className="flex items-center space-x-2">
                    <input
                      type="time"
                      value={newSessionStart}
                      onChange={(e) => setNewSessionStart(e.target.value)}
                      className="text-sm border border-gray-300 rounded px-2 py-1 bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      placeholder="Start time"
                    />
                    <span>-</span>
                    <input
                      type="time"
                      value={newSessionEnd}
                      onChange={(e) => setNewSessionEnd(e.target.value)}
                      className="text-sm border border-gray-300 rounded px-2 py-1 bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      placeholder="End time"
                    />
                    <button
                      onClick={() => handleAddSession(event.id)}
                      className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setShowAddSession(null);
                        setNewSessionStart('');
                        setNewSessionEnd('');
                      }}
                      className="text-xs bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}