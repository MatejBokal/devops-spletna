// src/app/components/small/LoginForm.tsx
"use client";

import { useState } from "react";

export default function LoginForm({
  onSwitch,
  onSuccess,
}: {
  onSwitch: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("Prosim, izpolnite vsa polja.");
      return;
    }

    try {
        const res = await fetch("http://localhost/taprav-fri/api/login.php", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("isAdmin", data.user.is_admin ? "true" : "false");
        localStorage.setItem("firstName", data.user.first_name);
        localStorage.setItem("lastName", data.user.last_name);
        window.location.reload();
        onSuccess();
      } else {
        setError(data.error || "Napaka pri prijavi.");
      }
    } catch (err: any) {
      console.error(err);
      setError("Prišlo je do napake pri prijavi.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div>
        <label htmlFor="login-email" className="block mb-1 font-medium">
          E-pošta
        </label>
        <input
          type="email"
          id="login-email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Vnesite e-pošto"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
          onInvalid={(e) =>
            (e.target as HTMLInputElement).setCustomValidity(
              "Prosim, vnesite veljaven e-poštni naslov."
            )
          }
          onInput={(e) =>
            (e.target as HTMLInputElement).setCustomValidity("")
          }
        />
      </div>

      <div>
        <label htmlFor="login-password" className="block mb-1 font-medium">
          Geslo
        </label>
        <input
          type="password"
          id="login-password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Vnesite geslo"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
          onInvalid={(e) =>
            (e.target as HTMLInputElement).setCustomValidity(
              "Prosim, vnesite geslo."
            )
          }
          onInput={(e) =>
            (e.target as HTMLInputElement).setCustomValidity("")
          }
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
      >
        Prijavi se
      </button>

      <p className="text-center text-sm text-gray-600">
        Še nimaš računa?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="text-blue-600 font-medium hover:underline"
        >
          Registriraj se
        </button>
      </p>
    </form>
  );
}
