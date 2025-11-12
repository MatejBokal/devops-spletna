// src/app/not-found.tsx
'use client';

import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="px-4 py-8 max-w-screen-xl mx-auto text-center flex flex-col items-center">
      <section className="relative w-full h-72 md:h-96 bg-gray-100 flex flex-col items-center justify-center rounded-lg">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404 – Stran ni najdena</h1>
        <p className="text-lg text-gray-600">
          Oprostite, tu ni ničesar, kar iščete.
        </p>
      </section>

      <Link
        href="/"
        className="mt-8 inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Nazaj na domov
      </Link>
    </div>
  );
}
