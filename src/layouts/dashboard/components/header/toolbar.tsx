import { Badge } from "@heroui/badge";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { User } from "@heroui/user";

const BellIcon = () => (
  <svg
    fill="none"
    height="30"
    viewBox="0 0 21 30"
    width="21"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20 21.8814C20 23.1864 18.9322 24.2542 17.6271 24.2542H3.38985C2.08476 24.2542 1.01697 23.1864 1.01697 21.8814C1.01697 20.973 1.53426 20.1796 2.28877 19.7812C3.00568 19.4026 3.38985 18.5962 3.38985 17.7855V10.4915C3.38985 6.56002 6.57698 3.37289 10.5085 3.37289C14.44 3.37289 17.6271 6.56002 17.6271 10.4915V17.7855C17.6271 18.5962 18.0113 19.4026 18.7282 19.7812C19.4827 20.1796 20 20.973 20 21.8814Z"
      stroke="#2E3130"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth="1.5"
    />
    <path
      d="M8.13562 29H12.8814"
      stroke="#2E3130"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth="1.5"
    />
    <path
      d="M10.5085 1.00001V3.37289"
      stroke="#2E3130"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth="1.5"
    />
  </svg>
);

export default function Toolbar() {
  return (
    <section className="flex shrink-0 items-center gap-2 sm:px-5">
      <Badge classNames={{ badge: "text-sm" }} color="danger" content="50">
        <Button isIconOnly className="lg:hidden" radius="full" variant="light">
          <svg
            fill="none"
            height="30"
            viewBox="0 0 23 22"
            width="30"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20.2397 19.7398C20.1114 19.8662 19.9386 19.9372 19.7585 19.9375C19.5759 19.9367 19.4006 19.866 19.2687 19.7398L15.5562 16.0188C13.9926 17.3321 11.9824 17.991 9.94478 17.8582C7.90717 17.7254 5.99949 16.8111 4.61961 15.306C3.23974 13.8009 2.4942 11.8211 2.53849 9.7797C2.58278 7.73825 3.41348 5.79271 4.85734 4.34885C6.30121 2.90499 8.24674 2.07429 10.2882 2.03C12.3296 1.9857 14.3094 2.73124 15.8145 4.11112C17.3196 5.491 18.2339 7.39868 18.3667 9.43629C18.4995 11.4739 17.8405 13.4841 16.5272 15.0477L20.2397 18.7602C20.3047 18.8241 20.3563 18.9004 20.3915 18.9845C20.4267 19.0686 20.4448 19.1588 20.4448 19.25C20.4448 19.3412 20.4267 19.4314 20.3915 19.5155C20.3563 19.5996 20.3047 19.6759 20.2397 19.7398ZM10.4772 16.5C11.769 16.5 13.0318 16.117 14.1058 15.3993C15.1799 14.6816 16.017 13.6616 16.5113 12.4682C17.0057 11.2747 17.135 9.96151 16.883 8.69457C16.631 7.42763 16.0089 6.26387 15.0955 5.35046C14.1821 4.43705 13.0184 3.81501 11.7514 3.563C10.4845 3.31099 9.17127 3.44033 7.97784 3.93467C6.78441 4.429 5.76437 5.26613 5.04671 6.34019C4.32905 7.41424 3.946 8.67699 3.946 9.96875C3.94827 11.7003 4.63711 13.3602 5.86147 14.5845C7.08582 15.8089 8.74575 16.4977 10.4772 16.5Z"
              fill="#B0B0B0"
            />
          </svg>
        </Button>
        <Button isIconOnly radius="full" variant="light">
          <BellIcon />
        </Button>
      </Badge>
      <Button isIconOnly className="rounded-full sm:hidden" variant="light">
        <svg
          height={24}
          viewBox="0 0 24 24"
          width={24}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className="fill-primary"
            d="M22 18.005c0 .55-.446.995-.995.995h-8.01a.995.995 0 0 1 0-1.99h8.01c.55 0 .995.445.995.995M22 12c0 .55-.446.995-.995.995H2.995a.995.995 0 1 1 0-1.99h18.01c.55 0 .995.446.995.995m-.995-5.01a.995.995 0 0 0 0-1.99H8.995a.995.995 0 1 0 0 1.99z"
          />
        </svg>
      </Button>
      <Dropdown backdrop="blur" placement="bottom-end">
        <DropdownTrigger>
          <Button
            disableRipple
            className="hidden gap-5 px-1 data-[hover=true]:bg-transparent sm:flex"
            endContent={
              <svg
                fill="none"
                height="8"
                viewBox="0 0 15 8"
                width="15"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.9999 0.75L7.49988 7.25L0.999878 0.75"
                  stroke="#313131"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
              </svg>
            }
            variant="light"
          >
            <User
              avatarProps={{
                src: "https://i.pravatar.cc/150?u=a04258a2462d826712d",
              }}
              classNames={{
                name: "max-w-36 truncate",
                description: "max-w-36 truncate",
              }}
              description="Admin"
              name="Mubashir K P"
            />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Profile Actions"
          disabledKeys={["name"]}
          variant="flat"
        >
          <DropdownItem key="name" className="h-14 gap-2 opacity-100">
            <p className="text-primary text-xs font-semibold">Signed in as</p>
            <p className="text-primary font-semibold">Mubashir K P</p>
          </DropdownItem>
          <DropdownItem key="profile">Profile</DropdownItem>
          <DropdownItem key="logout" color="danger">
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </section>
  );
}
