import { useMutation } from "@apollo/client";
import { Card } from "@heroui/card";
import { Image } from "@heroui/image";
import { addToast } from "@heroui/toast";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import axios from "axios";
import clsx from "clsx";
import React from "react";
import { twMerge } from "tailwind-merge";

import { Button, Input } from "@/components/ui";
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
  onUploadComplete?: (url?: string) => void;
  file: string;
  allowedFormats?: string[];
  maxSizeInBytes?: number;
  onDelete: () => void;
  helperText?: string;
}

export default function Upload({
  label = "file-upload",
  onUploadComplete,
  allowedFormats = [],
  maxSizeInBytes = 10 * 1024 * 1024, // 10MB default
  fileType,
  file,
  helperText,
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
      addToast({ title: validationError, color: "danger" });
      // setError(validationError);
      setIsUploading(false);

      return;
    }

    const result = await uploadSingleFile(file);

    onUploadComplete?.(result.presignedResponse?.fileUrl);

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
              {file !== "" ? (
                <Image className="me-3 size-14 object-contain" src={file} />
              ) : (
                <p className="max-w-48 truncate text-sm">
                  Please choose an image
                </p>
              )}

              <VisuallyHidden>
                <Input
                  {...props}
                  disabled={isUploading}
                  id={label?.toString()}
                  // multiple={!!props.multiple}
                  name={label?.toString()}
                  type="file"
                  accept={allowedFormats.join(", ")}
                  onChange={handleUploadFile}
                />
              </VisuallyHidden>
              <label htmlFor={label?.toString()}>
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
            <p className="text-center text-xs text-zinc-400">{helperText}</p>
          </div>
        </Card>
        {props?.isInvalid && props?.errorMessage && (
          <small className="text-tiny text-danger">
            {props?.errorMessage.toString()}
          </small>
        )}
      </div>
    </div>
  );
}
