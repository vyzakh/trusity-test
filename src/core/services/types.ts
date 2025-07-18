export type UploadFileResponse = {
  uploadFile: {
    file: {
      uploadUrl: string;
      maxFileSize: number;
      fileUrl: string;
      expiresIn: string;
      allowedFormats: string;
    };
    message: string;
    statusCode: number;
    success: boolean;
  };
};

export type UploadFilePayload = {
  fileName: string;
  fileType: string;
  mimeType: string;
};

export type FileType = "USER_AVATAR" | "SCHOOL_LOGO";

export type MutationResponse<
  T extends string,
  Payload = Record<string, unknown>,
> = {
  [K in T]: {
    message: string;
  } & Payload;
};

export type PaginationInput = {
  limit?: number;
  offset?: number;
};

export type BusinessType = "B2B" | "B2C";
