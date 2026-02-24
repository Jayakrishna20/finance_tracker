import React, { useState } from "react";
import { Tabs, Tab } from "@mui/material";
import { VaultPivotTable } from "./VaultPivotTable";

export const ArchiveView: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="shrink-0">
        <h2 className="text-2xl font-bold text-secondary-main">
          Vault / Archive
        </h2>
        <p className="text-gray-500">
          Review your entire historical data categorized by distinct time
          boundaries.
        </p>

        <div className="bg-gray-50 rounded-2xl p-2 mb-2 mt-6 inline-block">
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            TabIndicatorProps={{ style: { display: "none" } }}
            sx={{
              minHeight: "40px",
              "& .MuiTab-root": {
                minHeight: "40px",
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 600,
                minWidth: "120px",
                "&.Mui-selected": {
                  backgroundColor: "white",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  color: "#191A23",
                },
              },
            }}>
            <Tab label="Weekly" />
            <Tab label="Monthly" />
            <Tab label="Yearly" />
          </Tabs>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm flex-1 min-h-0 overflow-hidden flex flex-col pt-2">
        {tabIndex === 0 && <VaultPivotTable periodType="WEEKLY" />}
        {tabIndex === 1 && <VaultPivotTable periodType="MONTHLY" />}
        {tabIndex === 2 && <VaultPivotTable periodType="YEARLY" />}
      </div>
    </div>
  );
};
