'use client';
import MethodCard from "@/src/app/component/screening/method-card";
import { ScreeningMethod } from "@/src/app/type";
import { Brain, CalendarHeart, FileText, HeartPulse, Info } from "lucide-react";
import React from "react";


export default function SelectScreeningMethod() {
  const [selectedMethod, setSelectedMethod] = React.useState<ScreeningMethod | null>(null);
  const router = require("next/navigation").useRouter();

  const handleSelect = (method: any) => {
    setSelectedMethod(method);
    router.push("/screening/" + method + "-assessment");
  };

  return (
    <>
      <div className="min-h-screen grid grid-cols-1  bg-background p-4 md:p-8 pt-6 transition-colors duration-300 gap-10   max-w-4xl mx-auto">
        <div className=" text-center md:text-left gap-4  min-h-min">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-2">
            How can we help?
          </h1>

          <p className="text-muted-foreground text-lg leading-relaxed">
            Select the screening method that feels right for you today.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3  lg:gap-8">
          <MethodCard
            id="epds"
            title="EPDS Standard"
            description="The gold-standard Edinburgh Postnatal Depression Scale. 10 focused questions on your mood, to identify emotional wellbeing."
            icon={ CalendarHeart }
            colorClass="bg-primary"
            onClick={handleSelect}
          />
          <MethodCard
            id="symptoms"
            title="Symptom Check"
            description="Focuses on specific clinical symptoms and their intensity. Helpful for identifying physical shifts, social impact."
            icon={HeartPulse}
            colorClass="bg-primary"
            onClick={handleSelect}
          />
          <MethodCard
            id="hybrid"
            title="Full Assessment"
            description="A comprehensive combined (epds + symptoms) screening for the most accurate understanding of your wellbeing."
            icon={Brain}
            colorClass="bg-primary"
            onClick={handleSelect}
          />
        </div>
        <div className="mt-20 bg-card border border-border rounded-2xl p-6 md:p-8  flex flex-col md:flex-row items-center md:items-start gap-6 shadow-sm">
          <div className="bg-amber-50 p-2 rounded-xl text-amber-600 border border-amber-100">
            <Info size={30}  className="text-primary"/>
          </div>
          <div>
            <h4 className="text-xl font-bold text-primary mb-3">
              Privacy & Clinical Notice
            </h4>
            <p className="text-muted-foreground leading-relaxed">
              This tool provides a preliminary screening based on validated
              research. It is{" "}
              <strong className="text-primary font-semibold">
                not a clinical diagnosis
              </strong>
              . All responses are processed locally and remain confidential.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};


