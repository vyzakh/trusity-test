import { gql } from "@apollo/client";

export const UPLOAD_MUTATION = gql`
  mutation UploadFile($input: UploadFileInput!) {
    uploadFile(input: $input) {
      file {
        uploadUrl
        maxFileSize
        fileUrl
        expiresIn
        allowedFormats
      }
      message
      statusCode
      success
    }
  }
`;
