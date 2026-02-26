import { ThemeProvider, CssBaseline } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import positivusTheme from "./config/theme";
import { AppLayout } from "./components/layout/AppLayout";

import { DailyTransactionsGrid } from "./features/transactions/components/DailyTransactionsGrid";
import { AnalyticsContainer } from "./features/analytics/components/AnalyticsContainer";
import { ArchiveView } from "./features/analytics/components/ArchiveView";
import { SettingsPage } from "./features/settings/SettingsPage";
import { CategorySettingsPage } from "./features/settings/CategorySettingsPage";

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
              <Route index element={<DailyTransactionsGrid type="normal" />} />
              <Route
                path="credit"
                element={<DailyTransactionsGrid type="credit" />}
              />
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
