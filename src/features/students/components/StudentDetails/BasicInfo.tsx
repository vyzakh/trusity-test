import { Divider } from "@heroui/divider";
import { Image } from "@heroui/image";
import { Skeleton } from "@heroui/skeleton";
import React from "react";
import { twMerge } from "tailwind-merge";

import { NA } from "@/components";
import { title } from "@/components/primitives";
import { Card } from "@heroui/card";
import { DateTime } from "luxon";
import type { StudentQueryResponse } from "../../services/types";

type BasicInfoParams = {
  data?: StudentQueryResponse["student"];
  isLoading: boolean;
};

export default function BasicInfo({ data, isLoading }: BasicInfoParams) {
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
              src={"/logo.png"}
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
                  <p className="text-xs">Grade</p>
                  <p className="text-medium font-bold">
                    {data?.grade ? (
                      "text" in data.grade ? (
                        data.grade.text
                      ) : (
                        data.grade.grade.grade
                      )
                    ) : (
                      <NA />
                    )}
                  </p>
                </div>
                <Divider className="h-8 shrink-0" orientation="vertical" />
                <div className="flex max-w-sm flex-col gap-1">
                  <p className="text-xs">Section</p>
                  <p className="text-medium font-bold text-[#3EC7F4]">
                    {data?.section ? (
                      "text" in data.section ? (
                        data.section.text
                      ) : (
                        data.section.section.section
                      )
                    ) : (
                      <NA />
                    )}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
        <div className="flex items-center gap-2">
          <Card classNames={{ base: "shadow-none" }}>
            <div className="flex flex-col items-center gap-1 px-8 py-3">
              <h2 className="text-3xl">02</h2>
              <p className="text-center text-xs">
                Challenges <br /> In Progress
              </p>
            </div>
          </Card>
          <Card classNames={{ base: "shadow-none" }}>
            <div className="flex flex-col items-center gap-1 px-8 py-3">
              <h2 className="text-3xl">02</h2>
              <p className="text-center text-xs">
                Challenges <br /> Completed
              </p>
            </div>
          </Card>
        </div>
      </div>
      <div className="grid origin-top gap-x-3 gap-y-5 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <>
            <div className="flex flex-col gap-2">
              <Skeleton className="w-32 rounded-lg">
                <div className="h-4 rounded-lg" />
              </Skeleton>
              <Skeleton className="w-32 rounded-lg">
                <div className="h-4 rounded-lg" />
              </Skeleton>
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="w-32 rounded-lg">
                <div className="h-4 rounded-lg" />
              </Skeleton>
              <Skeleton className="w-32 rounded-lg">
                <div className="h-4 rounded-lg" />
              </Skeleton>
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="w-32 rounded-lg">
                <div className="h-4 rounded-lg" />
              </Skeleton>
              <Skeleton className="w-32 rounded-lg">
                <div className="h-4 rounded-lg" />
              </Skeleton>
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="w-32 rounded-lg">
                <div className="h-4 rounded-lg" />
              </Skeleton>
              <Skeleton className="w-32 rounded-lg">
                <div className="h-4 rounded-lg" />
              </Skeleton>
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="w-32 rounded-lg">
                <div className="h-4 rounded-lg" />
              </Skeleton>
              <Skeleton className="w-32 rounded-lg">
                <div className="h-4 rounded-lg" />
              </Skeleton>
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="w-32 rounded-lg">
                <div className="h-4 rounded-lg" />
              </Skeleton>
              <Skeleton className="w-32 rounded-lg">
                <div className="h-4 rounded-lg" />
              </Skeleton>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-1">
              <p className="text-xs text-[#1C1C1C]">Email</p>
              <p className="text-primary font-bold">{data?.email ?? <NA />}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs text-[#1C1C1C]">Contact Number</p>
              <p className="text-primary font-bold">
                {data?.contactNumber ?? <NA />}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs text-[#1C1C1C]">Date of Birth</p>
              <p className="text-primary font-bold">
                {data?.dateOfBirth ? (
                  DateTime.fromISO(data.dateOfBirth, { zone: "utc" })
                    .toLocal()
                    .toFormat("dd/MM/yyyy")
                ) : (
                  <NA />
                )}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs text-[#1C1C1C]">Guardian Name</p>
              <p className="text-primary font-bold">{data?.guardian?.name}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs text-[#1C1C1C]">Guardian Email</p>
              <p className="text-primary font-bold">{data?.guardian?.email}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs text-[#1C1C1C]">Guardian Contact Number</p>
              <p className="text-primary font-bold">
                {data?.guardian?.contactNumber}
              </p>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
