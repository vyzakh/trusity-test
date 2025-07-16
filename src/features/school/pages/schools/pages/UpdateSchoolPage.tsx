import { useApolloClient, useMutation, useQuery } from "@apollo/client";
import { Form } from "@heroui/form";
import { addToast } from "@heroui/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router";

import { Address, BasicInfo, PointOfContact } from "../components";
import {
  CreateSchoolSchema,
  type CreateSchoolSchemaType,
} from "../schemas/createSchoolSchema";
import { UPDATE_SCHOOL_MUTATION } from "../services/schoolMutations";
import { SCHOOL_QUERY } from "../services/schoolQueries";

import { DEFAULT_VALUES } from "../utils/constants";

import { FormWrapper, PageWrapper } from "@/components";
import { title } from "@/components/primitives";
import { BreadcrumbNav, Button } from "@/components/ui";
import { handleApolloError } from "@/core/errors";
import type {
  CreateSchoolPayload,
  SchoolQueryResponse,
  UpdateSchoolResponse,
} from "../services/types";

export default function UpdateSchoolPage() {
  const { schoolId } = useParams<{ schoolId: string }>();
  const navigate = useNavigate();
  const client = useApolloClient();
  const location = useLocation();

  const from = location.state?.from || "/schools";

  const { data: schoolData, loading: isLoadingSchoolData } = useQuery<
    SchoolQueryResponse,
    { schoolId: string }
  >(SCHOOL_QUERY, {
    variables: { schoolId: schoolId! },
    skip: !schoolId,
  });

  //Update SCHOOL MUTATION
  const [updateSchool, { loading: isCreating }] = useMutation<
    UpdateSchoolResponse,
    { input: CreateSchoolPayload; schoolId: string }
  >(UPDATE_SCHOOL_MUTATION, {
    onCompleted: () => {
      client.cache.evict({ fieldName: "schools" });
      client.cache.evict({ fieldName: "school" });
      client.cache.evict({ fieldName: "totalSchools" });
      client.cache.gc();
    },
  });

  //RHF CONFIG
  const methods = useForm<CreateSchoolSchemaType>({
    mode: "onChange",
    resolver: zodResolver(CreateSchoolSchema),
    defaultValues: DEFAULT_VALUES,
  });

  //SCHOOL UPDATE HANDLER
  const handleUpdateSchool = async (data: CreateSchoolSchemaType) => {
    const { logo, curriculums, customCurriculum, totalLicense, ...rest } = data;

    const formattedCurriculums = curriculums?.map((c) => {
      if (c.allowCustom) {
        return { id: c.id, name: customCurriculum || "" };
      }

      return { id: c.id, name: null };
    });

    try {
      const response = await updateSchool({
        variables: {
          input: {
            ...rest,
            curriculums: formattedCurriculums,
            logoUrl: logo,
            totalLicense: parseInt(totalLicense),
            accountType: "B2B",
          },
          schoolId: schoolId!,
        },
      });

      addToast({
        title: response.data?.updateSchool.message,
        color: "success",
      });
      navigate(from);
    } catch (error) {
      const errMsg = handleApolloError(error);

      addToast({
        title: errMsg,
        color: "danger",
      });
    }
  };

  //FORM CANCEL HANDLER
  const handleCancel = () => {
    methods.reset();
  };

  //SETTING DEFAULT VALUES
  React.useEffect(() => {
    if (schoolData) {
      const { address, contact, curriculums, license, logoUrl, name } =
        schoolData.school;

      methods.reset({
        name,
        logo: logoUrl,
        curriculums: curriculums,
        address: {
          stateId: address?.state?.id.toString(),
          cityId: address?.city?.id.toString(),
          contactNumber: address.contactNumber,
          countryId: address.country.id?.toString(),
          postalCode: address.postalCode,
          streetAddressLine1: address.streetAddressLine1,
          streetAddressLine2: address.streetAddressLine2,
        },
        contact,
        customCurriculum:
          curriculums?.find((c) => c.allowCustom)?.otherName || "",
        totalLicense: license.totalLicense.toString(),
      });
    }
  }, [schoolData, methods]);

  return (
    <PageWrapper>
      <BreadcrumbNav
        items={[
          { label: "Schools", to: "../.." },
          {
            label: schoolData?.school?.name,
            isLoading: isLoadingSchoolData,
            to: "..",
          },
          { label: "Update" },
        ]}
      />

      <h1 className={title({ size: "lg" })}>Update School</h1>
      <FormWrapper>
        <FormProvider {...methods}>
          <Form
            className="flex flex-col gap-5"
            validationBehavior="aria"
            onSubmit={methods.handleSubmit(handleUpdateSchool)}
          >
            <BasicInfo />
            <Address />
            <PointOfContact />
            <div className="flex w-full items-center justify-end gap-2">
              <Button
                color="default"
                disabled={isCreating}
                type="reset"
                variant="flat"
                onPress={handleCancel}
              >
                Reset
              </Button>
              <Button color="primary" isLoading={isCreating} type="submit">
                Update
              </Button>
            </div>
          </Form>
        </FormProvider>
      </FormWrapper>
    </PageWrapper>
  );
}
