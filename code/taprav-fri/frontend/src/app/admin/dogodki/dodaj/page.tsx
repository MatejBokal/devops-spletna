// src/app/admin/dogodki/dodaj/page.tsx
"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AddEventPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAdmin = localStorage.getItem("isAdmin") === "true";
      const loggedIn = localStorage.getItem("loggedIn") === "true";
      if (!loggedIn || !isAdmin) {
        router.push("/404");
      }
    }
  }, [router]);

  const [slugField, setSlugField] = useState("");
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [capacity, setCapacity] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

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

    if (!slugField.trim() || !title.trim()) {
      const msg = "Slug in naslov ne smeta biti prazna.";
      setError(msg);
      setToastType("error");
      setToastMessage(msg);
      setShowToast(true);
      return;
    }
    if (!eventDate) {
      const msg = "Datum je obvezen.";
      setError(msg);
      setToastType("error");
      setToastMessage(msg);
      setShowToast(true);
      return;
    }
    if (capacity <= 0) {
      const msg = "Kapaciteta mora biti pozitivno število.";
      setError(msg);
      setToastType("error");
      setToastMessage(msg);
      setShowToast(true);
      return;
    }

    const formData = new FormData();
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
        "http://localhost/taprav-fri/api/admin/event_create.php",
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
        setToastType("success");
        setToastMessage("Dogodek je bil uspešno dodan.");
        setShowToast(true);
        setTimeout(() => {
          router.push("/admin/dogodki");
        }, 1500);
      } else {
        const msg = data.error || "Napaka pri dodajanju dogodka.";
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

      <h1 className="text-2xl font-bold mb-4">Dodaj nov dogodek</h1>
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
          <label className="block mb-1 font-medium">Kapaciteta</label>
          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
            className="w-full border px-3 py-2 rounded"
            min={1}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Slika (opcijsko)</label>
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
            Dodaj
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
