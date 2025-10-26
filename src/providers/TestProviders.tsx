import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProviders } from "@/providers";

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

interface AllTheProvidersProps {
  children: React.ReactNode;
}

export const AllTheProviders = ({ children }: AllTheProvidersProps) => {
  const testQueryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={testQueryClient}>
      <AppProviders>{children}</AppProviders>
    </QueryClientProvider>
  );
};
