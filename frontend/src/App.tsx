import { CssBaseline, ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import positivusTheme from "./config/theme";

import { AnalyticsContainer } from "./features/analytics/components/AnalyticsContainer";
import { ArchiveView } from "./features/analytics/components/ArchiveView";
import { CreditLogsGrid } from "./features/credits/components/CreditLogsGrid";
import { CategorySettingsPage } from "./features/settings/CategorySettingsPage";
import { SettingsPage } from "./features/settings/SettingsPage";
import { DailyTransactionsGrid } from "./features/transactions/components/DailyTransactionsGrid";

import { Toaster } from "react-hot-toast";
import { COLORS } from "./config/constants";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={positivusTheme}>
        <CssBaseline />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              fontSize: "16px",
              padding: "16px 24px",
              maxWidth: "500px",
            },
            success: {
              style: {
                borderBottom: `4px solid ${COLORS.SUCCESS}`,
              },
            },
            error: {
              style: {
                borderBottom: `4px solid ${COLORS.ERROR}`,
              },
            },
          }}
        />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<DailyTransactionsGrid />} />
              <Route path="credit" element={<CreditLogsGrid />} />
              <Route path="analytics" element={<AnalyticsContainer />} />
              <Route path="archive" element={<ArchiveView />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route
                path="settings/categories"
                element={<CategorySettingsPage />}
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
