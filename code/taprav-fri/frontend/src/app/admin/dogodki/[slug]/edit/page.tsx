// src/app/admin/dogodki/[slug]/edit/page.tsx
"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";

interface EventDetails {
  id: number;
  slug: string;
  title: string;
  short_description: string;
  full_description: string;
  event_date: string; // format: "YYYY-MM-DD HH:MM:SS"
  capacity: number;
  image_path: string;
  total_reserved: number;
}

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAdmin = localStorage.getItem("isAdmin") === "true";
      const loggedIn = localStorage.getItem("loggedIn") === "true";
      if (!loggedIn || !isAdmin) {
        router.push("/404");
      }
    }
  }, [router]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [id, setId] = useState<number>(0);
  const [slugField, setSlugField] = useState("");
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [capacity, setCapacity] = useState(0);
  const [imagePath, setImagePath] = useState("");
  const [totalReserved, setTotalReserved] = useState(0);

  const [imageFile, setImageFile] = useState<File | null>(null);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  useEffect(() => {
    if (!slug) {
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`/taprav-fri/api/admin/event_details.php?slug=${slug}`, {
      credentials: "include",
    })
      .then(async (res) => {
        if (res.status === 403) {
          throw new Error("Dostop ni dovoljen.");
        }
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`HTTP ${res.status}: ${txt}`);
        }
        return res.json();
      })
      .then((data: { success: boolean; event?: EventDetails; error?: string }) => {
        if (data.success && data.event) {
          const e = data.event;
          setId(e.id);
          setSlugField(e.slug);
          setTitle(e.title);
          setShortDescription(e.short_description);
          setFullDescription(e.full_description);

          const dtLocal = e.event_date.replace(" ", "T").slice(0, 16);
          setEventDate(dtLocal);

          setCapacity(e.capacity);
          setImagePath(e.image_path);
          setTotalReserved(e.total_reserved);
        } else {
          throw new Error(data.error || "Napaka pri nalaganju dogodka.");
        }
      })
      .catch((e) => {
        setError(e.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!slugField.trim() || !title.trim()) {
      const msg = "Naslov in slug ne smeta biti prazna.";
      setError(msg);
      setToastType("error");
      setToastMessage(msg);
      setShowToast(true);
      return;
    }
    if (capacity < totalReserved) {
      const msg = `Kapaciteta ne sme biti manjša od trenutno rezerviranih (${totalReserved}).`;
      setError(msg);
      setToastType("error");
      setToastMessage(msg);
      setShowToast(true);
      return;
    }

    const formData = new FormData();
    formData.append("id", id.toString());
    formData.append("slug", slugField);
    formData.append("title", title);
    formData.append("short_description", shortDescription);
    formData.append("full_description", fullDescription);
    formData.append("event_date", eventDate);
    formData.append("capacity", capacity.toString());
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const res = await fetch(
        "/taprav-fri/api/admin/event_update.php",
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`HTTP ${res.status}: ${txt}`);
      }
      const data = await res.json();
      if (data.success) {
        const msg = "Dogodek je bil uspešno posodobljen.";
        setSuccess(msg);
        setToastType("success");
        setToastMessage(msg);
        setShowToast(true);
        // Optionally clear the file input
        setImageFile(null);
      } else {
        const msg = data.error || "Napaka pri posodabljanju dogodka.";
        setError(msg);
        setToastType("error");
        setToastMessage(msg);
        setShowToast(true);
      }
    } catch (e: any) {
      const msg = e.message;
      setError(msg);
      setToastType("error");
      setToastMessage(msg);
      setShowToast(true);
    }
  };

  const handleCancel = () => {
    router.push("/admin/dogodki");
  };

  if (!slug) {
    return <p className="mt-8 text-center text-gray-600">Nalagam…</p>;
  }

  if (loading) {
    return (
      <p className="mt-8 text-center text-gray-600">Nalagam podatke dogodka…</p>
    );
  }

  return (
    <div className="relative max-w-xl mx-auto px-4 py-8">
      {/* Toast */}
      {showToast && (
        <div
          className={`fixed top-4 right-4 z-50 max-w-sm w-full px-4 py-3 rounded shadow-md
            ${
              toastType === "success"
                ? "bg-green-100 border border-green-400 text-green-800"
                : "bg-red-100 border border-red-400 text-red-800"
            }`}
          role="alert"
        >
          <p>{toastMessage}</p>
        </div>
      )}

      <h1 className="text-2xl font-bold mb-4">Uredi dogodek</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Naslov</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Slug</label>
          <input
            type="text"
            value={slugField}
            onChange={(e) => setSlugField(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">
            Kratek opis (short_description)
          </label>
          <input
            type="text"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">
            Celoten opis (full_description)
          </label>
          <textarea
            value={fullDescription}
            onChange={(e) => setFullDescription(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            rows={4}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Datum in ura</label>
          <input
            type="datetime-local"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">
            Kapaciteta (trenutno rezervirano: {totalReserved})
          </label>
          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
            className="w-full border px-3 py-2 rounded"
            min={totalReserved}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Trenutna slika</label>
          {imagePath && (
            <img
              src={imagePath}
              alt="Trenutna slika"
              className="mb-2 max-h-40"
            />
          )}
          <label className="block mb-1 font-medium">Nova slika (opcijsko)</label>
          <input
            className="w-full border px-3 py-2 rounded"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <div className="flex space-x-2 mt-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Shrani
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Prekliči
          </button>
        </div>
      </form>
    </div>
  );
}
