import { reactRouter } from "@react-router/dev/vite";
import {
    sentryReactRouter,
    type SentryReactRouterBuildOptions,
} from "@sentry/react-router";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const sentryConfig: SentryReactRouterBuildOptions = {
    org: "test-tob",
    project: "javascript-react",
    // An auth token is required for uploading source maps.
    authToken:
        "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",
    // ...
};

export default defineConfig((config) => {
    return {
        plugins: [
            tailwindcss(),
            tsconfigPaths(),
            reactRouter(),
            sentryReactRouter(sentryConfig, config),
        ],
        sentryConfig,
        ssr: {
            noExternal: [/@syncfusion/],
        },
    };
});
