import { useQuery } from "@apollo/client";
import { BreadcrumbItem, Breadcrumbs } from "@heroui/breadcrumbs";
import { Skeleton } from "@heroui/skeleton";
import { Tab, Tabs } from "@heroui/tabs";
import { Link, Outlet, useLocation, useParams } from "react-router";

import { PageWrapper } from "@/components";
import { Button } from "@/components/ui";
import { SchoolInfo } from "@/features/school/components";
import { SCHOOL_QUERY } from "@/features/school/pages/schools/services/schoolQueries";
import type { SchoolQueryResponse } from "@/features/school/pages/schools/services/types";

type TabsTypes = "students" | "teachers" | "admins" | "grades" | "challenges";

export default function SchoolLayout() {
  const { pathname } = useLocation();
  const { schoolId } = useParams();
  const selectedKey = pathname.split("/").pop() || "";
  const { data, loading } = useQuery<SchoolQueryResponse, { schoolId: string }>(
    SCHOOL_QUERY,
    {
      variables: { schoolId: schoolId! },
      skip: !schoolId,
    },
  );

  const renderButton = {
    students: (
      <Button as={Link} color="secondary" radius="full" to="students/create">
        Add Student
      </Button>
    ),
    teachers: (
      <Button as={Link} color="secondary" radius="full" to="teachers/create">
        Add Teacher
      </Button>
    ),
    admins: (
      <Button as={Link} color="secondary" radius="full" to="admins/create">
        Add Admin
      </Button>
    ),
    challenges: null,
    grades: (
      <Button as={Link} color="secondary" radius="full" to="grades/create">
        Add Grade
      </Button>
    ),
  };

  return (
    <PageWrapper>
      <Breadcrumbs underline="hover">
        <BreadcrumbItem>
          <Link to="/schools">Schools</Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          {loading ? (
            <Skeleton className="h-3 w-40 rounded-xl" />
          ) : (
            data?.school?.name
          )}
        </BreadcrumbItem>
      </Breadcrumbs>
      <SchoolInfo data={data?.school} isLoading={loading} />
      <div className="mt-5 flex flex-wrap items-center justify-between gap-x-3 gap-y-5">
        <div className="overflow-y-auto">
          <Tabs
            aria-label="School status"
            classNames={{
              tabList: "bg-white border-1 shadow-none",
              tab: "p-0",
              tabContent: "h-full w-full",
            }}
            color="primary"
            radius="full"
            selectedKey={selectedKey}
            variant="bordered"
          >
            <Tab
              key="students"
              title={
                <Link
                  className="grid h-full w-full place-items-center px-3 py-1"
                  to="students"
                >
                  Students
                </Link>
              }
            />
            {/* <Tab
              key="admins"
              title={
                <Link
                  className="grid h-full w-full place-items-center px-3 py-1"
                  to="admins"
                >
                  Admins
                </Link>
              }
            /> */}
            <Tab
              key="teachers"
              title={
                <Link
                  className="grid h-full w-full place-items-center px-3 py-1"
                  to="teachers"
                >
                  Teachers
                </Link>
              }
            />
            {/* <Tab
              key="challenges"
              title={
                <Link
                  className="grid h-full w-full place-items-center px-3 py-1"
                  to="challenges"
                >
                  Challenges
                </Link>
              }
            /> */}
            <Tab
              key="grades"
              title={
                <Link
                  className="grid h-full w-full place-items-center px-3 py-1"
                  to="grades"
                >
                  Grade/Year & Section
                </Link>
              }
            />
          </Tabs>
        </div>
        {renderButton[selectedKey as TabsTypes]}
      </div>

      {/* RENDER PAGES HERE */}
      <Outlet />
    </PageWrapper>
  );
}
