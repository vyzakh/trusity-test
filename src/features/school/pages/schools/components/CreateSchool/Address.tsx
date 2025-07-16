import { useQuery } from "@apollo/client";
import { AutocompleteItem } from "@heroui/autocomplete";
import { Card } from "@heroui/card";
import { Controller, useFormContext, useWatch } from "react-hook-form";

import {
  CITIES_QUERY,
  COUNTRIES_QUERY,
  STATES_QUERY,
} from "../../services/schoolQueries";
import type {
  CityListResponse,
  CountryListResponse,
  StateListResponse,
} from "../../services/types";

import { Autocomplete, Input, PhoneInput } from "@/components/ui";

export default function Address() {
  const { control, setValue } = useFormContext();

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

  return (
    <Card className="my-4 flex w-full flex-col gap-5 bg-[#F8F8F8] p-5 shadow-none">
      <h5 className="text-md font-bold">Address</h5>
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
            labelPlacement="outside"
            placeholder="Street"
            variant="bordered"
          />
        )}
      />

      <div className="grid w-full place-items-start gap-x-2 gap-y-5 lg:grid-cols-2">
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
        <Controller
          control={control}
          name="address.contactNumber"
          render={({ field, fieldState: { invalid, error } }) => (
            <PhoneInput
              {...field}
              isRequired
              defaultCountry="AE"
              errorMessage={error?.message}
              isInvalid={invalid}
              label="Contact"
            />
          )}
        />
      </div>
    </Card>
  );
}
