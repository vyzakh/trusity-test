import { useMutation } from "@apollo/client";
import { Card } from "@heroui/card";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import axios from "axios";
import clsx from "clsx";
import React from "react";
import { twMerge } from "tailwind-merge";

import Button from "./button";
import Input from "./input";

import { handleApolloError } from "@/core/errors";
import { UPLOAD_MUTATION } from "@/core/services/mutations";
import type {
  FileType,
  UploadFilePayload,
  UploadFileResponse,
} from "@/core/services/types";
import type { InputProps } from "@heroui/input";

interface UploadFile {
  file: File;
  progress?: number;
  error?: string;
  presignedResponse?: UploadFileResponse["uploadFile"]["file"];
  s3Response?: unknown;
}

interface UploadProps extends Omit<InputProps, "multiple"> {
  label?: string;
  fileType: FileType;
  onUploadComplete?: (results: { url?: string; name: string }) => void;
  files: { url?: string; name: string };
  allowedFormats?: string[];
  maxSizeInBytes?: number;
  onDelete: () => void;
}

export default function Upload({
  label = "file-upload",
  onUploadComplete,
  allowedFormats = [],
  maxSizeInBytes = 10 * 1024 * 1024, // 10MB default
  fileType,
  files,
  onDelete,
  ...props
}: UploadProps) {
  const [isUploading, setIsUploading] = React.useState(false);
  // const [error, setError] = React.useState("");

  const [uploadFile] = useMutation<
    UploadFileResponse,
    { input: UploadFilePayload }
  >(UPLOAD_MUTATION);

  const validateFile = (file: File): string | null => {
    if (allowedFormats.length && !allowedFormats.includes(file.type)) {
      return `Unsupported format "${file.type}". Allowed: ${allowedFormats.join(", ")}`;
    }

    if (file.size > maxSizeInBytes) {
      return `File size exceeds ${(maxSizeInBytes / (1024 * 1024)).toFixed(1)}MB limit`;
    }

    return null;
  };

  const uploadToS3 = async (
    file: File,
    presignedData: UploadFileResponse["uploadFile"]["file"],
  ) => {
    try {
      await axios.put(presignedData.uploadUrl, file, {
        headers: {
          "Content-Type": file.type || "application/octet-stream",
        },
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `S3 upload failed: ${error.response?.status} ${error.response?.statusText || error.message}`,
        );
      }
      throw error;
    }
  };

  const uploadSingleFile = async (file: File): Promise<UploadFile> => {
    try {
      const { data } = await uploadFile({
        variables: {
          input: {
            fileName: file.name,
            fileType,
            mimeType: file.type,
          },
        },
      });

      const presignedData = data?.uploadFile.file;

      if (!presignedData) throw new Error("Failed to get presigned URL");

      const s3Response = await uploadToS3(file, presignedData);

      return { file, presignedResponse: presignedData, s3Response };
    } catch (err) {
      return {
        file,
        error: err instanceof Error ? err.message : handleApolloError(err),
      };
    }
  };

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // setError("");
    setIsUploading(true);

    const validationError = validateFile(file);

    if (validationError) {
      // setError(validationError);
      setIsUploading(false);

      return;
    }

    const result = await uploadSingleFile(file);

    onUploadComplete?.({
      url: result.presignedResponse?.fileUrl,
      name: file.name,
    });

    e.target.value = "";
    setIsUploading(false);
  };

  return (
    <div className="ms-0.5 flex w-full flex-col gap-2">
      <label
        className={clsx(
          "text-sm",
          props.isRequired && "required",
          props.isInvalid && "text-danger",
        )}
        htmlFor={label?.toString()}
      >
        {label}
      </label>
      <div>
        <Card
          className={twMerge(
            "w-full bg-[#E5ECF680]",
            props.isInvalid && "border-danger border-1 border-dashed",
          )}
          shadow="none"
        >
          <div className="flex flex-col gap-3 p-5">
            <div className="flex items-center justify-center gap-2">
              <p className="max-w-48 truncate text-sm">
                Please choose an image
              </p>

              <label htmlFor={label?.toString()}>
                <VisuallyHidden>
                  <Input
                    {...props}
                    disabled={isUploading}
                    id={label?.toString()}
                    // multiple={!!props.multiple}
                    name={label?.toString()}
                    type="file"
                    onChange={handleUploadFile}
                  />
                </VisuallyHidden>
                <Button
                  as="span"
                  disabled={isUploading}
                  isLoading={isUploading}
                  size="sm"
                >
                  Upload Image
                </Button>
              </label>
            </div>
            <p className="text-center text-xs text-zinc-400">
              Supported formats: PNG, SVG, GPEG{" "}
            </p>
          </div>
        </Card>
        {props?.isInvalid && props?.errorMessage && (
          <small className="text-tiny text-danger">
            {props?.errorMessage.toString()}
          </small>
        )}
      </div>
      {files.name && (
        <div className="text-secondary flex items-center justify-between rounded-lg bg-[#E5ECF680] p-2 px-4 text-sm empty:hidden">
          <p className="grow">{files.name}</p>
          <Button
            isIconOnly
            color="danger"
            radius="full"
            size="sm"
            variant="light"
            onPress={onDelete}
          >
            <svg
              height={24}
              viewBox="0 0 24 24"
              width={24}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m18 9l-.84 8.398c-.127 1.273-.19 1.909-.48 2.39a2.5 2.5 0 0 1-1.075.973C15.098 21 14.46 21 13.18 21h-2.36c-1.279 0-1.918 0-2.425-.24a2.5 2.5 0 0 1-1.076-.973c-.288-.48-.352-1.116-.48-2.389L6 9m7.5 6.5v-5m-3 5v-5m-6-4h4.615m0 0l.386-2.672c.112-.486.516-.828.98-.828h3.038c.464 0 .867.342.98.828l.386 2.672m-5.77 0h5.77m0 0H19.5"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
              />
            </svg>
          </Button>
        </div>
      )}
    </div>
  );
}
