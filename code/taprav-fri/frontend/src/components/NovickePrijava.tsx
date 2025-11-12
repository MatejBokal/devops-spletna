"use client";

import React from "react";

const NovickePrijava = () => {
  return (
    <>
    <hr className="my-1 h-0.5 border-t-0 bg-gray-100 md:w-65/100 w-90/100 mx-auto" />
    <section className="bg-white py-3 px-6 text-center">
      <div className="max-w-md mx-auto">
        <h3 className="text-2xl font-extrabold mb-4">
          Naroči se na Taprave novičke.
        </h3>
        <p className="mb-4 ">
          In bodi na tekočem glede nove punudbe in <b>ekskluzivnih</b> ugodnosti.
        </p>

        <form className="space-y-4">
          <input
            type="email"
            required
            placeholder="Tvoj e-poštni naslov"
            className="w-full rounded-lg px-4 py-3 text-center bg-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <button
            type="submit"
            className="md:w-4/10 w-4/10 rounded-lg bg-[#FFE76E] hover:bg-yellow-400 hover:cursor-pointer text-black font-bold py-3 transition px-2"
          >
            Prijava
          </button>
        </form>
      </div>
    </section>
    </>
  );
};

export default NovickePrijava;
