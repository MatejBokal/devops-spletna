// src/app/zibert/page.tsx
'use client';

import Link from 'next/link';
import { Mail, Phone, Instagram, Facebook, X } from 'lucide-react';

export default function ZibertPage() {
  return (
    <div className="px-4 py-12 max-w-screen-md mx-auto space-y-10">

        
      <section className="text-center space-y-4">
        <h1 className="text-3xl font-bold">CONTACT US</h1>
        
        <Link
          href="mailto:rooms.zibert@taprav.si"
          className="inline-block bg-[#FFE76E] hover:bg-yellow-400 text-black font-bold px-6 py-3 rounded"
        >
          BOOK A ROOM
        </Link>
      </section>

      <section className="bg-white  text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <Mail className="w-5 h-5 text-gray-600" />
          <a href="mailto:rooms.zibert@taprav.si" className="text-gray-700">
            rooms.zibert@taprav.si
          </a>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <Phone className="w-5 h-5 text-gray-600" />
          <a href="tel:+38670828787" className="text-gray-700">
            +386 (0) 70 828 787
          </a>
        </div>
      </section>

      <section className="text-center space-y-2">
        <h2 className="text-xl font-semibold">GENERAL INFO</h2>
        <p>
          <Mail className="inline w-4 h-4 mr-1 text-gray-600 align-text-bottom" />
          <a href="mailto:info@taprav.si" className="text-gray-700">
            info@taprav.si
          </a>
        </p>
      </section>

    </div>
);
}
