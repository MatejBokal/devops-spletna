// src/app/moje-rezervacije/page.tsx
"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";

interface Reservation {
  reservation_id: number;
  event_id: number;
  slug: string;
  title: string;
  event_date: string;
  quantity: number;
  reserved_at: string;
}

export default function MojeRezervacijePage() {
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newQuantity, setNewQuantity] = useState<number>(1);

  useEffect(() => {
    fetch("http://localhost/taprav-fri/api/my_reservations.php", {
      credentials: "include",
    })
      .then(async (res) => {
        if (res.status === 401) {
          throw new Error("Prosimo, prijavite se.");
        }
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Napaka ${res.status}: ${text}`);
        }
        return res.json();
      })
      .then((data) => {
        if (!data.success) {
          throw new Error(data.error || "Prišlo je do napake.");
        }
        setReservations(data.reservations);
      })
      .catch((e: any) => {
        setError(e.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const startEditing = (reservation: Reservation) => {
    setEditingId(reservation.reservation_id);
    setNewQuantity(reservation.quantity);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setNewQuantity(1);
  };

  const saveQuantity = async (reservation_id: number, event_id: number) => {
    try {
      const res = await fetch(
        "http://localhost/taprav-fri/api/reservation_update.php",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reservation_id, new_quantity: newQuantity }),
        }
      );
      const data = await res.json();
      if (!data.success) {
        alert(`Napaka: ${data.error}`);
      } else {
        setReservations((prev) =>
          prev.map((r) =>
            r.reservation_id === reservation_id
              ? { ...r, quantity: newQuantity }
              : r
          )
        );
      }
    } catch (e: any) {
      console.error(e);
      alert("Prišlo je do napake pri posodabljanju.");
    }
    cancelEditing();
  };

  const deleteReservation = async (reservation_id: number) => {
    if (!confirm("Želite res izbrisati to rezervacijo?")) return;
    try {
      const res = await fetch(
        "http://localhost/taprav-fri/api/reservation_delete.php",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reservation_id }),
        }
      );
      const data = await res.json();
      if (!data.success) {
        alert(`Napaka: ${data.error}`);
      } else {
        setReservations((prev) =>
          prev.filter((r) => r.reservation_id !== reservation_id)
        );
      }
    } catch (e: any) {
      console.error(e);
      alert("Prišlo je do napake pri brisanju rezervacije.");
    }
  };

  if (loading) {
    return (
      <p className="mt-8 text-center text-gray-600">Nalaganje rezervacij…</p>
    );
  }

  if (error) {
    return (
      <p className="mt-8 text-center text-red-600">Napaka: {error}</p>
    );
  }

  return (
    <div className="px-4 py-8 max-w-screen-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Moje rezervacije</h1>
      {reservations.length === 0 ? (
        <p className="text-center text-gray-600">
          Zaenkrat nimate nobenih rezervacij.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">Dogodek</th>
                <th className="px-4 py-2 border">Datum dogodka</th>
                <th className="px-4 py-2 border">Količina</th>
                <th className="px-4 py-2 border">Rezervirano ob</th>
                <th className="px-4 py-2 border">Uredi</th>
                <th className="px-4 py-2 border">Izbriši</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr key={r.reservation_id} className="odd:bg-white even:bg-gray-50">
                  <td className="px-4 py-2 border">
                    <a
                      href={`/dogodki/${r.slug}`}
                      className="text-blue-600 hover:underline"
                    >
                      {r.title}
                    </a>
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {r.event_date}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {editingId === r.reservation_id ? (
                      <input
                        type="number"
                        min="1"
                        value={newQuantity}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setNewQuantity(Number(e.target.value))
                        }
                        className="w-16 text-center border px-1 py-1 rounded"
                      />
                    ) : (
                      r.quantity
                    )}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {r.reserved_at}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {editingId === r.reservation_id ? (
                      <>
                        <button
                          onClick={() => saveQuantity(r.reservation_id, r.event_id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded mr-2"
                        >
                          Shrani
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded"
                        >
                          Prekliči
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => startEditing(r)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                      >
                        Uredi
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    <button
                      onClick={() => deleteReservation(r.reservation_id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                      Izbriši
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
