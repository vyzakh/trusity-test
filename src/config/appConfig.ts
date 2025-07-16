import packageJson from "../../package.json";

export const APP_CONFIG = {
  APP_NAME: import.meta.env.VITE_APP_NAME,
  APP_VERSION: packageJson.version,
  GRAPHQL_BASE_URL: import.meta.env.VITE_GRAPHQL_BASE_URL,
  WS_URL: import.meta.env.VITE_WS_URL,
  TENANT_ID: import.meta.env.VITE_TENANT_ID,
};
