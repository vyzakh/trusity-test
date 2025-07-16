import { Link } from "react-router";

import { IECCard, SchoolsTable } from "../components";

import { DasboardCard, PageWrapper } from "@/components";
import { title } from "@/components/primitives";
import { Button } from "@/components/ui";

export default function SchoolsPage() {
  return (
    <PageWrapper>
      <div className="flex items-center justify-between">
        <h1 className={title({ size: "lg" })}>Schools</h1>
        <Button as={Link} color="secondary" to="create">
          Add School
        </Button>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
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
        <IECCard />
      </div>
      <SchoolsTable />
    </PageWrapper>
  );
}
