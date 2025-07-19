import { FormSkeleton, FormWrapper, PageWrapper } from "@/components";
import { BreadcrumbNav } from "@/components/ui";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router";
import { B2BStudentForm, B2CStudentForm } from "../components/UpdateStudent";
import { STUDENT_QUERY } from "../services/studentQueries";
import type { StudentQueryResponse } from "../services/types";

export default function UpdateStudentPage() {
  const { studentId } = useParams();

  const { data, loading } = useQuery<
    StudentQueryResponse,
    { studentId: string }
  >(STUDENT_QUERY, { variables: { studentId: studentId! }, skip: !studentId });

  const studentData = data?.student;

  return (
    <PageWrapper
      slots={{
        title: "Update Student",
        breadcrumb: (
          <BreadcrumbNav
            items={[
              { label: "Students", to: ".." },
              { label: studentData?.name, isLoading: loading },
            ]}
          />
        ),
      }}
    >
      <FormWrapper>
        {loading ? (
          <FormSkeleton />
        ) : studentData?.accountType === "B2B" ? (
          <B2BStudentForm studentData={studentData} />
        ) : (
          studentData?.accountType === "B2C" && (
            <B2CStudentForm studentData={studentData} />
          )
        )}
      </FormWrapper>
    </PageWrapper>
  );
}
