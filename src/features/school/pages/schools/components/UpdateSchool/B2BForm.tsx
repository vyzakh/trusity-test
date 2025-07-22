import React from "react";

import { useMutation } from "@apollo/client";
import { Form } from "@heroui/form";
import { addToast } from "@heroui/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router";

import { Address, BasicInfo, PointOfContact } from "../../components";
import {
  CreateSchoolSchema,
  type CreateSchoolSchemaType,
} from "../../schemas/createSchoolSchema";
import { UPDATE_SCHOOL_MUTATION } from "../../services/schoolMutations";
import {
  SCHOOL_NAMES_QUERY,
  SCHOOL_QUERY,
  SCHOOLS_QUERY,
} from "../../services/schoolQueries";

import { DEFAULT_VALUES } from "../../utils/constants";

import { Button } from "@/components/ui";
import { handleApolloError } from "@/core/errors";
import type {
  CreateB2BSchoolPayload,
  SchoolQueryResponse,
  UpdateSchoolResponse,
} from "../../services/types";

type B2BFormProps = {
  schoolData: SchoolQueryResponse["school"];
};

export default function B2BForm({ schoolData }: B2BFormProps) {
  const { schoolId } = useParams<{ schoolId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/schools";

  //Update SCHOOL MUTATION
  const [updateSchool, { loading: isUpdating }] = useMutation<
    UpdateSchoolResponse,
    { input: CreateB2BSchoolPayload; schoolId: string }
  >(UPDATE_SCHOOL_MUTATION, {
    refetchQueries: [
      { query: SCHOOLS_QUERY, variables: { limit: 10, offset: 0 } },
      { query: SCHOOL_QUERY, variables: { schoolId: schoolId! } },
      { query: SCHOOL_NAMES_QUERY },
    ],
  });

  //RHF CONFIG
  const methods = useForm<CreateSchoolSchemaType>({
    mode: "onChange",
    resolver: zodResolver(CreateSchoolSchema),
    defaultValues: DEFAULT_VALUES,
  });

  //SCHOOL UPDATE HANDLER
  const handleUpdateSchool = async (data: CreateSchoolSchemaType) => {
    const { logo, curriculums, customCurriculum, ...rest } = data;

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

  //FORM RESET HANDLER
  const handleReset = React.useCallback(() => {
    if (schoolData) {
      const { address, contact, curriculums, license, logoUrl, name } =
        schoolData;

      methods.reset({
        name,
        logo: logoUrl,
        curriculums: curriculums,
        address: {
          countryId: address.country.id?.toString(),
          stateId: address?.state?.id.toString(),
          cityId: address?.city?.id.toString(),
          contactNumber: address.contactNumber,
          postalCode: address.postalCode,
          streetAddressLine1: address.streetAddressLine1,
          streetAddressLine2: address.streetAddressLine2,
        },
        contact,
        customCurriculum:
          curriculums?.find((c) => c.allowCustom)?.otherName || "",
        totalLicense: license.totalLicense,
      });
    }
  }, [schoolData, methods]);

  //SETTING DEFAULT VALUES
  React.useEffect(() => {
    handleReset();
  }, [handleReset]);

  return (
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
            disabled={isUpdating}
            variant="flat"
            onPress={handleReset}
          >
            Reset
          </Button>
          <Button color="primary" isLoading={isUpdating} type="submit">
            Update
          </Button>
        </div>
      </Form>
    </FormProvider>
  );
}
