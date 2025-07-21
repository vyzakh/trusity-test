import { PageWrapper } from "@/components";
import { BreadcrumbNav } from "@/components/ui";
import { BasicInfo } from "@/features/students/components/StudentDetails";
import { STUDENT_QUERY } from "@/features/students/services/studentQueries";
import type { StudentQueryResponse } from "@/features/students/services/types";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router";

export default function StudentDetailsPage() {
  const { studentId } = useParams();

  const { data, loading } = useQuery<
    StudentQueryResponse,
    { studentId: string }
  >(STUDENT_QUERY, { variables: { studentId: studentId! }, skip: !studentId });

  const studentData = data?.student;
  return (
    <PageWrapper
      slots={{
        breadcrumb: (
          <BreadcrumbNav
            items={[
              { label: "Schools", to: "../../.." },
              {
                label: studentData?.school?.name,
                isLoading: loading,
                to: "../..",
              },
              {
                label: "Students",
                isLoading: loading,
                to: "..",
              },
              {
                label: studentData?.name,
                isLoading: loading,
              },
            ]}
          />
        ),
        title: "Student Details",
      }}
    >
      <BasicInfo data={studentData} isLoading={loading} />
    </PageWrapper>
  );
}
