// src/app/contact/page.tsx
'use client';

import { useState, useEffect } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [showToast, setShowToast] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setShowToast(true);

    setForm({ name: '', email: '', message: '' });
  };

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  return (
    <div className="px-4 py-12 max-w-screen-md mx-auto relative">
      <h1 className="text-3xl font-bold text-center mb-6">Kontakt</h1>

      <p className="text-center text-gray-700 mb-8">
        Pišite nam na{' '}
        <a href="mailto:info@taprav.com" className="text-blue-600">
          info@taprav.com
        </a>{' '}
        ali pokličite{' '}
        <a href="tel:+38670828787" className="text-blue-600">
          +386 70 828 787
        </a>
        . <br /> Lahko pa nam tukaj pustite sporočilo:
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Vaše ime"
          value={form.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md text-black"
          required
          onInvalid={(e) =>
            (e.target as HTMLInputElement).setCustomValidity(
              'Prosimo, vnesite vaše ime.'
            )
          }
          onInput={(e) =>
            (e.target as HTMLInputElement).setCustomValidity('')
          }
        />

        <input
          type="email"
          name="email"
          placeholder="Vaš e-poštni naslov"
          value={form.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md text-black"
          required
          onInvalid={(e) => {
            const input = e.target as HTMLInputElement;
            if (input.validity.valueMissing) {
              input.setCustomValidity('Prosimo, vnesite vaš email.');
            } else {
              input.setCustomValidity('Prosimo, vnesite veljaven email.');
            }
          }}
          onInput={(e) =>
            (e.target as HTMLInputElement).setCustomValidity('')
          }
        />

        <textarea
          name="message"
          placeholder="Vaše sporočilo"
          value={form.message}
          onChange={handleChange}
          rows={5}
          className="w-full px-4 py-2 border rounded-md text-black"
          required
          onInvalid={(e) => {
            const ta = e.target as HTMLTextAreaElement;
            ta.setCustomValidity('Prosimo, vnesite vaše sporočilo.');
          }}
          onInput={(e) =>
            (e.target as HTMLTextAreaElement).setCustomValidity('')
          }
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
        >
          Pošlji sporočilo
        </button>
      </form>

      {showToast && (
        <div
          className={`
            fixed
            bottom-8
            left-1/2
            transform -translate-x-1/2
            bg-gray-800
            text-white
            px-6
            py-3
            rounded-full
            shadow-lg
            z-50
            animate-slide-up
          `}
        >
          Hvala, vaše sporočilo je bilo poslano!
        </div>
      )}

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
