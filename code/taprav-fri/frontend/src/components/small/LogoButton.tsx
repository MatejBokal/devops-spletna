import Link from "next/link";
import React from "react";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

type LogoButtonProps = {
  href: string;
  bgColor: string;
  alt: string;
  src: string;
  children: React.ReactNode;
};

const LogoButton = ({ href, bgColor, alt, src, children }: LogoButtonProps) => {
    const isWolt = href === "https://wolt.com/sl/svn/ljubljana/restaurant/park-zibert";
    const hide = "";

    
  return (
    <Link
      href={href}
      className={`relative aspect-5/4 rounded-xl flex items-center justify-center ${bgColor} hover:opacity-90 transition ${hide}`}
    >

      <ArrowUpRight className="absolute top-0.5 right-0.5 w-5 h-5 text-black md:hidden" strokeWidth={1.5}/>

      <Image
        src={src}
        alt={alt}
        width={1000}
        height={560}
        className="object-contain"
        priority
      />
      
    </Link>
  );
};

export default LogoButton;
