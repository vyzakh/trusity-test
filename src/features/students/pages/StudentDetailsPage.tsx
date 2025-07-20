import { PageWrapper } from "@/components";
import { BreadcrumbNav } from "@/components/ui";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router";
import { BasicInfo } from "../components/StudentDetails";
import { STUDENT_QUERY } from "../services/studentQueries";
import type { StudentQueryResponse } from "../services/types";

export default function StudentDetailPage() {
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
              { label: "Students", to: ".." },
              { label: studentData?.name, isLoading: loading },
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
