import { ThemeProvider, CssBaseline } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import positivusTheme from "./config/theme";
import { AppLayout } from "./components/layout/AppLayout";

import { DailyTransactionsGrid } from "./features/transactions/components/DailyTransactionsGrid";
import { AnalyticsContainer } from "./features/analytics/components/AnalyticsContainer";
import { ArchiveView } from "./features/analytics/components/ArchiveView";

import { Toaster } from "react-hot-toast";

// Temporary placeholder components for routes
const Dashboard = () => <DailyTransactionsGrid />;

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
        <Toaster position="top-right" />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="analytics" element={<AnalyticsContainer />} />
              <Route path="archive" element={<ArchiveView />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
