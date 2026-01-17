"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useAppSelector } from "../../Hooks/hook";
import { selectCurrentUser } from "../../redux/feature/user/userSlice";
import { PPD_Risk_Analysis } from "../../component/dashboard/mother/ppd-risk-analysis";
import { ScreeningHistory } from "../../component/dashboard/mother/screeing-history";
import {
  columns,
  PPDRiskAnalysis,
} from "../../component/dashboard/mother/ppd-risk-analysis-column-defination";

const Data: PPDRiskAnalysis[] = [
  {
    id: "728ed52f",
    screeningType: "EPDS",
    date: "2024-10-12",
    risk: "High",
    prediction: "Please consult to doctor.",
    action: "Consult",
  },
  {
    id: "728ed52f",
    screeningType: "Symptoms",
    date: "2024-10-12",
    risk: "Low",
    prediction: "Please consult to doctor.",
    action: "Consult",
  },
  {
    id: "728ed52f",
    screeningType: "Hybrid",
    date: "2024-10-12",
    risk: "Moderate",
    prediction: "Please consult to doctor.",
    action: "Consult",

  },
  {
    id: "728ed52f",
    screeningType: "EPDS",
    date: "2024-10-12",
    risk: "Low",
    prediction: "Perfectly Fine.",
    action: "Consult",
  },
  {
    id: "728ed52f",
    screeningType: "Symptoms",
    date: "2024-10-12",
    risk: "High",
    prediction: "Please consult to doctor.",
    action: "Consult",
  },
  
];

export default function MotherDashboard() {
  const user = useAppSelector(selectCurrentUser);
  return (
    <div className="px-8 space-y-8">
      <div className="flex pt-2 pb-6">
        <h2 className="text-2xl font-bold mb-4"></h2>
        <p>
          <span className="text-2xl md:text-3xl font-bold text-amber-950/80 tracking-tight text-heading">
            Welcome back, {user?.userName} !
          </span>{" "}
          <br />
          Here is your wellness overview.
        </p>
      </div>

      {/* total count cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
        <Card className="p-3 space-y-2">
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-2">
            <div className="flex w-10 items-center ">
              <h2 className="text-2xl font-bold mb-4"> icon </h2>
              <p> </p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <h2 className="text-sm font-semibold mb-2">Total screenings</h2>
              <p>Screening count </p>{" "}
            </div>{" "}
          </CardContent>
        </Card>

        <Card className="p-3 space-y-2">
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-2">
            <div className="flex items-center ">
              <h2 className="text-2xl font-bold mb-4"> icon </h2>
              <p> </p>
            </div>
            <div>
              <h2 className="text-sm font-semibold mb-2">Total screenings</h2>
              <p>Screening count </p>{" "}
            </div>{" "}
          </CardContent>
        </Card>
        <Card className="p-3 space-y-4">
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-2">
            <div className="flex items-center ">
              <h2 className="text-2xl font-bold mb-4"> icon </h2>
              <p> </p>
            </div>
            <div>
              <h2 className="text-sm font-semibold mb-2">Total screenings</h2>
              <p>Screening count </p>{" "}
            </div>{" "}
          </CardContent>
        </Card>
        <Card className="p-3 space-y-4">
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-2">
            <div className="flex items-center ">
              <h2 className="text-2xl font-bold mb-4"> icon </h2>
              <p> </p>
            </div>
            <div>
              <h2 className="text-sm font-semibold mb-2">Total screenings</h2>
              <p>Screening count </p>{" "}
            </div>{" "}
          </CardContent>
        </Card>
      </div>
      {/* risk analysis overview */}
      <div className="grid grid-cols-1 sm:grid-cols-1   lg:grid-cols-5 gap-4 w-full">
        <div className="grid grid-col-span-1 md:col-span-1 lg:col-span-2 ">
          <PPD_Risk_Analysis  />
        </div>
        <div className="grid grid-col-span-1 md:col-span-1 lg:col-span-3 ">
          <ScreeningHistory columns={columns} data={Data} />
        </div>
      </div>
    </div>
  );
}
