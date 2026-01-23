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
} from "@/src/app/redux/feature/screening/epds/epdsSlice";
import {
  setResult as setSymptomsResult,
  setStatus as setSymptomsStatus,
} from "@/src/app/redux/feature/screening/symptoms/symptomsSlice";
import {
  setHybridResult,
  setHybridStatus,
} from "@/src/app/redux/feature/screening/hybrid/hybridSlice";

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

  const handleViewDetails = () => {
    if (!raw) return;

    if (method === "epds") {
      dispatch(setEpdsScore(raw.score || raw.total_score || 0));
      dispatch(setEpdsAnswers(raw.answers || []));
      dispatch(setEpdsStatus("succeeded"));
      router.push("/screening/epds-assessment-results");
    } else if (method === "symptoms") {
      dispatch(setSymptomsResult(raw));
      dispatch(setSymptomsStatus("succeeded"));
      router.push("/screening/symptoms-assessment-result");
    } else if (method === "hybrid") {
      dispatch(setHybridResult(raw));
      dispatch(setHybridStatus("succeeded"));
      router.push("/screening/hybrid-assessment-results");
    }
  };

  return (
    <Button
      variant="secondary"
      size="sm"
      className="h-8 bg-slate-100 text-slate-600 hover:bg-slate-200 font-medium"
      onClick={handleViewDetails}
    >
      {action}
    </Button>
  );
}
