// src/app/dogodki/[slug]/page.tsx
'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import RegisterTickets from '@/components/small/RegisterTickets';

interface EventDetail {
  id: number;
  slug: string;
  title: string;
  short_description: string;
  full_description: string;
  event_date: string;
  capacity: number;
  image_path: string;
  total_reserved: number;
  remaining: number;
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug ?? '';

  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError('Neveljaven slug dogodka.');
      setLoading(false);
      return;
    }

    fetch(`/taprav-fri/api/event_detail.php?slug=${slug}`, {
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
          setEvent(data.event);
        } else {
          setError(data.error || 'Dogodek ni najden.');
        }
      })
      .catch((e) => {
        setError(e.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <p className="mt-8 text-center text-gray-600">Nalaganje dogodka…</p>
    );
  }

  if (error || !event) {
    router.push('/404');
    return null;
  }

  return (
    <div className="px-4 py-8 max-w-screen-xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left column: image */}
        <div className="w-full md:w-1/2">
          <div className="relative w-full h-64 md:h-[400px]">
            <Image
              src={`/taprav-fri/api/${event.image_path}`}
              alt={event.title}
              fill
              className="object-cover rounded-lg shadow-md"
              priority
            />
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-start ml-5">
          <h1 className="text-4xl font-extrabold mb-4">{event.title}</h1>
          <p className="text-gray-600 mb-2">
            <strong>Datum in ura:</strong> {event.event_date}
          </p>

          <p className="mb-4 text-gray-700">{event.short_description}</p>

          <div className="prose max-w-none mb-8">
            {event.full_description.split('\n').map((paragraph, idx) => (
              <p key={idx} className="mb-4">
                {paragraph.trim()}
              </p>
            ))}
          </div>

          
          <div className="
                flex flex-col items-center space-y-2 mt-8
                lg:flex-row lg:justify-between lg:items-baseline lg:space-y-0
            ">
            
            <RegisterTickets eventId={event.id} />

           
            <a href="/dogodki" className="text-blue-600 hover:underline mt-4">
              ← Nazaj na seznam dogodkov
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
