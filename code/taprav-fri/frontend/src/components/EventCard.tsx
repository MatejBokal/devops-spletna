// src/app/components/EventCard.tsx
'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

export interface EventCardProps {
  slug: string;
  title: string;
  date: string;
  description: string;
  img: string;
}

export default function EventCard({
  slug,
  title,
  date,
  description,
  img,
}: EventCardProps) {
  const handleMouseEnter = useCallback(() => {
    fetch(`http://localhost/taprav-fri/api/event_detail.php?slug=${slug}`, {
      credentials: 'include',
    }).catch(() => {
    });
  }, [slug]);

  return (
    <div className="relative rounded-lg overflow-hidden shadow-md h-64">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${img})` }}
      />

      <div className="relative h-full flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent p-4">
        <h3 className="text-white text-lg font-bold">{title}</h3>
        <p className="text-sm text-gray-200">{date}</p>
        <p className="mt-1 text-gray-100">{description}</p>

        <a
          href={`/dogodki/${slug}`}
          onMouseEnter={handleMouseEnter}
          className="mt-3 inline-block w-full bg-green-600 text-center text-white py-2 rounded hover:bg-green-700"
        >
          Prijavi se zdaj
        </a>
      </div>
    </div>
  );
}
