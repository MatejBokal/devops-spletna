// app/components/Hero.tsx
'use client';

export default function HeroDogodki() {
  return (
    <section
      className="relative h-72 md:h-96 bg-cover bg-center"
      style={{ backgroundImage: "url('/slike/hero.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">
          Tapravi dogodki
        </h2>
        <p className="text-lg md:text-xl text-gray-200">
          Izberi Tapravo zabavo in se prijavi na Taprave dogodke!
        </p>
      </div>
    </section>
  );
}
