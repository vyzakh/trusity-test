import {
  ApolloClient,
  createHttpLink,
  from,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";

// import { showSessionExpiryModal } from '../redux/features/authSlice';

import { APP_CONFIG } from "@/config/appConfig";

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      if (err.extensions?.code === "UNAUTHENTICATED") {
        // store.dispatch(showSessionExpiryModal());
      }
    }
  }

  if (
    networkError &&
    "statusCode" in networkError &&
    networkError.statusCode === 401
  ) {
    // store.dispatch(showSessionExpiryModal());
  }
});

const httpLink = createHttpLink({
  uri: APP_CONFIG.GRAPHQL_BASE_URL,
  // credentials: "include",
});

const authLink = setContext((_, { headers }) => {
  // const state = store.getState();
  // const accessToken = state.auth?.accessToken;

  return {
    headers: {
      ...headers,
      "Content-Type": "application/json",
      // ...(accessToken && { "x-auth-token": accessToken }),
    },
  };
});

export const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});
