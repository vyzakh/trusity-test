import { FormWrapper, PageWrapper } from "@/components";
import { BreadcrumbNav } from "@/components/ui";
import { Select } from "@/components/ui/select";
import type { BusinessType } from "@/core/services/types";
import { SCHOOL_NAMES_QUERY } from "@/features/school/pages/schools/services/schoolQueries";
import type { SchoolNamesQueryResponse } from "@/features/school/pages/schools/services/types";
import { useQuery } from "@apollo/client";
import { Checkbox } from "@heroui/checkbox";
import { Form } from "@heroui/form";
import { SelectItem } from "@heroui/select";
import type { SharedSelection } from "@heroui/system";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { SchoolItem } from "../components/AssignChallenge";
import {
  AssignmentsSchema,
  type AssignmentsSchemaType,
} from "../schemas/assignmentSchema";

export default function AssignChallengePage() {
  //LIST ALL B2B SCHOOLS QUERY
  const { data: b2bSchools, loading: isLoadingSchools } = useQuery<
    SchoolNamesQueryResponse,
    { accountType: BusinessType }
  >(SCHOOL_NAMES_QUERY, {
    variables: { accountType: "B2B" },
  });

  //ALL SCHOOLS
  const schools = b2bSchools?.schools || [];

  const methods = useForm<AssignmentsSchemaType>({
    resolver: zodResolver(AssignmentsSchema),
  });

  const {
    fields: assignmentFields,
   // append: appendAssignment,
   // remove: removeAssignment,
    replace: replaceAssignment,
  } = useFieldArray({
    control: methods.control,
    name: "assignments",
  });

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      const allSchoolIds = schools.map((school) => school.id.toString());
      replaceAssignment(
        allSchoolIds.map((schoolId) => ({
          schoolId,
          isEntire: true, // When selecting all, you might want entire schools
          grades: [],
        })),
      );
    } else {
      replaceAssignment([]);
    }
  };

  const handleSelectSchool = (keys: SharedSelection) => {
    const selectedKeys = Array.from(keys) as string[];
    const existingSchools = assignmentFields?.filter((a) => {
      return selectedKeys.includes(a.schoolId);
    });
    const newSchoolIds = selectedKeys?.filter((schoolId) => {
      return !assignmentFields.some((a) => a.schoolId === schoolId);
    });

    replaceAssignment([
      ...existingSchools,
      ...newSchoolIds.map((schoolId) => ({
        schoolId,
        isEntire: false,
        grades: [],
      })),
    ]);
  };

  return (
    <PageWrapper
      slots={{
        title: "Assign Challenge",
        breadcrumb: (
          <BreadcrumbNav
            items={[
              { label: "Challenges", to: "../.." },
              { label: "Challenge name", to: ".." },
              { label: "Assign Challenge" },
            ]}
          />
        ),
      }}
    >
      <FormWrapper>
        <FormProvider {...methods}>
          <Form>
            <label className="required">Select school</label>

            <Checkbox
              classNames={{ label: "text-sm" }}
              isSelected={assignmentFields?.length === schools?.length}
              onValueChange={handleSelectAll}
            >
              All
            </Checkbox>

            <Select
              aria-label="Select school"
              isRequired
              isLoading={isLoadingSchools}
              placeholder="Select"
              variant="bordered"
              selectionMode="multiple"
              onSelectionChange={handleSelectSchool}
              selectedKeys={assignmentFields?.map((a) => a.schoolId)}
            >
              {schools?.map((school) => (
                <SelectItem key={school.id} textValue={school.name}>
                  {school.name}
                </SelectItem>
              ))}
            </Select>

            {assignmentFields.map((assignment) => {
              return <SchoolItem key={assignment.id} />;
            })}
          </Form>
        </FormProvider>
      </FormWrapper>
    </PageWrapper>
  );
}
