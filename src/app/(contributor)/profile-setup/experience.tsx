import {
  ArrowRight,
  Briefcase,
  ChevronDown,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import React from "react";
interface ProfileSetupProps {
  user?: any;
  //   onUpdate: (user: UserProfile) => void;
  onNext: () => void;
  onPrevious: () => void;
}

import { Label } from "@radix-ui/react-label";
import {
  InputGroup,
  InputGroupInput,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";

const ProfessionalExperience: React.FC<ProfileSetupProps> = ({
  user,
  onNext,
  onPrevious,
}) => {
  // Provide fallback for user and user.name
  const safeUser = user || { name: "" };
  const nameParts =
    typeof safeUser.name === "string" ? safeUser.name.split(" ") : [""];
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
                Provide details about your educational background.
              </p>
            </div>
            <div className="bg-[#fef2f8] text-[#d41173] text-[10px] font-bold px-3 py-4 rounded-full uppercase tracking-widest">
              Step 3 of 5
            </div>
          </div>

          {/* Existing Experience List */}
          <div className="space-y-4">
            <div className="p-6 bg-white rounded-3xl border border-[#f0e0e9] flex items-center gap-3 group hover:shadow-md hover:border-[#d41173]/20 transition-all">
              <div className="w-12 h-12 bg-[#fef2f8] rounded-2xl flex items-center justify-center text-[#d41173]">
                <Briefcase size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900">
                  Clinical Psychologist
                </h4>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  St. Mary's Hospital
                </p>
                <p className="text-[10px] text-gray-400 mt-1 font-bold">
                  Jan 2018 - Present
                </p>
              </div>
              <div className="flex gap-2">
                <Button className="p-2 text-gray-300 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all">
                  <Pencil size={16} />
                </Button>
                <Button className="p-2 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all">
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-[#fcf8fa] rounded-[2rem] px-10 py-4 border border-[#f0e0e9] border-dashed space-y-6">
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
                <Button className="px-4 py-2.5 border border-primary text-white text-sm font-bold rounded-full hover:bg-[#b50d62]  transition-all">
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
                    <select className="w-full px-4 py-3 bg-white border border-transparent rounded-2xl text-sm appearance-none focus:ring-2 focus:ring-[#d41173]/20 transition-all outline-none font-medium text-gray-400">
                      <option>Month</option>
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"
                    />
                  </div>
                  <div className="relative">
                    <select className="w-full px-4 py-3 bg-white border border-transparent rounded-2xl text-sm appearance-none focus:ring-2 focus:ring-[#d41173]/20 transition-all outline-none font-medium text-gray-400">
                      <option>Year</option>
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
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <select className="w-full px-4 py-3 bg-white border border-transparent rounded-2xl text-sm appearance-none focus:ring-2 focus:ring-[#d41173]/20 transition-all outline-none font-medium text-gray-400">
                      <option>Month</option>
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"
                    />
                  </div>
                  <div className="relative">
                    <select className="w-full px-4 py-3 bg-white border border-transparent rounded-2xl text-sm appearance-none focus:ring-2 focus:ring-[#d41173]/20 transition-all outline-none font-medium text-gray-400">
                      <option>Year</option>
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"
                    />
                  </div>
                </div>
                <label className="flex items-center gap-2 mt-2 cursor-pointer group">
                  <div className="w-4 h-4 border-2 border-gray-200 rounded-full group-hover:border-[#d41173] transition-colors"></div>
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
            onClick={onNext}
            className="flex items-center gap-2 px-10 py-3.5 text-white bg-primary font-bold rounded-full shadow-xl shadow-primary/20 hover:bg-[#b50d62] transition-all group"
          >
            Next Step
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Button>
        </div>
      </div>
    </>
  );
};

export default ProfessionalExperience;
