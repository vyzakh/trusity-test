import { FormWrapper, PageWrapper } from "@/components";
import {
  BreadcrumbNav,
  Button,
  Input,
  Select,
  Textarea,
  Upload,
} from "@/components/ui";
import { handleApolloError } from "@/core/errors";
import { useMutation, useQuery } from "@apollo/client";
import { Form } from "@heroui/form";
import { SelectItem } from "@heroui/select";
import { addToast } from "@heroui/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { SDGs } from "../components/CreateChallenge";
import {
  CreateChallengeSchema,
  type CreateChallengeSchemaType,
} from "../schemas/createChallengeSchema";
import { CREATE_CHALLENGE_MUTATION } from "../services/challengeMutations";
import {
  CHALLENGE_SECTORS_QUERY,
  CHALLENGES_QUERY,
} from "../services/challengeQueries";
import type {
  ChallengeSectorsQueryResponse,
  CreateChallengePayload,
  CreateChallengeResponse,
} from "../services/types";

export default function AddChallenge() {
  const navigate = useNavigate();

  //FETCH CHALLENGE SECTORS
  const { data: sectors, loading: isLoadingSectors } =
    useQuery<ChallengeSectorsQueryResponse>(CHALLENGE_SECTORS_QUERY);

  //CREATE CHALLENGE MUTATION
  const [createChallenge, { loading: isCreatingChallenge }] = useMutation<
    CreateChallengeResponse,
    { input: CreateChallengePayload }
  >(CREATE_CHALLENGE_MUTATION, {
    refetchQueries: [{ query: CHALLENGES_QUERY }],
  });

  //RHF CONFIGURATION
  const methods = useForm<CreateChallengeSchemaType>({
    resolver: zodResolver(CreateChallengeSchema),
    defaultValues: {
      companyName: "",
      description: "",
      expectation: "",
      logoUrl: "",
      sectorId: "",
      sdgIds: [],
      title: "",
    },
    mode: "onChange",
  });

  //ALL CHALLENGE SECTORS
  const challengeSectors = sectors?.challengeSectors ?? [];

  //CREATE CHALLENGE HANDLER
  const handleCreateChallenge = async (data: CreateChallengeSchemaType) => {
    const sdgIds = data?.sdgIds?.map(Number);
    try {
      const response = await createChallenge({
        variables: {
          input: { ...data, sdgIds, sectorId: Number(data.sectorId) },
        },
      });
      addToast({
        color: "success",
        title: response.data?.createChallenge.message,
      });
      navigate("..");
    } catch (error) {
      const errMsg = handleApolloError(error);
      addToast({ color: "danger", title: errMsg });
    }
  };

  //CANCEL HANDLER
  const handleCancel = () => {
    methods.reset();
    navigate("..");
  };

  return (
    <PageWrapper
      slots={{
        title: "Add Challenge",
        breadcrumb: (
          <BreadcrumbNav
            items={[
              { label: "Challenges", to: ".." },
              { label: "Add Challenge" },
            ]}
          />
        ),
      }}
    >
      <FormWrapper>
        <FormProvider {...methods}>
          <Form
            onSubmit={methods.handleSubmit(handleCreateChallenge)}
            validationBehavior="aria"
            className="flex flex-col gap-4"
          >
            <Controller
              name="title"
              control={methods.control}
              render={({ field, fieldState: { error, invalid } }) => (
                <Input
                  {...field}
                  isRequired
                  errorMessage={error?.message}
                  isInvalid={invalid}
                  label="Challenge Title"
                />
              )}
            />
            <Controller
              name="companyName"
              control={methods.control}
              render={({ field, fieldState: { error, invalid } }) => (
                <Input
                  {...field}
                  isRequired
                  errorMessage={error?.message}
                  isInvalid={invalid}
                  label="Company Name"
                />
              )}
            />
            <Controller
              name="sectorId"
              control={methods.control}
              render={({ field, fieldState: { error, invalid } }) => (
                <Select
                  {...field}
                  isRequired
                  errorMessage={error?.message}
                  isInvalid={invalid}
                  isLoading={isLoadingSectors}
                  label="Sector"
                  variant="bordered"
                  selectedKeys={[field.value]}
                >
                  {challengeSectors?.map((challenge) => (
                    <SelectItem key={challenge.id} textValue={challenge.name}>
                      {challenge.name}
                    </SelectItem>
                  ))}
                </Select>
              )}
            />
            <Controller
              name="description"
              control={methods.control}
              render={({ field, fieldState: { error, invalid } }) => (
                <Textarea
                  {...field}
                  isRequired
                  errorMessage={error?.message}
                  isInvalid={invalid}
                  label="Description"
                />
              )}
            />

            {/* SDGS */}
            <SDGs />

            <Controller
              name="expectation"
              control={methods.control}
              render={({ field, fieldState: { invalid, error } }) => (
                <Textarea
                  {...field}
                  isRequired
                  errorMessage={error?.message}
                  isInvalid={invalid}
                  label="Expectation"
                />
              )}
            />

            <Controller
              control={methods.control}
              name="logoUrl"
              render={({ field, fieldState: { invalid, error } }) => (
                <Upload
                  helperText="Supported formats: PNG, JPEG, JPG"
                  isRequired
                  allowedFormats={["image/png", "image/jpeg", "image/jpg"]}
                  errorMessage={error?.message}
                  file={field.value}
                  fileType="SCHOOL_LOGO"
                  isInvalid={invalid}
                  label="Logo"
                  onDelete={() => field.onChange("")}
                  onUploadComplete={(data) => field.onChange(data)}
                />
              )}
            />
            <div className="mt-3 flex w-full items-center justify-end gap-2">
              <Button
                color="default"
                disabled={isCreatingChallenge}
                variant="flat"
                onPress={handleCancel}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                isLoading={isCreatingChallenge}
                type="submit"
              >
                Save
              </Button>
            </div>
          </Form>
        </FormProvider>
      </FormWrapper>
    </PageWrapper>
  );
}
