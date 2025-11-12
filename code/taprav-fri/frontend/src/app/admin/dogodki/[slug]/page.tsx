// src/app/admin/dogodki/[slug]/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

interface Reservation {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  quantity: number;
  reserved_at: string;
}

interface ApiResponse {
  success: boolean;
  event?: {
    id: number;
    title: string;
  };
  reservations?: Reservation[];
  error?: string;
}

export default function AdminEventReservationsPage() {
  const params = useParams();
  const router = useRouter();
  const rawSlug = params?.slug ?? "";
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventTitle, setEventTitle] = useState<string>("");
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    if (!slug) {
      setError("Neveljaven URL.");
      setLoading(false);
      return;
    }

    fetch(
      `http://localhost/taprav-fri/api/admin/event_reservations.php?slug=${encodeURIComponent(
        slug
      )}`,
      {
        credentials: "include",
      }
    )
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
      .then((data: ApiResponse) => {
        if (!data.success) {
          throw new Error(data.error || "Prišlo je do napake.");
        }
        if (!data.event) {
          throw new Error("Dogodek ni najden.");
        }
        setEventTitle(data.event.title);
        setReservations(data.reservations || []);
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
      <p className="mt-8 text-center text-gray-600">
        Nalaganje rezervacij…
      </p>
    );
  }

  if (error) {
    // Če ni dostopa ali napaka, redirektiraj na 404 ali izpiši napako
    return (
      <p className="mt-8 text-center text-red-600">Napaka: {error}</p>
    );
  }

  return (
    <div className="px-4 py-8 max-w-screen-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        Rezervacije za dogodek: {eventTitle}
      </h1>

      {reservations.length === 0 ? (
        <p className="text-center text-gray-600">
          Za ta dogodek še ni nobene rezervacije.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">Uporabnik</th>
                <th className="px-4 py-2 border">E-pošta</th>
                <th className="px-4 py-2 border">Količina</th>
                <th className="px-4 py-2 border">Rezervisano ob</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr
                  key={r.user_id + "_" + r.reserved_at}
                  className="odd:bg-white even:bg-gray-50"
                >
                  <td className="px-4 py-2 border">
                    {r.first_name} {r.last_name}
                  </td>
                  <td className="px-4 py-2 border">{r.email}</td>
                  <td className="px-4 py-2 border text-center">
                    {r.quantity}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {r.reserved_at}
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
