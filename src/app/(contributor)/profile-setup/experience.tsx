"use client";
import {
  ArrowRight,
  Briefcase,
  ChevronDown,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import React, { useState } from "react";
import { useExperienceProfileSetupMutation } from "@/src/app/redux/services/contributorProfileSetupApi";
import { toast } from "react-toastify";
import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";

interface ProfileSetupProps {
  user?: any;
  //   onUpdate: (user: UserProfile) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const ProfessionalExperience: React.FC<ProfileSetupProps> = ({
  user,
  onNext,
  onPrevious,
}) => {
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [startMonth, setStartMonth] = useState<number>(0);
  const [startYear, setStartYear] = useState<string>("");
  const [endMonth, setEndMonth] = useState<number>(0);
  const [endYear, setEndYear] = useState<string>("");
  const [isCurrentlyWorking, setIsCurrentlyWorking] = useState(false);
  const [keyResponsibilities, setKeyResponsibilities] = useState("");

  const [experiences, setExperiences] = useState<any[]>([]);

  const [experienceProfileSetup, { isLoading }] =
    useExperienceProfileSetupMutation();

  const handleSaveExperience = () => {
    if (!jobTitle || !companyName || !startMonth || !startYear) {
      toast.warn(
        "Please fill in all required fields (Job Title, Company, Start Date)",
      );
      return;
    }

    if (!isCurrentlyWorking && (!endMonth || !endYear)) {
      toast.warn(
        "Please provide an end date or select 'I currently work here'",
      );
      return;
    }

    const newExperience = {
      experience_id: Math.random().toString(36).substr(2, 9),
      job_title: jobTitle,
      company_name: companyName,
      start_month: startMonth,
      start_year: startYear,
      end_month: isCurrentlyWorking ? null : endMonth || null,
      end_year: isCurrentlyWorking ? null : endYear || null,
      is_currently_working: isCurrentlyWorking,
      key_responsibilities: keyResponsibilities,
    };

    setExperiences([...experiences, newExperience]);

    // Clear fields
    setJobTitle("");
    setCompanyName("");
    setStartMonth(0);
    setStartYear("");
    setEndMonth(0);
    setEndYear("");
    setIsCurrentlyWorking(false);
    setKeyResponsibilities("");
    toast.success("Position saved to list!");
  };

  const handleRemoveExperience = (id: string) => {
    setExperiences(experiences.filter((exp) => exp.experience_id !== id));
  };

  const handleNext = async () => {
    if (experiences.length === 0 && (jobTitle || companyName)) {
      toast.info("Saving current position before proceeding...");
      // Optionally handle auto-save or warn
    }

    if (experiences.length === 0) {
      toast.warn("Please add at least one professional experience.");
      return;
    }

    try {
      await experienceProfileSetup({
        experience: experiences,
      }).unwrap();
      toast.success("All experiences saved successfully!");
      onNext();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save experiences");
      console.error("Experience Save Error:", error);
    }
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <>
      <div className="bg-card/70 rounded-lg shadow-sm border border-[#f0e0e9] overflow-hidden">
        <div className="pt-2 px-8 space-y-8">
          <div className="flex justify-between items-start px-8">
            <div>
              <h2 className="text-2xl pt-4 font-bold text-[#1f1f1f]">
                Experience
              </h2>
              <p className="text-sm text-gray-400 mt-1 font-medium">
                Provide details about your professional background.
              </p>
            </div>
            <div className="bg-[#fef2f8] text-[#d41173] text-[10px] font-bold px-3 py-4 rounded-full uppercase tracking-widest">
              Step 3 of 5
            </div>
          </div>

          {/* Existing Experience List */}
          <div className="space-y-4 px-8">
            {experiences.map((exp) => (
              <div
                key={exp.experience_id}
                className="p-6 bg-white rounded-3xl border border-[#f0e0e9] flex items-center gap-3 group hover:shadow-md hover:border-[#d41173]/20 transition-all"
              >
                <div className="w-12 h-12 bg-[#fef2f8] rounded-2xl flex items-center justify-center text-[#d41173]">
                  <Briefcase size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900">{exp.job_title}</h4>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    {exp.company_name}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1 font-bold">
                    {months[exp.start_month - 1]} {exp.start_year} -{" "}
                    {exp.is_currently_working
                      ? "Present"
                      : `${months[exp.end_month - 1]} ${exp.end_year}`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleRemoveExperience(exp.experience_id)}
                    className="p-2 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all border-none bg-transparent shadow-none"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#fcf8fa] rounded-[2rem] px-10 py-6 border border-[#f0e0e9] border-dashed space-y-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex gap-4">
                <div className="w-6 h-6 bg-[#d41173] rounded-full flex items-center justify-center text-white">
                  <Plus size={14} />
                </div>
                <h3 className="text-lg font-bold text-[#1f1f1f]">
                  Add New Experience
                </h3>
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={handleSaveExperience}
                  className="px-4 py-2.5 border border-primary text-white text-sm font-bold rounded-full hover:bg-[#b50d62]  transition-all"
                >
                  Save Position
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-800">
                  Job Title
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Senior Nurse"
                  className="w-full px-4 py-3 bg-white border border-transparent rounded-2xl text-sm focus:ring-2 focus:ring-[#d41173]/20 focus:border-[#d41173] transition-all outline-none font-medium placeholder-gray-300"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-800">
                  Company / Organization
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. City General Hospital"
                  className="w-full px-4 py-3 bg-white border border-transparent rounded-2xl text-sm focus:ring-2 focus:ring-[#d41173]/20 focus:border-[#d41173] transition-all outline-none font-medium placeholder-gray-300"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-800">
                  Start Date
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <select
                      value={startMonth}
                      onChange={(e) => setStartMonth(parseInt(e.target.value))}
                      className="w-full px-4 py-3 bg-white border border-transparent rounded-2xl text-sm appearance-none focus:ring-2 focus:ring-[#d41173]/20 transition-all outline-none font-medium text-gray-400"
                    >
                      <option value={0}>Month</option>
                      {months.map((m, i) => (
                        <option key={m} value={i + 1}>
                          {m}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"
                    />
                  </div>
                  <div className="relative">
                    <select
                      value={startYear}
                      onChange={(e) => setStartYear(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-transparent rounded-2xl text-sm appearance-none focus:ring-2 focus:ring-[#d41173]/20 transition-all outline-none font-medium text-gray-400"
                    >
                      <option value="">Year</option>
                      {years.map((y) => (
                        <option key={y} value={y.toString()}>
                          {y}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-800">
                  End Date
                </label>
                {!isCurrentlyWorking ? (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <select
                        value={endMonth}
                        onChange={(e) => setEndMonth(parseInt(e.target.value))}
                        className="w-full px-4 py-3 bg-white border border-transparent rounded-2xl text-sm appearance-none focus:ring-2 focus:ring-[#d41173]/20 transition-all outline-none font-medium text-gray-400"
                      >
                        <option value={0}>Month</option>
                        {months.map((m, i) => (
                          <option key={m} value={i + 1}>
                            {m}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={14}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"
                      />
                    </div>
                    <div className="relative">
                      <select
                        value={endYear}
                        onChange={(e) => setEndYear(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-transparent rounded-2xl text-sm appearance-none focus:ring-2 focus:ring-[#d41173]/20 transition-all outline-none font-medium text-gray-400"
                      >
                        <option value="">Year</option>
                        {years.map((y) => (
                          <option key={y} value={y.toString()}>
                            {y}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={14}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="px-4 py-3 bg-gray-100/50 text-gray-400 text-sm rounded-2xl font-medium">
                    Present
                  </div>
                )}
                <label className="flex items-center gap-2 mt-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={isCurrentlyWorking}
                    onChange={(e) => setIsCurrentlyWorking(e.target.checked)}
                    className="hidden"
                  />
                  <div
                    className={`w-4 h-4 border-2 rounded-full transition-colors flex items-center justify-center ${
                      isCurrentlyWorking
                        ? "border-[#d41173] bg-[#d41173]"
                        : "border-gray-200"
                    }`}
                  >
                    {isCurrentlyWorking && (
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                    I currently work here
                  </span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-800">
                Key Responsibilities
              </label>
              <textarea
                rows={4}
                value={keyResponsibilities}
                onChange={(e) => setKeyResponsibilities(e.target.value)}
                placeholder="Describe your key duties, especially those related to maternal health.."
                className="w-full px-4 py-3 bg-white border border-transparent rounded-2xl text-sm focus:ring-2 focus:ring-[#d41173]/20 focus:border-[#d41173] transition-all outline-none font-medium placeholder-gray-300 resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        <div className=" mt-4 py-8 px-8 bg-gray-50 flex justify-between items-center">
          <button
            onClick={onPrevious}
            className="flex items-center gap-2 px-6 py-2 text-gray-500 font-bold hover:text-primary transition-all group"
          >
            Previous
          </button>
          <Button
            onClick={handleNext}
            disabled={isLoading}
            className="flex items-center gap-2 px-10 py-3.5 text-white bg-primary font-bold rounded-full shadow-xl shadow-primary/20 hover:bg-[#b50d62] transition-all group"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                Next Step
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  );
};

export default ProfessionalExperience;
