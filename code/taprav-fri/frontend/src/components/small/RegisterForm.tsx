// src/app/components/small/RegisterForm.tsx
"use client";

import { useState } from "react";

export default function RegisterForm({
  onSwitch,
  onSuccess,
}: {
  onSwitch: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    agreedTos: false,
    agreedMarketing: false,
  });
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.password ||
      !form.confirmPassword ||
      !form.phone
    ) {
      setError("Prosim, izpolnite vsa polja.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Gesli se ne ujemata.");
      return;
    }
    if (!form.agreedTos) {
      setError("Prosim, strinjajte se s pogoji uporabe.");
      return;
    }

    try {
      const res = await fetch("/taprav-fri/api/register.php", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: form.firstName,
          last_name: form.lastName,
          email: form.email,
          password: form.password,
          confirm_password: form.confirmPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        onSuccess();
      } else {
        setError(data.error || "Napaka pri registraciji.");
      }
    } catch (err: any) {
      console.error(err);
      setError("Prišlo je do napake pri registraciji.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div>
        <label htmlFor="reg-firstName" className="block mb-1 font-medium">
          Ime
        </label>
        <input
          type="text"
          id="reg-firstName"
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          placeholder="Vnesite ime"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
          onInvalid={(e) =>
            (e.target as HTMLInputElement).setCustomValidity("Prosim, vnesite ime.")
          }
          onInput={(e) =>
            (e.target as HTMLInputElement).setCustomValidity("")
          }
        />
      </div>

      <div>
        <label htmlFor="reg-lastName" className="block mb-1 font-medium">
          Priimek
        </label>
        <input
          type="text"
          id="reg-lastName"
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          placeholder="Vnesite priimek"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
          onInvalid={(e) =>
            (e.target as HTMLInputElement).setCustomValidity(
              "Prosim, vnesite priimek."
            )
          }
          onInput={(e) =>
            (e.target as HTMLInputElement).setCustomValidity("")
          }
        />
      </div>

      <div>
        <label htmlFor="reg-email" className="block mb-1 font-medium">
          E-pošta
        </label>
        <input
          type="email"
          id="reg-email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Vnesite e-pošto"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
          onInvalid={(e) => {
            const input = e.target as HTMLInputElement;
            if (input.validity.valueMissing) {
              input.setCustomValidity("Prosim, vnesite e-pošto.");
            } else {
              input.setCustomValidity(
                "Prosim, vnesite veljaven e-poštni naslov."
              );
            }
          }}
          onInput={(e) =>
            (e.target as HTMLInputElement).setCustomValidity("")
          }
        />
      </div>

      <div>
        <label htmlFor="reg-password" className="block mb-1 font-medium">
          Geslo
        </label>
        <input
          type="password"
          id="reg-password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Vnesite geslo"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
          onInvalid={(e) =>
            (e.target as HTMLInputElement).setCustomValidity("Prosim, vnesite geslo.")
          }
          onInput={(e) =>
            (e.target as HTMLInputElement).setCustomValidity("")
          }
        />
      </div>

      <div>
        <label htmlFor="reg-confirmPassword" className="block mb-1 font-medium">
          Potrdi geslo
        </label>
        <input
          type="password"
          id="reg-confirmPassword"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Ponovno vnesite geslo"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
          onInvalid={(e) =>
            (e.target as HTMLInputElement).setCustomValidity("Prosim, potrdite geslo.")
          }
          onInput={(e) =>
            (e.target as HTMLInputElement).setCustomValidity("")
          }
        />
      </div>

      <div>
        <label htmlFor="reg-phone" className="block mb-1 font-medium">
          Telefonska številka
        </label>
        <input
          type="tel"
          id="reg-phone"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Vnesite telefonsko številko"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
          onInvalid={(e) =>
            (e.target as HTMLInputElement).setCustomValidity(
              "Prosim, vnesite telefonsko številko."
            )
          }
          onInput={(e) =>
            (e.target as HTMLInputElement).setCustomValidity("")
          }
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="reg-agreedTos"
          name="agreedTos"
          checked={form.agreedTos}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-400 border-gray-300 rounded"
          required
        />
        <label htmlFor="reg-agreedTos" className="ml-2 text-sm">
          Strinjam se s{" "}
          <a href="#" className="text-blue-600 hover:underline">
            pogoji uporabe
          </a>
        </label>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
      >
        Registriraj se
      </button>

      <p className="text-center text-sm text-gray-600">
        Že imaš račun?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="text-blue-600 font-medium hover:underline"
        >
          Prijavi se
        </button>
      </p>
    </form>
  );
}
