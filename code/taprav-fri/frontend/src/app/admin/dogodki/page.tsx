// src/app/admin/dogodki/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface EventSummary {
  id: number;
  slug: string;
  title: string;
  event_date: string;
  capacity: number;
  total_reserved: number;
  remaining: number;
}

export default function AdminDogodkiPage() {
  const router = useRouter();
  const [eventsList, setEventsList] = useState<EventSummary[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost/taprav-fri/api/admin/events_summary.php", {
      credentials: "include",
    })
      .then(async (res) => {
        if (res.status === 403) {
          throw new Error("Dostop ni dovoljen.");
        }
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Napaka ${res.status}: ${text}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          setEventsList(data.events);
        } else {
          setError(data.error || "Prišlo je do napake.");
        }
      })
      .catch((e) => {
        setError(e.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleDelete = async (ev: React.MouseEvent, id: number, slug: string) => {
    ev.stopPropagation();
    if (!confirm("Želite res izbrisati ta dogodek?")) return;

    try {
      const res = await fetch("http://localhost/taprav-fri/api/admin/event_delete.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Napaka ${res.status}: ${text}`);
      }
      const data = await res.json();
      if (data.success) {
        setEventsList((prev) => prev?.filter((e) => e.id !== id) || null);
      } else {
        alert(data.error || "Napaka pri brisanju dogodka.");
      }
    } catch (e: any) {
      alert(e.message);
    }
  };

  if (loading) {
    return (
      <p className="mt-8 text-center text-gray-600">
        Nalaganje podatkov za administracijo…
      </p>
    );
  }

  if (error) {
    return <p className="mt-8 text-center text-red-600">Napaka: {error}</p>;
  }

  if (!eventsList?.length) {
    return (
      <p className="mt-8 text-center text-gray-600">Ni najdenih dogodkov.</p>
    );
  }

  return (
    <div className="px-4 py-8 max-w-screen-xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin: Pregled dogodkov</h1>
        <button
          onClick={() => router.push("/admin/dogodki/dodaj")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Dodaj dogodek
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Naslov dogodka</th>
              <th className="px-4 py-2 border">Datum in ura</th>
              <th className="px-4 py-2 border">Kapaciteta</th>
              <th className="px-4 py-2 border">Rezervirano</th>
              <th className="px-4 py-2 border">Ostalo</th>
              <th className="px-4 py-2 border">Uredi</th>
              <th className="px-4 py-2 border">Izbriši</th>
            </tr>
          </thead>
          <tbody>
            {eventsList.map((e) => (
              <tr
                key={e.id}
                className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 cursor-pointer"
                onClick={() => router.push(`/admin/dogodki/${e.slug}`)}
              >
                <td className="px-4 py-2 border text-center">{e.id}</td>
                <td className="px-4 py-2 border">{e.title}</td>
                <td className="px-4 py-2 border text-center">
                  {e.event_date}
                </td>
                <td className="px-4 py-2 border text-center">{e.capacity}</td>
                <td className="px-4 py-2 border text-center">
                  {e.total_reserved}
                </td>
                <td className="px-4 py-2 border text-center">{e.remaining}</td>
                <td className="px-4 py-2 border text-center">
                  <button
                    onClick={(ev) => {
                      ev.stopPropagation();
                      router.push(`/admin/dogodki/${e.slug}/edit`);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                  >
                    Uredi
                  </button>
                </td>
                <td className="px-4 py-2 border text-center">
                  <button
                    onClick={(ev) => handleDelete(ev, e.id, e.slug)}
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
    </div>
  );
}
