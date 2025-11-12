// src/app/components/small/RegisterTickets.tsx
'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { useAuthModal } from '@/context/AuthContext';

interface RegisterTicketsProps {
  eventId: number;
}

export default function RegisterTickets({ eventId }: RegisterTicketsProps) {
  const { openAuth } = useAuthModal();
  const [quantity, setQuantity] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsLoggedIn(localStorage.getItem('loggedIn') === 'true');
    }
  }, []);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const decrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));
  const increment = () => setQuantity((q) => q + 1);

  const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= 1) setQuantity(val);
  };

  const completeReservation = async () => {
    try {
      const res = await fetch('http://localhost/taprav-fri/api/make_reservation.php', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_id: eventId,
          quantity,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setToastType('success');
        setToastMessage(`Rezervacija za ${quantity} vstopnic uspešna!`);
        setShowToast(true);
      } else {
        setToastType('error');
        setToastMessage(data.error || 'Prišlo je do napake pri rezervaciji.');
        setShowToast(true);
      }
    } catch (err: any) {
      setToastType('error');
      setToastMessage('Prišlo je do napake pri rezervaciji.');
      setShowToast(true);
      console.error('Fetch error:', err);
    }
    setQuantity(1);
  };

  const handleRezerviraj = () => {
    if (!isLoggedIn) {
      openAuth('login', () => {
        setIsLoggedIn(true);
        completeReservation();
      });
      return;
    }

    completeReservation();
  };

  return (
    <div className="relative">
      {showToast && (
        <div
          className={`fixed bottom-4 right-4 z-50 max-w-sm w-full px-4 py-3 rounded shadow-md
            ${
              toastType === 'success'
                ? 'bg-green-100 border border-green-400 text-green-800'
                : 'bg-red-100 border border-red-400 text-red-800'
            }`}
          role="alert"
        >
          <p>{toastMessage}</p>
        </div>
      )}

      <div className="flex items-center space-x-4 mt-8">
        <div className="flex items-center border border-gray-300 rounded-md">
          <button
            onClick={decrement}
            className="px-3 py-1 text-gray-700 hover:bg-gray-100"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={handleQuantityChange}
            className="w-16 text-center outline-none border-l border-r border-gray-300"
          />
          <button
            onClick={increment}
            className="px-3 py-1 text-gray-700 hover:bg-gray-100"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <button
          onClick={handleRezerviraj}
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Rezerviraj
        </button>
      </div>
    </div>
  );
}
