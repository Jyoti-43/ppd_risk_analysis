"use client";
import { Stepper } from "@/components/ui/stepper";
import { ProfileSetup } from "@/src/app/(contributor)/profile-setup/basic-profile";
import Certificate from "@/src/app/(contributor)/profile-setup/certificate";
import Education from "@/src/app/(contributor)/profile-setup/education";
import ProfessionalExperience from "@/src/app/(contributor)/profile-setup/experience";
import Experties from "@/src/app/(contributor)/profile-setup/experties";
import { ST } from "next/dist/shared/lib/utils";
import React, { useState } from "react";
export interface UserProfile {
  name: string;
  email: string;
  role: string;
  bio: string;
  location: string;
  avatar: string;
  joinDate: string;
  postCount: number;
  lastScreeningDate: string;
  lastScore: number | null;
}

const INITIAL_USER: UserProfile = {
  name: "Sarah Jenkins",
  email: "sarah.j@mamacare.com",
  role: "Contributor",
  bio: "",
  location: "San Francisco, CA",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  joinDate: "October 2023",
  postCount: 0,
  lastScreeningDate: "N/A",
  lastScore: null,
};
const STEPS = [
  "Basic Profile",
  "Education",
  "Experience",

  "Certifications",
  "Expertise ",
];

const ContributorPageSetup = () => {
  const currentStepLabel = STEPS[0] + 1;
  const [currentStep, setCurrentStep] = useState(0); // Start at 'Basic Profile'

  const handleNext = () => {
    if (currentStep < currentStepLabel.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  return (
    <>
      <div className="relative min-h-screen bg-accent-foreground/3  py-6 mx-auto flex flex-col items-center justify-center">
        <p className="p-20"> Profile setup page</p>
        <div className="max-w-4xl w-full space-y-8">
          <Stepper
            steps={5}
            currentStep={currentStep}
            label={STEPS}
            onStepClick={setCurrentStep}
          />

          {currentStep === 0 && (
            <ProfileSetup
              user={INITIAL_USER}
              onNext={handleNext}
              onPrevious={handlePrevious}
            />
          )}
          {currentStep === 1 && (
            <Education onNext={handleNext} onPrevious={handlePrevious} />
          )}
          {currentStep === 2 && (
            <ProfessionalExperience
              onNext={handleNext}
              onPrevious={handlePrevious}
            />
          )}
          {currentStep === 3 && (
            <Certificate onNext={handleNext} onPrevious={handlePrevious} />
          )}
          {currentStep === 4 && (
            <Experties onNext={handleNext} onPrevious={handlePrevious} />
          )}
          {/* <ProfileSetup user={INITIAL_USER} onUpdate={() => {}} onNext={() => {}} /> */}
        </div>
      </div>
    </>
  );
};

export default ContributorPageSetup;
