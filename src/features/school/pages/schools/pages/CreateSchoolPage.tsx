import { useMutation } from "@apollo/client";
import { Form } from "@heroui/form";
import { addToast } from "@heroui/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router";

import { Address, BasicInfo, PointOfContact } from "../components";
import {
  CreateSchoolSchema,
  type CreateSchoolSchemaType,
} from "../schemas/createSchoolSchema";
import { CREATE_SCHOOL_MUTATION } from "../services/schoolMutations";
import { DEFAULT_VALUES } from "../utils/constants";

import { FormWrapper, PageWrapper } from "@/components";
import { BreadcrumbNav, Button } from "@/components/ui";
import { handleApolloError } from "@/core/errors";
import {
  SCHOOL_NAMES_QUERY,
  SCHOOLS_QUERY,
  TOTAL_SCHOOLS_QUERY,
} from "../services/schoolQueries";
import type {
  CreateB2BSchoolPayload,
  CreateSchoolResponse,
} from "../services/types";

export default function CreateSchoolPage() {
  const navigate = useNavigate();

  //CREATE SCHOOL MUTATION
  const [createSchool, { loading: isCreating }] = useMutation<
    CreateSchoolResponse,
    { input: CreateB2BSchoolPayload }
  >(CREATE_SCHOOL_MUTATION, {
    refetchQueries: [
      { query: SCHOOLS_QUERY, variables: { limit: 10, offset: 0 } },
      { query: TOTAL_SCHOOLS_QUERY },
      { query: SCHOOL_NAMES_QUERY },
    ],
  });

  //RHF CONFIG
  const methods = useForm<CreateSchoolSchemaType>({
    mode: "onChange",
    resolver: zodResolver(CreateSchoolSchema),
    defaultValues: DEFAULT_VALUES,
  });

  //SCHOOL CREATE HANDLER
  const handleCreateSchool = async (data: CreateSchoolSchemaType) => {
    const { logo, curriculums, customCurriculum, ...rest } = data;

    const formattedCurriculums = curriculums?.map((c) => {
      if (c.allowCustom) {
        return { id: c.id, name: customCurriculum || "" };
      }

      return { id: c.id, name: null };
    });

    try {
      const response = await createSchool({
        variables: {
          input: {
            ...rest,
            curriculums: formattedCurriculums,
            logoUrl: logo,
            accountType: "B2B",
          },
        },
      });

      addToast({
        title: response.data?.createSchool.message,
        color: "success",
      });
      handleCancel();
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
    navigate("..");
  };

  return (
    <PageWrapper
      slots={{
        breadcrumb: (
          <BreadcrumbNav
            items={[{ label: "Schools", to: ".." }, { label: "Add School" }]}
          />
        ),
        title: "Add School",
      }}
    >
      <FormWrapper>
        <FormProvider {...methods}>
          <Form
            className="flex flex-col gap-5"
            validationBehavior="aria"
            onSubmit={methods.handleSubmit(handleCreateSchool)}
          >
            <BasicInfo />
            <Address />
            <PointOfContact />
            <div className="flex w-full items-center justify-end gap-2">
              <Button
                color="default"
                disabled={isCreating}
                variant="flat"
                onPress={handleCancel}
              >
                Cancel
              </Button>
              <Button color="primary" isLoading={isCreating} type="submit">
                Save
              </Button>
            </div>
          </Form>
        </FormProvider>
      </FormWrapper>
    </PageWrapper>
  );
}
