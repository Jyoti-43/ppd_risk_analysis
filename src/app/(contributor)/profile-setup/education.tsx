"use client";
import { ArrowRight, Loader2 } from "lucide-react";
import React, { useState } from "react";

import { Label } from "@radix-ui/react-label";
import {
  InputGroup,
  InputGroupInput,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { useEducationProfileSetupMutation } from "@/src/app/redux/services/contributorProfileSetupApi";
import { toast } from "react-toastify";

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
  const [institutionName, setInstitutionName] = useState("");
  const [degree, setDegree] = useState("");
  const [yearOfGraduation, setYearOfGraduation] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");

  const [educations, setEducations] = useState<any[]>([]);

  const [educationProfileSetup, { isLoading }] =
    useEducationProfileSetupMutation();

  const handleSaveEducation = () => {
    if (!institutionName || !degree || !yearOfGraduation || !fieldOfStudy) {
      toast.warn("Please fill in all education fields.");
      return;
    }

    const newEducation = {
      education_id: Math.random().toString(36).substr(2, 9),
      institution_name: institutionName,
      degree: degree,
      year_of_graduation: yearOfGraduation,
      field_of_study: fieldOfStudy,
    };

    setEducations([...educations, newEducation]);

    // Clear fields
    setInstitutionName("");
    setDegree("");
    setYearOfGraduation("");
    setFieldOfStudy("");
    toast.success("Education added to list!");
  };

  const handleRemoveEducation = (id: string) => {
    setEducations(educations.filter((edu) => edu.education_id !== id));
  };

  const handleNext = async () => {
    if (educations.length === 0 && institutionName) {
      toast.info("Saving current education before proceeding...");
    }

    if (educations.length === 0) {
      toast.warn("Please add at least one education record.");
      return;
    }

    try {
      await educationProfileSetup({
        education: educations,
      }).unwrap();
      toast.success("All education details saved!");
      onNext();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save education details");
      console.error("Education Save Error:", error);
    }
  };

  return (
    <>
      <div className="bg-card/70 rounded-lg shadow-sm border border-[#f0e0e9] overflow-hidden">
        <div className="py-4 px-8 space-y-8">
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

          {/* Saved Educations List */}
          <div className="space-y-4 px-8">
            {educations.map((edu) => (
              <div
                key={edu.education_id}
                className="p-4 bg-white rounded-2xl border border-[#f0e0e9] flex items-center justify-between group hover:shadow-sm transition-all"
              >
                <div>
                  <h4 className="font-bold text-gray-900">
                    {edu.degree} in {edu.field_of_study}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {edu.institution_name}
                  </p>
                  <p className="text-[10px] text-gray-400 font-bold mt-1">
                    Graduated in {edu.year_of_graduation}
                  </p>
                </div>
                <Button
                  onClick={() => handleRemoveEducation(edu.education_id)}
                  variant="ghost"
                  className="p-2 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>

          <div className="pt-4 px-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#1f1f1f]">
                Add Education
              </h3>
              <Button
                onClick={handleSaveEducation}
                type="button"
                className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-full font-bold text-xs transition-all"
              >
                Save Education
              </Button>
            </div>

            <div className="flex-1 space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label className="light:text-popover font-semibold">
                    Institution Name
                  </Label>
                  <InputGroup className="p-0 bg-input">
                    <InputGroupInput
                      onChange={(e) => setInstitutionName(e.target.value)}
                      type="text"
                      value={institutionName}
                      placeholder="e.g. University of Toronto"
                      className="w-full px-4 py-3 bg-white border border-[#f0e0e9] rounded-2xl text-sm focus:ring-2 focus:ring-primary transition-all outline-none font-medium"
                    />
                  </InputGroup>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="light:text-popover font-semibold">
                      Degree
                    </Label>
                    <select
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-[#f0e0e9] rounded-2xl text-sm appearance-none focus:ring-2 focus:ring-primary transition-all outline-none font-medium text-gray-700"
                    >
                      <option value="">Select Degree</option>
                      <option value="Bachelor's">Bachelor's</option>
                      <option value="Master's">Master's</option>
                      <option value="PhD">PhD</option>
                      <option value="Diploma">Diploma</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label className="light:text-popover font-semibold">
                      Year of Graduation
                    </Label>
                    <InputGroup className="p-0 bg-input">
                      <InputGroupInput
                        onChange={(e) => setYearOfGraduation(e.target.value)}
                        type="text"
                        value={yearOfGraduation}
                        placeholder="e.g. 2019"
                        className="w-full px-4 py-3 bg-white border border-[#f0e0e9] rounded-2xl text-sm focus:ring-2 focus:ring-primary transition-all outline-none font-medium"
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
                        value={fieldOfStudy}
                        onChange={(e) => setFieldOfStudy(e.target.value)}
                        rows={4}
                        placeholder="e.g. Psychology, Nursing, Midwifery"
                        className="w-full px-4 py-3 bg-white border border-[#f0e0e9] rounded-2xl text-sm focus:ring-2 focus:ring-primary transition-all outline-none font-medium resize-none shadow-none"
                      ></InputGroupTextarea>
                    </InputGroup>
                    <div className="flex items-center justify-between bottom-1 right-4 py-2 text-[10px] text-gray-400 font-bold">
                      <p className="text-[10px] text-gray-400 font-medium px-1">
                        Visible on your public profile.
                      </p>
                      <p>{fieldOfStudy.length}/300</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 py-8 px-8 bg-gray-50 flex justify-between items-center">
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

export default Education;
