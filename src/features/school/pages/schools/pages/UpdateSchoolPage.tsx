import { useQuery } from "@apollo/client";
import { useParams } from "react-router";

import { SCHOOL_QUERY } from "../services/schoolQueries";

import { FormSkeleton, FormWrapper, PageWrapper } from "@/components";
import { BreadcrumbNav } from "@/components/ui";
import { B2BForm, B2CForm } from "../components";
import type { SchoolQueryResponse } from "../services/types";

export default function UpdateSchoolPage() {
  const { schoolId } = useParams<{ schoolId: string }>();

  const { data, loading: isLoadingSchoolData } = useQuery<
    SchoolQueryResponse,
    { schoolId: string }
  >(SCHOOL_QUERY, {
    variables: { schoolId: schoolId! },
    skip: !schoolId,
  });

  const schoolData = data?.school;

  return (
    <PageWrapper
      slots={{
        breadcrumb: (
          <BreadcrumbNav
            items={[
              { label: "Schools", to: "../.." },
              {
                label: schoolData?.name,
                isLoading: isLoadingSchoolData,
                to: "..",
              },
              { label: "Update" },
            ]}
          />
        ),
        title: "Update School",
      }}
    >
      <FormWrapper>
        {isLoadingSchoolData ? (
          <FormSkeleton />
        ) : schoolData?.accountType === "B2B" ? (
          <B2BForm schoolData={schoolData} />
        ) : (
          schoolData?.accountType === "B2C" && (
            <B2CForm schoolData={schoolData} />
          )
        )}
      </FormWrapper>
    </PageWrapper>
  );
}
