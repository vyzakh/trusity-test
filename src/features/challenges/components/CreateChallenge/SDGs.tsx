import { useQuery } from "@apollo/client";
import { Checkbox, CheckboxGroup } from "@heroui/checkbox";
import { Skeleton } from "@heroui/skeleton";
import { Controller, useFormContext } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import type { CreateChallengeSchemaType } from "../../schemas/createChallengeSchema";
import { SDGS_QUERY } from "../../services/challengeQueries";
import type { SDGsQueryResponse } from "../../services/types";

export default function SDGs() {
  const { data, loading: isLoadingSDGs } =
    useQuery<SDGsQueryResponse>(SDGS_QUERY);

  const sdgs = data?.sdgs ?? [];

  const {
    control,
    formState: { errors },
  } = useFormContext<CreateChallengeSchemaType>();

  const isInvalid = errors?.sdgIds && errors?.sdgIds?.message;

  return (
    <div className="my-4 w-full space-y-2">
      <p className="required mb-2">UN SDG Goals</p>
      <Controller
        name="sdgIds"
        control={control}
        render={({ field }) => (
          <CheckboxGroup
            color="primary"
            label={`Choose Goals (${sdgs.length})`}
            value={field.value}
            onValueChange={(val) => field.onChange(val)}
            classNames={{ label: "text-sm font-medium text-black mb-3" }}
          >
            <div
              className={twMerge(
                "grid grid-cols-2 gap-3 p-2",
                isInvalid && "border-danger rounded-lg border border-dashed",
              )}
            >
              {isLoadingSDGs
                ? Array.from({ length: 17 }).map((_, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Skeleton className="w-5 rounded-sm">
                        <div className="h-5" />
                      </Skeleton>
                      <Skeleton className="w-36 rounded-sm">
                        <div className="h-5" />
                      </Skeleton>
                    </div>
                  ))
                : sdgs.map((sdg) => {
                    return (
                      <Checkbox
                        key={sdg.id}
                        value={sdg.id.toString()}
                        classNames={{ label: "text-sm" }}
                      >
                        {sdg.title}
                      </Checkbox>
                    );
                  })}
            </div>
          </CheckboxGroup>
        )}
      />
      {isInvalid && (
        <small className="text-tiny text-danger">
          {errors?.sdgIds?.message}
        </small>
      )}
    </div>
  );
}
