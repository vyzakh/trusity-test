import "@/styles/globals.css";
import { ApolloProvider } from "@apollo/client";
import { NuqsAdapter } from "nuqs/adapters/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";

import App from "./App.tsx";
import { client } from "./core/lib/apollo/client.ts";
import { store } from "./core/lib/redux/store.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <ApolloProvider client={client}>
        <NuqsAdapter>
          <App />
        </NuqsAdapter>
      </ApolloProvider>
    </ReduxProvider>
  </React.StrictMode>,
);
