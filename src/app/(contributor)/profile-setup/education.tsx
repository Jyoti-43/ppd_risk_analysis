import { ArrowRight } from "lucide-react";
import React from "react";

import { Label } from "@radix-ui/react-label";
import {
  InputGroup,
  InputGroupInput,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
interface EducationProps {
  user?: any;
  //   onUpdate: (user: UserProfile) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const Education: React.FC<EducationProps> = ({
  user,
  //   onUpdate,
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
        <div className="py-4  px-8 space-y-8">
          <div className="flex justify-between items-start px-8">
            <div>
              <h2 className="text-2xl pt-4 font-bold text-[#1f1f1f]">
                Education
              </h2>
              <p className="text-sm text-gray-400 mt-1 font-medium">
                Provide details about your educational background.
              </p>
            </div>
            <div className="bg-[#fef2f8] text-[#d41173] text-[10px] font-bold px-3 py-4 rounded-full uppercase tracking-widest">
              Step 2 of 5
            </div>
          </div>

          <div className="flex md:flex-row gap-12 pt-4 px-8">
            {/* Form Fields */}
            <div className="flex-1 space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label className="light:text-popover font-semibold">
                    Institution Name
                  </Label>
                  <InputGroup className="p-0 bg-input">
                    <InputGroupInput
                      // name="firstName"
                      onChange={() => {}}
                      type="text"
                      value={nameParts[0]}
                      placeholder="e.g. University of Toronto"
                      className="w-full px-4 py-3  bg-input border-transparent rounded-2xl text-sm focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none font-medium"
                    />
                  </InputGroup>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="light:text-popover font-semibold">
                      Degree
                    </Label>

                    <select className="w-full px-4 py-2 border border-border rounded-lg bg-input">
                      <option>Select Degree</option>
                      <option>Bachelor's</option>
                      <option>Master's</option>
                      <option>PhD</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label className="light:text-popover font-semibold">
                      Year of Graduation
                    </Label>
                    <InputGroup className="p-0 bg-input">
                      <InputGroupInput
                        // name="title"
                        onChange={() => {}}
                        type="text"
                        placeholder="e.g. 2019"
                        className="w-full     border-transparent rounded-2xl text-sm focus:ring-2 focus:ring-[#d41173] focus:bg-white transition-all outline-none font-medium"
                      />
                    </InputGroup>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="light:text-popover font-semibold">
                    Field of Study
                  </Label>
                  <div className="relative">
                    <InputGroup className="rounded-lg p-0">
                      <InputGroupTextarea
                        // name="bio"
                        rows={4}
                        placeholder="e.g. Psychology, Nursing, Midwifery"
                        className="w-full  border py-0 bg-input  border-transparent rounded-lg  text-sm focus:ring-2 focus:ring-[#d41173] focus:bg-white transition-all outline-none font-medium resize-none"
                      ></InputGroupTextarea>
                    </InputGroup>
                    <div className=" flex items-center justify-between bottom-1 right-4 py-2 text-[10px] text-gray-400 font-bold">
                      <p className="text-[10px] text-gray-400 font-medium px-1 ">
                        Visible on your public profile.
                      </p>
                      <p>0/300</p>
                    </div>
                  </div>
                </div>
              </div>
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
            className="flex items-center gap-2 px-10 py-3.5 bg-primary text-white font-bold rounded-full shadow-xl shadow-primary/20 hover:bg-[#b50d62] transition-all group"
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

export default Education;
