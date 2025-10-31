import { ReactNode } from "react";
import { AppProviders } from "@/providers/AppProviders";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

const App = ({ children }: { children: ReactNode }) => {
  return (
    <ErrorBoundary>
      <AppProviders>{children}</AppProviders>
    </ErrorBoundary>
  );
};

export default App;
