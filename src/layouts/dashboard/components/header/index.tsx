import Logo from "./logo";
import Toolbar from "./toolbar";

import { Input } from "@/components/ui";

const SearchIcon = () => (
  <svg
    fill="none"
    height="22"
    viewBox="0 0 23 22"
    width="23"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20.2397 19.7398C20.1114 19.8662 19.9386 19.9372 19.7585 19.9375C19.5759 19.9367 19.4006 19.866 19.2687 19.7398L15.5562 16.0188C13.9926 17.3321 11.9824 17.991 9.94478 17.8582C7.90717 17.7254 5.99949 16.8111 4.61961 15.306C3.23974 13.8009 2.4942 11.8211 2.53849 9.7797C2.58278 7.73825 3.41348 5.79271 4.85734 4.34885C6.30121 2.90499 8.24674 2.07429 10.2882 2.03C12.3296 1.9857 14.3094 2.73124 15.8145 4.11112C17.3196 5.491 18.2339 7.39868 18.3667 9.43629C18.4995 11.4739 17.8405 13.4841 16.5272 15.0477L20.2397 18.7602C20.3047 18.8241 20.3563 18.9004 20.3915 18.9845C20.4267 19.0686 20.4448 19.1588 20.4448 19.25C20.4448 19.3412 20.4267 19.4314 20.3915 19.5155C20.3563 19.5996 20.3047 19.6759 20.2397 19.7398ZM10.4772 16.5C11.769 16.5 13.0318 16.117 14.1058 15.3993C15.1799 14.6816 16.017 13.6616 16.5113 12.4682C17.0057 11.2747 17.135 9.96151 16.883 8.69457C16.631 7.42763 16.0089 6.26387 15.0955 5.35046C14.1821 4.43705 13.0184 3.81501 11.7514 3.563C10.4845 3.31099 9.17127 3.44033 7.97784 3.93467C6.78441 4.429 5.76437 5.26613 5.04671 6.34019C4.32905 7.41424 3.946 8.67699 3.946 9.96875C3.94827 11.7003 4.63711 13.3602 5.86147 14.5845C7.08582 15.8089 8.74575 16.4977 10.4772 16.5Z"
      fill="#B0B0B0"
    />
  </svg>
);

export default function Header() {
  return (
    <header
      className="sticky top-0 z-[999] w-full shrink-0"
      style={{
        borderBottom: "var(--header-border)",
        borderImageSource: "var(--header-border-image)",
        borderImageSlice: 1,
      }}
    >
      <div className="relative grid h-[var(--header-height)] grid-cols-[var(--sidebar-width)_1fr_var(--sidebar-width)] gap-5 bg-white/[0.001] py-2 backdrop-blur before:absolute before:inset-0 before:-z-[1] before:rounded-md before:bg-white/20 before:backdrop-blur-md before:content-['']">
        <section className="grid shrink-0 place-items-center px-2">
          <Logo />
        </section>
        <section className="hidden place-items-center lg:grid">
          <Input
            className="max-w-xs"
            classNames={{
              inputWrapper:
                "group-data-[hover=true]:bg-white group-data-[focus=true]:bg-white shadow-none bg-[#FFFFFF80]",
            }}
            placeholder="Search"
            startContent={<SearchIcon />}
          />
        </section>
        <Toolbar />
      </div>
    </header>
  );
}
