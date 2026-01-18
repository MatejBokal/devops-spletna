import LogoButton from "@/components/small/LogoButton";
import InfoButton from "./small/InfoButton";

// real color
// const bg_drive = "bg-[#FFA178]"

// test update for docker and k8s testing:
const bg_drive = "bg-black"

const logoButtons = [
  { href: "/zibert",       label: "Žibert",  bg: "bg-[#FFE76E]", src: "/slike/logo-zibert.png" },
  { href: "/drive-in",     label: "Drive-in",bg: bg_drive, src: "/slike/logo-drive-in.png" },
  { href: "/rooms",        label: "Rooms",   bg: "bg-[#D8BDA7]", src: "/slike/logo-rooms.png" },
  { href: "/dogodki",      label: "Dogodki",bg:"bg-[#FFB6B6]", src: "/slike/logo-dogodki.png" },
  { href: "https://wolt.com/sl/svn/ljubljana/restaurant/park-zibert", 
                         label: "Wolt",    bg: "bg-[#99E5FF]", src: "/slike/logo-wolt.png" },
];

const infoButtons = [
  { href: "/o-nas", label: "SPOZNAJ NAS", bg: "bg-[#FFE76E]"},
  { href: "/kontakt", label: "KONTAKT", bg: "bg-[#E2E2E2]"},
]

const HomepageGrid = () => {
  return (
    <section
      className="
        py-4 md:py-6
        w-9/10 md:w-6/10 max-w-screen-xl
        mx-auto
        grid grid-cols-2 md:grid-cols-3
        gap-2 md:gap-4 lg:gap-8
      "
    >
      {logoButtons.map((link) => (
        <LogoButton
          key={link.href}
          href={link.href}
          bgColor={link.bg}
          alt={link.label}
          src={link.src}
        >
          <span className="text-2xl font-bold">{link.label}</span>
        </LogoButton>
      ))}

      <div className="flex flex-col h-full gap-2 md:gap-4 lg:gap-8">
        {infoButtons.map((link) => (
          <InfoButton key={link.href} href={link.href} label={link.label} bgColor={link.bg} />
        ))}
      </div>
    </section>
  );
};

export default HomepageGrid;
