"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, HelpCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/src/app/Hooks/hook";
import {
  setStatus as setEpdsStatus,
  setScore as setEpdsScore,
  setAnswers as setEpdsAnswers,
  setEpdsResult,
} from "@/src/app/redux/feature/screening/epds/epdsSlice";
import {
  setSymptomsResult,
  setSymptomsStatus,
} from "@/src/app/redux/feature/screening/symptoms/symptomsSlice";
import {
  setHybridResult,
  setHybridStatus,
} from "@/src/app/redux/feature/screening/hybrid/hybridSlice";
import {
  useLazyGetEpdsScreeningHistoryByIdQuery,
  useLazyGetSymptomsScreeningHistoryByIdQuery,
  useLazyGetHybridScreeningHistoryByIdQuery,
} from "@/src/app/redux/services/userDashboardApi";
import { useRecommendCrisisResourcesMutation } from "@/src/app/redux/services/crisisResourceApi";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type PPDRiskAnalysis = {
  id: string;
  screeningType: string;
  date: string;
  risk: string;
  prediction: string;
  action: string;
  created_at?: string;
  method?: string;
  raw?: any;
};

export const columns: ColumnDef<PPDRiskAnalysis>[] = [
  {
    accessorKey: "screeningType",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent -ml-4 font-semibold text-slate-600"
        >
          Screening Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <span className="font-medium text-slate-700">
        {row.getValue("screeningType")}
      </span>
    ),
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent -ml-4 font-semibold text-slate-600"
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    sortingFn: (rowA, rowB) => {
      const dateA = new Date(
        rowA.original.created_at || rowA.original.date,
      ).getTime();
      const dateB = new Date(
        rowB.original.created_at || rowB.original.date,
      ).getTime();
      return dateA - dateB;
    },
  },
  {
    accessorKey: "prediction",
    header: "Risk Level",
    cell: ({ row }) => {
      const risk = (row.getValue("prediction") as string) || "";
      const lowerRisk = risk.toUpperCase();
      return (
        <Badge
          className={cn(
            "px-3 py-1 rounded-full text-xs font-bold border-none shadow-sm",
            lowerRisk === "CRITICAL" &&
              "bg-red-200 text-red-800 hover:bg-red-300",
            lowerRisk === "HIGH" &&
              "bg-rose-100 text-rose-700 hover:bg-rose-200",
            lowerRisk === "LOW" &&
              "bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
            lowerRisk === "MODERATE" &&
              "bg-amber-100 text-amber-700 hover:bg-amber-200",
          )}
        >
          {lowerRisk}
        </Badge>
      );
    },
  },
  // {
  // accessorKey: "prediction",
  // header: "Prediction",
  // cell: ({ row }) => (
  //   <span className="text-slate-600">{row.getValue("prediction")}</span>
  // ),
  // },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => <ViewDetailsCell row={row} />,
  },
];

