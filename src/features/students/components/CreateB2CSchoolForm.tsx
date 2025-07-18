import { Autocomplete, Button, Input } from "@/components/ui";
import {
  CreateB2CSchoolSchema,
  type CreateB2CSchoolSchemaType,
} from "@/features/school/pages/schools/schemas/createB2CSchoolSchema";
import {
  CITIES_QUERY,
  COUNTRIES_QUERY,
  STATES_QUERY,
} from "@/features/school/pages/schools/services/schoolQueries";
import type {
  CityListResponse,
  CountryListResponse,
  StateListResponse,
} from "@/features/school/pages/schools/services/types";
import { useQuery } from "@apollo/client";
import { AutocompleteItem } from "@heroui/autocomplete";
import { Form } from "@heroui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";

type CreateB2CSchoolFormProps = {
  isCreatingSchool: boolean;
  handleCreateSchool: (data: CreateB2CSchoolSchemaType) => void;
  handleCancel: () => void;
};

export default function CreateB2CSchoolForm({
  handleCancel,
  handleCreateSchool,
  isCreatingSchool,
}: CreateB2CSchoolFormProps) {
  const { control, handleSubmit, setValue } =
    useForm<CreateB2CSchoolSchemaType>({
      resolver: zodResolver(CreateB2CSchoolSchema),
      defaultValues: {
        name: "",
        address: {
          countryId: "",
          stateId: "",
          cityId: "",
          postalCode: "",
          streetAddressLine1: "",
          streetAddressLine2: "",
        },
      },
    });

  const selectedCountryId = useWatch({ control, name: "address.countryId" });
  const selectedStateId = useWatch({ control, name: "address.stateId" });

  const { data: countries = { countries: [] }, loading: loadingCountries } =
    useQuery<CountryListResponse>(COUNTRIES_QUERY);

  const { data: states = { states: [] }, loading: loadingStates } = useQuery<
    StateListResponse,
    { countryId: string }
  >(STATES_QUERY, {
    variables: { countryId: selectedCountryId },
    skip: !selectedCountryId,
  });

  const { data: cities = { cities: [] }, loading: loadingCities } = useQuery<
    CityListResponse,
    { stateId: string }
  >(CITIES_QUERY, {
    variables: { stateId: selectedStateId },
    skip: !selectedStateId,
  });

  const handleSubmitForm = (data: CreateB2CSchoolSchemaType) =>
    handleCreateSchool(data);
  return (
    <Form
      className="flex flex-col gap-4"
      validationBehavior="aria"
      onSubmit={handleSubmit(handleSubmitForm)}
    >
      <Controller
        control={control}
        name="name"
        render={({ field, fieldState: { error, invalid } }) => (
          <Input
            {...field}
            isRequired
            errorMessage={error?.message}
            isInvalid={invalid}
            label="School name"
            labelPlacement="outside-top"
            variant="bordered"
          />
        )}
      />
      <Controller
        control={control}
        name="address.countryId"
        render={({ field, fieldState: { invalid, error } }) => (
          <Autocomplete
            isRequired
            errorMessage={error?.message}
            inputProps={{
              classNames: {
                inputWrapper: "border-small",
              },
            }}
            isInvalid={invalid}
            isLoading={loadingCountries}
            label="Country"
            labelPlacement="outside"
            name={field.name}
            placeholder="Select"
            selectedKey={field.value}
            variant="bordered"
            onBlur={field.onBlur}
            onSelectionChange={(e) => {
              field.onChange(e);
              setValue("address.stateId", "");
              setValue("address.cityId", "");
            }}
          >
            {countries?.countries?.map((country) => {
              return (
                <AutocompleteItem key={country.id} textValue={country.name}>
                  <div className="flex items-center gap-2">
                    <div className="shrink-0 text-2xl">{country.emoji}</div>
                    <span className="text-small">{country.name}</span>
                  </div>
                </AutocompleteItem>
              );
            })}
          </Autocomplete>
        )}
      />

      <Controller
        control={control}
        name="address.streetAddressLine1"
        render={({ field, fieldState: { invalid, error } }) => (
          <Input
            {...field}
            isRequired
            errorMessage={error?.message}
            isInvalid={invalid}
            label="Street Address Line 1"
            labelPlacement="outside"
            placeholder="Street"
            variant="bordered"
          />
        )}
      />
      <Controller
        control={control}
        name="address.streetAddressLine2"
        render={({ field, fieldState: { invalid, error } }) => (
          <Input
            {...field}
            errorMessage={error?.message}
            isInvalid={invalid}
            label="Street Address Line 2"
            labelPlacement="outside-top"
            placeholder="Street"
            variant="bordered"
          />
        )}
      />

      <div className="grid w-full place-items-start gap-x-2 gap-y-4 lg:grid-cols-2">
        <Controller
          control={control}
          name="address.stateId"
          render={({ field, fieldState: { invalid, error } }) => (
            <Autocomplete
              isRequired
              errorMessage={error?.message}
              inputProps={{
                classNames: {
                  inputWrapper: "border-small",
                },
              }}
              isInvalid={invalid}
              isLoading={loadingStates}
              label="State"
              labelPlacement="outside"
              name={field.name}
              placeholder="Select"
              selectedKey={field.value}
              variant="bordered"
              onBlur={field.onBlur}
              onSelectionChange={(e) => {
                field.onChange(e);
                setValue("address.cityId", "");
              }}
            >
              {states?.states?.map((state) => (
                <AutocompleteItem key={state.id} textValue={state.name}>
                  {state.name}
                </AutocompleteItem>
              ))}
            </Autocomplete>
          )}
        />
        <Controller
          control={control}
          name="address.cityId"
          render={({ field, fieldState: { invalid, error } }) => (
            <Autocomplete
              isRequired
              errorMessage={error?.message}
              inputProps={{
                classNames: {
                  inputWrapper: "border-small",
                },
              }}
              isInvalid={invalid}
              isLoading={loadingCities}
              label="City"
              labelPlacement="outside"
              name={field.name}
              placeholder="Select"
              selectedKey={field.value}
              variant="bordered"
              onBlur={field.onBlur}
              onSelectionChange={(e) => field.onChange(e)}
            >
              {cities?.cities?.map((city) => (
                <AutocompleteItem key={city.id} textValue={city.name}>
                  {city.name}
                </AutocompleteItem>
              ))}
            </Autocomplete>
          )}
        />
        <Controller
          control={control}
          name="address.postalCode"
          render={({ field, fieldState: { invalid, error } }) => (
            <Input
              {...field}
              isRequired
              errorMessage={error?.message}
              isInvalid={invalid}
              label="Postal code"
              labelPlacement="outside"
              placeholder=" "
              variant="bordered"
              className="col-span-2"
              onKeyDown={(e) => {
                const allowed = [
                  "Backspace",
                  "ArrowLeft",
                  "ArrowRight",
                  "Tab",
                  "Delete",
                ];

                const isAlphaNumeric = /^[a-zA-Z0-9]$/.test(e.key);

                if (!isAlphaNumeric && !allowed.includes(e.key)) {
                  e.preventDefault();
                }
              }}
            />
          )}
        />
      </div>
      <div className="flex w-full items-center justify-end gap-2">
        <Button
          className="h-9"
          color="default"
          disabled={isCreatingSchool}
          variant="flat"
          onPress={handleCancel}
        >
          Cancel
        </Button>
        <Button
          className="h-9"
          color="primary"
          isLoading={isCreatingSchool}
          type="submit"
        >
          Save
        </Button>
      </div>
    </Form>
  );
}
