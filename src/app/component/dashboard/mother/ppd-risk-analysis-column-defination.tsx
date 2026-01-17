"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type PPDRiskAnalysis = {
  id: string;
  screeningType: string;
  date: string;
  risk: "High" | "Low" | "Moderate";
  prediction: string;
  action: string;
};

export const columns: ColumnDef<PPDRiskAnalysis>[] = [
  {
    accessorKey: "screeningType",
    header: "Screening Type",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "risk",
    header: "Risk Level",
    cell: ({ row }) => {
      const risk = row.getValue("risk") as "High" | "Low" | "Moderate";
      return (
        <Badge
          className={cn(
            "px-2 py-1 rounded-full text-xs font-medium",
            risk === "High" && "bg-red-100 text-red-800",
            risk === "Low" && "bg-green-100 text-green-800",
            risk === "Moderate" && "bg-yellow-100 text-yellow-800"
          )}
        >
          {risk}
        </Badge>
      );
    },
  },
  {
    accessorKey: "prediction",
    header: "Prediction",
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      const action = row.getValue("action") as string;
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => console.log(action)}
        >
          {action}
        </Button>
      );
    },
  },
];