function ViewDetailsCell({ row }: { row: any }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { method, raw, action } = row.original;
  const [isLoading, setIsLoading] = useState(false);

  // Lazy queries and mutations
  const [getEpdsById] = useLazyGetEpdsScreeningHistoryByIdQuery();
  const [getSymptomsById] = useLazyGetSymptomsScreeningHistoryByIdQuery();
  const [getHybridById] = useLazyGetHybridScreeningHistoryByIdQuery();
  const [recommendCrisis] = useRecommendCrisisResourcesMutation();

  const handleViewDetails = async () => {
    // Determine if we have a real database ID
    const resultId = raw?._id || raw?.id;
    const isSyntheticId =
      !resultId ||
      resultId.startsWith("epds-") ||
      resultId.startsWith("symptoms-") ||
      resultId.startsWith("hybrid-");

    setIsLoading(true);
    try {
      if (method === "epds") {
        let finalData = { ...raw };
        if (!isSyntheticId) {
          try {
            const response = await getEpdsById(resultId).unwrap();
            finalData = response?.data || response;
          } catch (err) {
            console.warn("EPDS detail fetch failed, using history data", err);
          }
        }

        // Proactively fetch crisis resources if missing
        const hasCrisisRes =
          finalData.crisis_resources && finalData.crisis_resources.length > 0;
        if (!hasCrisisRes) {
          try {
            // Use the normalized risk from the row itself to ensure a valid enum value
            const normalizedRisk = (row.original.risk || "Low").toLowerCase();
            const city = finalData.answers?.city || "Kathmandu";
            const crisisRes = await recommendCrisis({
              risk_level: normalizedRisk,
              city,
            }).unwrap();
            finalData = { ...finalData, crisis_resources: crisisRes };
          } catch (e) {
            console.warn("Failed to fetch crisis resources proactively", e);
          }
        }

        dispatch(setEpdsResult(finalData));
        dispatch(setEpdsStatus("succeeded"));
        localStorage.setItem("screeningResult", JSON.stringify(finalData));
        router.push("/screening/epds-assessment-results");
      } else if (method === "symptoms") {
        let finalData = { ...raw };
        if (!isSyntheticId) {
          try {
            const response = await getSymptomsById(resultId).unwrap();
            finalData = response?.data || response;
          } catch (err) {
            console.warn(
              "Symptoms detail fetch failed, using history data",
              err,
            );
          }
        }

        // Proactively fetch crisis resources if missing
        const hasCrisisRes =
          finalData.crisis_resources && finalData.crisis_resources.length > 0;
        if (!hasCrisisRes) {
          try {
            // Use the normalized risk from the row itself
            const normalizedRisk = (row.original.risk || "Low").toLowerCase();
            const city = finalData.answers?.city || "Kathmandu";
            const crisisRes = await recommendCrisis({
              risk_level: normalizedRisk,
              city,
            }).unwrap();
            finalData = { ...finalData, crisis_resources: crisisRes };
          } catch (e) {
            console.warn("Failed to fetch crisis resources proactively", e);
          }
        }

        dispatch(setSymptomsResult(finalData));
        dispatch(setSymptomsStatus("succeeded"));
        localStorage.setItem(
          "symptoms_screening_result",
          JSON.stringify(finalData),
        );
        router.push("/screening/symptoms-assessment-result");
      } else if (method === "hybrid") {
        let finalData = { ...raw };
        if (!isSyntheticId) {
          try {
            const response = await getHybridById(resultId).unwrap();
            finalData = response?.data || response;
          } catch (err) {
            console.warn("Hybrid detail fetch failed, using history data", err);
          }
        }

        // Proactively fetch crisis resources if missing
        const hasCrisisRes =
          finalData.crisis_resources && finalData.crisis_resources.length > 0;
        if (!hasCrisisRes) {
          try {
            // Use the normalized risk from the row itself
            const normalizedRisk = (row.original.risk || "Low").toLowerCase();
            const city =
              (finalData as any).symptomsAnswers?.city || "Kathmandu";
            const crisisRes = await recommendCrisis({
              risk_level: normalizedRisk,
              city,
            }).unwrap();
            finalData = { ...finalData, crisis_resources: crisisRes };
          } catch (e) {
            console.warn("Failed to fetch crisis resources proactively", e);
          }
        }

        dispatch(setHybridResult(finalData));
        dispatch(setHybridStatus("succeeded"));
        localStorage.setItem(
          "hybrid_screening_result",
          JSON.stringify(finalData),
        );
        router.push("/screening/hybrid-assessment-results");
      }
    } catch (err) {
      console.error(`Critical error in ${method} view details:`, err);
      toast.error(`Could not load screening details.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="secondary"
      size="sm"
      className="h-8 bg-slate-100 text-slate-600 hover:bg-slate-200 font-medium min-w-[100px]"
      onClick={handleViewDetails}
      disabled={isLoading}
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : action}
    </Button>
  );
}
