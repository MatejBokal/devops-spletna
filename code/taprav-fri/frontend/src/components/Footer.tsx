import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-white border-t-2 border-gray-100 py-8 px-4  mt-3">
      <div className="max-w-screen-md mx-auto text-center">
        <div className="flex justify-center gap-6 mb-4">
          <Link href="https://www.facebook.com/tapravzibert" target="_blank" aria-label="Facebook">
            <Image
              src="/slike/facebook.svg"
              alt="Facebook"
              width={32}
              height={32}
              className="hover:opacity-80 transition"
            />
          </Link>
          <Link href="https://www.instagram.com/tapravzibert/" target="_blank" aria-label="Instagram">
            <Image
              src="/slike/instagram.svg"
              alt="Instagram"
              width={32}
              height={32}
              className="hover:opacity-80 transition"
            />
          </Link>
          <Link href="https://www.tiktok.com/@tapravdrivein" target="_blank" aria-label="TikTok">
            <Image
              src="/slike/tiktok.svg"
              alt="TikTok"
              width={32}
              height={32}
              className="hover:opacity-80 transition"
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 justify-center">
          <div className="space-y-2 text-center">
            <Link href="/">
            <h4 className="text-lg font-semibold mb-2">Taprav</h4>
            </Link>
            <ul className="space-y-1 text-sm text-gray-700 font-medium">
              <li>
                <Link href="/zibert" className="hover:underline">
                  Žibert
                </Link>
              </li>
              <li>
                <Link href="/drive-in" className="hover:underline">
                  Drive-in
                </Link>
              </li>
              <li>
                <Link href="/rooms" className="hover:underline">
                  Rooms Žibert
                </Link>
              </li>
              <li>
                <Link href="/dogodki" className="hover:underline">
                  Dogodki
                </Link>
              </li>
              <li>
                <Link href="/o-nas" className="hover:underline">
                  O nas
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="hover:underline">
                  Kontakt
                </Link>
              </li>
              <li>
                <Link href="https://wolt.com/sl/svn/ljubljana/restaurant/park-zibert" className="hover:underline">
                  Wolt
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-8 align-center">&copy; 2025 Taprav d. o. o.</p>
      </div>
    </footer>
  );
};

export default Footer;
