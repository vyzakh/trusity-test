import { ApolloError } from "@apollo/client";

export function handleApolloError(error: unknown): string {
  if (error instanceof ApolloError) {
    if (error.graphQLErrors.length > 0) {
      return error.graphQLErrors[0].message;
    }
    if (error.networkError) {
      return error.networkError.message;
    }

    return "An unexpected GraphQL error occurred.";
  } else {
    // console.error("Unexpected Error:", error);

    return "An unexpected error occurred.";
  }
}
