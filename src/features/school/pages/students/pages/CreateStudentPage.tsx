import { useQuery } from "@apollo/client";
import { useParams } from "react-router";

import { FormWrapper, PageWrapper } from "@/components";
import { BreadcrumbNav } from "@/components/ui";
import { GRADES_BY_SCHOOL_QUERY } from "@/features/school/services/queries";
import type { GradesBySchoolQueryResponse } from "@/features/school/services/types";
import CreateStudentForm from "../components/CreateStudentForm";

export default function CreateStudentPage() {
  const { schoolId } = useParams();

  //LIST ALL GRADES BY SCHOOL QUERY
  const { data: schoolData, loading: isLoadingSchoolData } = useQuery<
    GradesBySchoolQueryResponse,
    { schoolId: string }
  >(GRADES_BY_SCHOOL_QUERY, {
    variables: { schoolId: schoolId! },
    skip: !schoolId,
  });

  return (
    <PageWrapper
      slots={{
        title: "Add Student",
        breadcrumb: (
          <BreadcrumbNav
            items={[
              { label: "Schools", to: "../../.." },
              {
                label: schoolData?.school?.name,
                isLoading: isLoadingSchoolData,
                to: "..",
              },
              { label: "Add Student" },
            ]}
          />
        ),
      }}
    >
      <FormWrapper>
        <CreateStudentForm />
      </FormWrapper>
    </PageWrapper>
  );
}
