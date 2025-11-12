export default function AboutPage() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-extrabold mb-12 text-center">O nas</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Lokacija</h2>
          <p className="text-lg">
            335 Celovška cesta<br />
            1210 Ljubljana–Šentvid
          </p>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Kontakt</h2>

          <div className="mb-6">
            <h3 className="font-semibold uppercase text-sm mb-1">Splošne informacije</h3>
            <p><a href="mailto:info@taprav.si" className="underline">info@taprav.si</a></p>
            <p><a href="tel:+38670728787" className="underline">+386 (0) 70 828 787</a></p>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold uppercase text-sm mb-1">Rezervacija miz</h3>
            <p><a href="mailto:strezba.zibert@taprav.si" className="underline">strezba.zibert@taprav.si</a></p>
            <p><a href="tel:+38670728787" className="underline">+386 (0) 70 828 787</a></p>
          </div>

          <div>
            <h3 className="font-semibold uppercase text-sm mb-1">Rooms Žibert</h3>
            <p><a href="mailto:rooms.zibert@taprav.si" className="underline">rooms.zibert@taprav.si</a></p>
            <p><a href="tel:+38670728787" className="underline">+386 (0) 70 828 787</a></p>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Delovni čas</h2>

          <div className="mb-6">
            <h3 className="font-semibold">Taprav Drive-in</h3>
            <p>Vsak dan</p>
            <p className="font-bold">10.00–23.00</p>
          </div>

          <div>
            <h3 className="font-semibold">Taprav Žibert</h3>
            <p>Ponedeljek–petek</p>
            <p className="font-bold">10.00–23.00</p>
            <p className="mt-1">Vikendi & prazniki</p>
            <p className="font-bold">12.00–22.00</p>
          </div>
        </div>
      </div>
    </div>
  );
}
