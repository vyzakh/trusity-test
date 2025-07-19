import { Divider } from "@heroui/divider";
import { Image } from "@heroui/image";
import { Skeleton } from "@heroui/skeleton";
import { Switch } from "@heroui/switch";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { Link, useParams } from "react-router";
import { twMerge } from "tailwind-merge";

import IECCard from "../../pages/schools/components/IECCard";

import { DasboardCard, NA } from "@/components";
import { title } from "@/components/primitives";
import { Button } from "@/components/ui";
import type { SchoolQueryResponse } from "../../pages/schools/services/types";

type SchoolInfoParams = {
  data: SchoolQueryResponse["school"] | undefined;
  isLoading: boolean;
};

export default function SchoolInfo({ data, isLoading }: SchoolInfoParams) {
  const { schoolId } = useParams<{ schoolId: string }>();
  const [isExpand, setIsExpand] = React.useState(false);

  const handleExpand = () => setIsExpand((prevState) => !prevState);

  return (
    <section
      className="rounded-xl px-5 py-8"
      style={{ background: "var(--sidebar-bg)" }}
    >
      <div className="mb-5 flex flex-wrap items-center gap-x-8 gap-y-5">
        {isLoading ? (
          <React.Fragment>
            <Skeleton className="rounded-lg">
              <div className="size-32 rounded-lg" />
            </Skeleton>
            <div className="flex grow flex-col gap-4">
              <Skeleton className="w-44 rounded-lg">
                <div className="h-8 rounded-lg" />
              </Skeleton>
              <div className="flex items-center gap-x-6">
                <div className="flex w-40 flex-col gap-1">
                  <Skeleton className="rounded-lg">
                    <div className="h-4 rounded-lg" />
                  </Skeleton>
                  <Skeleton className="rounded-lg">
                    <div className="h-4 rounded-lg" />
                  </Skeleton>
                </div>
                <Divider className="h-8 shrink-0" orientation="vertical" />
                <div className="flex w-40 flex-col gap-1">
                  <Skeleton className="rounded-lg">
                    <div className="h-4 rounded-lg" />
                  </Skeleton>
                  <Skeleton className="rounded-lg">
                    <div className="h-4 rounded-lg" />
                  </Skeleton>
                </div>
              </div>
            </div>
          </React.Fragment>
        ) : (
          <>
            <Image
              className="size-32 shrink-0 bg-white object-contain"
              src={data?.logoUrl ?? "/logo.png"}
            />
            <div className="flex grow flex-col gap-4">
              <h1
                className={twMerge(
                  title({ size: "sm", className: "max-w-xl font-bold" }),
                )}
              >
                {data?.name}
              </h1>
              <div className="flex items-center gap-x-6">
                <div className="flex max-w-sm flex-col gap-1">
                  <p className="text-xs">Curriculums</p>
                  <p className="text-medium font-bold">
                    {data && data?.curriculums?.length > 0 ? (
                      data?.curriculums
                        ?.map((c) => (c.allowCustom ? c.otherName : c.name))
                        ?.join(", ")
                    ) : (
                      <NA />
                    )}
                  </p>
                </div>
                <Divider className="h-8 shrink-0" orientation="vertical" />
                <div className="flex max-w-sm flex-col gap-1">
                  <p className="text-xs">Number of licences</p>
                  <p className="text-medium font-bold text-[#3EC7F4]">
                    {data?.license?.totalLicense}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
        <div className="flex flex-col items-center gap-2">
          <Button
            as={Link}
            className="w-full border-1 border-[#D5D5D5] bg-white px-5"
            endContent={
              <svg
                fill="none"
                height="16"
                viewBox="0 0 16 16"
                width="16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.2069 4.58561L11.4144 1.79249C11.3215 1.6996 11.2113 1.62592 11.0899 1.57565C10.9686 1.52539 10.8385 1.49951 10.7072 1.49951C10.5759 1.49951 10.4458 1.52539 10.3245 1.57565C10.2031 1.62592 10.0929 1.6996 10 1.79249L2.29313 9.49999C2.19987 9.59251 2.12593 9.70265 2.0756 9.824C2.02528 9.94535 1.99959 10.0755 2.00001 10.2069V13C2.00001 13.2652 2.10536 13.5196 2.2929 13.7071C2.48043 13.8946 2.73479 14 3.00001 14H5.79313C5.9245 14.0004 6.05464 13.9747 6.17599 13.9244C6.29735 13.8741 6.40748 13.8001 6.50001 13.7069L14.2069 5.99999C14.2998 5.90712 14.3734 5.79687 14.4237 5.67553C14.474 5.55419 14.4999 5.42414 14.4999 5.2928C14.4999 5.16146 14.474 5.0314 14.4237 4.91006C14.3734 4.78872 14.2998 4.67847 14.2069 4.58561ZM5.79313 13H3.00001V10.2069L8.50001 4.70686L11.2931 7.49999L5.79313 13ZM12 6.79249L9.20688 3.99999L10.7069 2.49999L13.5 5.29249L12 6.79249Z"
                  fill="#595959"
                />
              </svg>
            }
            radius="full"
            size="sm"
            state={{ from: `/schools/${schoolId}` }}
            to={`../${schoolId}/update`}
            variant="bordered"
          >
            Edit
          </Button>
          <Switch
            // className="w-24"
            classNames={{
              wrapper: "w-[100px] bg-danger",
              base: "w-[100px]",
              thumb:
                "group-data-[selected=true]:ms-[72px] group-data-[selected=true]:group-data-[pressed=true]:ms-[68px]",
              endContent: "text-white",
              startContent: "text-white",
            }}
            color="success"
            endContent={<span>Inactive</span>}
            startContent={<span>Active</span>}
          />
          <Button
            className="h-7 px-2 text-[#1B6BFF]"
            disabled={isLoading}
            endContent={
              <svg
                className={`${isExpand && "-rotate-180"} transition-transform`}
                fill="none"
                height="8"
                viewBox="0 0 15 8"
                width="15"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14 0.75L7.5 7.25L1 0.749999"
                  stroke="#1B6BFF"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
              </svg>
            }
            radius="full"
            size="sm"
            variant="light"
            onPress={handleExpand}
          >
            View Details
          </Button>
        </div>
      </div>
      <Divider className="mb-5 bg-[#D3D3D3]" />

      <AnimatePresence initial={false} mode="wait">
        {isExpand && (
          <motion.div
            animate={{
              height: "auto",
              opacity: 1,
              transition: {
                height: {
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                },
                opacity: { duration: 0.2 },
              },
            }}
            className="overflow-hidden"
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: {
                  duration: 0.2,
                },
                opacity: { duration: 0.1 },
              },
            }}
            initial={{ height: 0, opacity: 0 }}
          >
            <div className="grid origin-top gap-x-3 gap-y-5 pb-5 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col gap-1">
                <p className="text-xs text-[#1C1C1C]">Email</p>
                <p className="text-primary font-bold">
                  {data?.contact?.email ?? <NA />}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xs text-[#1C1C1C]">Point of Contact</p>
                <p className="text-primary font-bold">
                  {data?.contact?.name ?? <NA />}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xs text-[#1C1C1C]">Contact Number</p>
                <p className="text-primary font-bold">
                  {data?.contact?.contactNumber ?? <NA />}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xs text-[#1C1C1C]">Address</p>
                <p className="text-primary font-bold">
                  {data?.address?.streetAddressLine1}
                </p>
                {data?.address?.streetAddressLine2 && (
                  <p className="text-primary font-bold">
                    {data?.address?.streetAddressLine2}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xs text-[#1C1C1C]">City</p>
                <p className="text-primary font-bold">
                  {data?.address?.city?.name}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xs text-[#1C1C1C]">State/ Province</p>
                <p className="text-primary font-bold">
                  {data?.address?.state?.name}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xs text-[#1C1C1C]">Postal Code</p>
                <p className="text-primary font-bold">
                  {data?.address?.postalCode}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xs text-[#1C1C1C]">Contact Number</p>
                <p className="text-primary font-bold">
                  {data?.address?.contactNumber ?? <NA />}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xs text-[#1C1C1C]">Created Date</p>
                <p className="text-primary font-bold">123</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <DasboardCard
          bgColor="#FEFEFE99"
          color="#C0718D"
          count={387}
          icon="Group-1"
          iconBg="#E9EDF280"
          label="Active Students"
        />
        <DasboardCard
          bgColor="#FEFEFE99"
          color="#111F43"
          count={73}
          icon="BulbOff"
          iconBg="#E9EDF280"
          label="Completed Ideas"
        />
        <DasboardCard
          bgColor="#FEFEFE99"
          color="#F79333"
          count={102}
          icon="BulbOn"
          iconBg="#E9EDF280"
          label="Ideas in progress"
        />
        <IECCard bgColor="#FEFEFE99" />
      </div>
    </section>
  );
}
