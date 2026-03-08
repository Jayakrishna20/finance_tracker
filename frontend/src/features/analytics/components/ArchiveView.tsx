import React, { useState } from "react";
import { VaultPivotTable } from "./VaultPivotTable";
import { DataSource } from "../../../types";

export const ArchiveView: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [dataSource, setDataSource] = useState<DataSource>(
    DataSource.Transactions,
  );

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="shrink-0">
        <p className="text-gray-500">
          Review your entire historical data categorized by distinct time
          boundaries.
        </p>

        <div className="flex items-center justify-between mt-6 mb-2">
          {/* Data Source Toggle */}
          <div className="flex bg-gray-100/80 p-1 rounded-xl w-fit">
            <button
              onClick={() => setDataSource(DataSource.Transactions)}
              className={`py-1.5 px-5 rounded-lg text-sm font-semibold transition-all ${
                dataSource === DataSource.Transactions
                  ? "bg-secondary-main text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"
              }`}
            >
              Transactions
            </button>
            <button
              onClick={() => setDataSource(DataSource.Credits)}
              className={`py-1.5 px-5 rounded-lg text-sm font-semibold transition-all ${
                dataSource === DataSource.Credits
                  ? "bg-secondary-main text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"
              }`}
            >
              Credits
            </button>
          </div>

          {/* Period tabs */}
          <div className="flex bg-gray-100/80 p-1 rounded-xl w-fit">
            <button
              onClick={() => setTabIndex(0)}
              className={`py-2 px-6 min-w-[100px] rounded-lg text-sm font-semibold transition-all ${
                tabIndex === 0
                  ? "bg-white text-gray-900 shadow-sm ring-1 ring-black/5"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setTabIndex(1)}
              className={`py-2 px-6 min-w-[100px] rounded-lg text-sm font-semibold transition-all ${
                tabIndex === 1
                  ? "bg-white text-gray-900 shadow-sm ring-1 ring-black/5"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setTabIndex(2)}
              className={`py-2 px-6 min-w-[100px] rounded-lg text-sm font-semibold transition-all ${
                tabIndex === 2
                  ? "bg-white text-gray-900 shadow-sm ring-1 ring-black/5"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"
              }`}
            >
              Yearly
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm flex-1 min-h-0 overflow-hidden flex flex-col pt-2">
        {tabIndex === 0 && (
          <VaultPivotTable periodType="WEEKLY" dataSource={dataSource} />
        )}
        {tabIndex === 1 && (
          <VaultPivotTable periodType="MONTHLY" dataSource={dataSource} />
        )}
        {tabIndex === 2 && (
          <VaultPivotTable periodType="YEARLY" dataSource={dataSource} />
        )}
      </div>
    </div>
  );
};
