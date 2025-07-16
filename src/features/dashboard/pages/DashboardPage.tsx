import { Select, SelectItem } from "@heroui/select";

import {
  IECCard,
  MostParticipatedChallengeCard,
  RecentChallenges,
  SchoolTable,
} from "../components";

import { DasboardCard } from "@/components";
import { title } from "@/components/primitives";
import { Button } from "@/components/ui";

export default function DashboardPage() {
  return (
    <section>
      <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-10">
          <h1 className={title({ size: "lg" })}>Dashboard</h1>
          <div className="flex flex-col items-center gap-3 lg:flex-row">
            <Select
              className="w-full lg:min-w-[200px]"
              classNames={{ value: "font-bold", trigger: "shadow-none" }}
              label="Country"
              placeholder="Select a country"
              radius="lg"
              size="sm"
              style={{ background: "var(--sidebar-bg)" }}
            >
              <SelectItem key="UAE">UAE</SelectItem>
            </Select>
            <Select
              className="min-w-[200px]"
              classNames={{ value: "font-bold", trigger: "shadow-none" }}
              label="Business Type"
              placeholder="Select a business type"
              radius="lg"
              size="sm"
              style={{ background: "var(--sidebar-bg)" }}
            >
              <SelectItem key="B2B">B2B</SelectItem>
              <SelectItem key="B2C">B2C</SelectItem>
            </Select>
          </div>
        </div>
        <Button color="secondary">Add Challenge</Button>
      </div>
      <div className="mb-8">
        <div className="grid grid-cols-1 gap-5 gap-y-4 md:grid-cols-2 md:gap-y-5 lg:grid-cols-3 xl:grid-cols-5">
          <DasboardCard
            color="#C0718D"
            count={387}
            icon="Group-1"
            label="Active Students"
          />
          <DasboardCard
            color="#111F43"
            count={73}
            icon="BulbOff"
            label="Completed Ideas"
          />
          <DasboardCard
            color="#F79333"
            count={102}
            icon="BulbOn"
            label="Ideas in progress"
          />
          <DasboardCard
            color="#2ECED7"
            count={102}
            icon="School"
            label="Active Schools"
          />

          <IECCard />

          <div className="row-span-2 md:col-span-2 lg:col-span-3 xl:col-span-2 xl:col-start-4 xl:row-start-1 xl:row-end-3">
            <MostParticipatedChallengeCard count={2526} />
          </div>
        </div>
      </div>
      <div className="mb-8">
        <SchoolTable />
      </div>
      <div className="mb-8">
        <RecentChallenges />
      </div>
    </section>
  );
}
