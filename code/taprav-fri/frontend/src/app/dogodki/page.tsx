// src/app/dogodki/page.tsx
'use client';

import { useState, useEffect } from 'react';
import HeroDogodki from '@/components/small/HeroDogodki';
import EventCard from '@/components/EventCard';

interface EventFromApi {
  id: number;
  slug: string;
  title: string;
  description: string;
  event_date: string;
  image_path: string;
  capacity: number;
  total_reserved: number;
  remaining: number;
}

export default function DogodkiPage() {
  const [events, setEvents] = useState<EventFromApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost/taprav-fri/api/events_list.php', {
      credentials: 'include',
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP ${res.status}: ${text}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          setEvents(data.events);
        } else {
          setError(data.error || 'Napaka pri pridobivanju dogodkov');
        }
      })
      .catch((e) => {
        setError(e.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="px-4 py-8 max-w-screen-xl mx-auto">
      <HeroDogodki />

      {loading && (
        <p className="mt-8 text-center text-gray-600">
          Nalaganje seznam dogodkov…
        </p>
      )}

      {error && (
        <p className="mt-8 text-center text-red-600">
          Napaka pri pridobivanju dogodkov: {error}
        </p>
      )}

      {!loading && !error && (
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((evt) => (
            <EventCard
              key={evt.slug}
              slug={evt.slug}
              title={evt.title}
              date={evt.event_date}
              description={evt.description}
              img={`http://localhost/taprav-fri/api/${evt.image_path}`}
            />
          ))}
        </div>
      )}

      {!loading && !error && events.length === 0 && (
        <p className="mt-8 text-center text-gray-600">
          Trenutno ni dogodkov.
        </p>
      )}
    </div>
  );
}
