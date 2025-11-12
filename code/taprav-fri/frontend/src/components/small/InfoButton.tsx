// src/app/components/small/InfoButton.tsx
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type InfoButtonProps = {
  href: string;
  label: string;
  bgColor: string;
};

const InfoButton = ({ label, href, bgColor }: InfoButtonProps) => {
  return (
    <Link
      href={href}
      className={`
        relative
        flex flex-1 items-center justify-center
        ${bgColor} rounded-xl
        font-bold text-black
        text-[clamp(1rem,2vw,1.5rem)]   /* fluid scaling */
        hover:opacity-90 transition
      `}
    >
      <ArrowUpRight
        className="absolute top-2 right-2 w-5 h-5 text-black md:hidden"
        strokeWidth={1.5}
      />
      {label}
    </Link>
  );
};

export default InfoButton;
