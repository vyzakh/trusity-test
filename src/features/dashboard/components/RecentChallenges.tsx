import { Card } from "@heroui/card";
import { Image } from "@heroui/image";
import { twMerge } from "tailwind-merge";

import { title } from "@/components/primitives";
import { Button } from "@/components/ui";

export default function RecentChallenges() {
  return (
    <div
      className="flex flex-col gap-4 rounded-xl p-5"
      style={{
        background:
          "radial-gradient(101.83% 101.83% at 50% -1.83%, #D4E2F2 0%, #E9EDF2 39.9%)",
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className={twMerge(title({ size: "lg" }), "text-primary")}>
          Recent Challenges
        </h1>
        <Button
          className="bg-[#FEFDFF]"
          endContent={
            <svg
              fill="none"
              height="16"
              viewBox="0 0 9 16"
              width="9"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.5 1.5L8 8L1.5 14.5"
                stroke="#30302F"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </svg>
          }
          variant="solid"
        >
          View All Challenges
        </Button>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => {
          return (
            <Card key={index} className="group shadow-none">
              <Image
                classNames={{
                  img: "rounded-none group-hover:scale-110",
                  wrapper: "h-44 overflow-hidden rounded-none",
                }}
                src="/tik-tok.jpg"
              />
              <div className="flex flex-col gap-5 p-5">
                <h5 className="font-bold text-[#343434]">
                  Tiktok Digital Marketing
                </h5>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <svg
                      fill="none"
                      height="28"
                      viewBox="0 0 29 28"
                      width="29"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_211_4477)">
                        <path
                          d="M14.5305 11.1509C16.8721 11.1509 18.7703 9.29468 18.7703 7.00495C18.7703 4.71521 16.8721 2.85901 14.5305 2.85901C12.189 2.85901 10.2908 4.71521 10.2908 7.00495C10.2908 9.29468 12.189 11.1509 14.5305 11.1509Z"
                          stroke="#949494"
                          strokeMiterlimit="10"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M23.546 13.3532C25.2169 13.3532 26.5715 12.0287 26.5715 10.3947C26.5715 8.76074 25.2169 7.43616 23.546 7.43616C21.8751 7.43616 20.5205 8.76074 20.5205 10.3947C20.5205 12.0287 21.8751 13.3532 23.546 13.3532Z"
                          stroke="#949494"
                          strokeMiterlimit="10"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M5.44737 13.3532C7.11831 13.3532 8.47287 12.0287 8.47287 10.3947C8.47287 8.76074 7.11831 7.43616 5.44737 7.43616C3.77644 7.43616 2.42188 8.76074 2.42188 10.3947C2.42188 12.0287 3.77644 13.3532 5.44737 13.3532Z"
                          stroke="#949494"
                          strokeMiterlimit="10"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M11.8171 13.2869H17.183C19.0146 13.2869 20.507 14.7462 20.507 16.5373V25.1409H8.49316V16.5373C8.49316 14.7462 9.98556 13.2869 11.8171 13.2869Z"
                          stroke="#949494"
                          strokeMiterlimit="10"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M20.093 15.5291H24.8755C26.8699 15.5291 28.4911 17.1145 28.4911 19.0647V23.5423C28.4911 24.4246 27.7585 25.141 26.8563 25.141H20.3847"
                          stroke="#949494"
                          strokeMiterlimit="10"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M8.5813 25.141H2.14364C1.24142 25.141 0.508789 24.4246 0.508789 23.5423V19.0647C0.508789 17.1145 2.13008 15.5291 4.12446 15.5291H8.90692"
                          stroke="#949494"
                          strokeMiterlimit="10"
                          strokeWidth="1.5"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_211_4477">
                          <rect fill="white" height="28" width="29" />
                        </clipPath>
                      </defs>
                    </svg>
                    <span className="text-medium font-bold text-[#343434]">
                      100
                    </span>
                  </div>
                  <Button
                    className="border-[#D5D5D5] bg-white text-[#111F43]"
                    size="sm"
                    variant="bordered"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
