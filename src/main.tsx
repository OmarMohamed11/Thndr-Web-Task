import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import "./index.css";
import App from "./App";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,
            refetchOnWindowFocus: false,
            retry: false,
            gcTime: 1000 * 60 * 60 * 24,
        },
    },
});

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

const asyncStoragePersister = createAsyncStoragePersister({
    storage: window.localStorage,
    key: "thndr-stocks-app",
});

createRoot(rootElement).render(
    <StrictMode>
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{ persister: asyncStoragePersister }}
        >
            <App />
            <ReactQueryDevtools initialIsOpen={false} />
        </PersistQueryClientProvider>
    </StrictMode>
);
