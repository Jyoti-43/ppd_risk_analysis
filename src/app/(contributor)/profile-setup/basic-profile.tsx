"use client";
import React from "react";
import { Pencil, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import {
  InputGroup,
  InputGroupInput,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";

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

interface ProfileSetupProps {
  user: UserProfile;
  //   onUpdate: (user: UserProfile) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const ProfileSetup: React.FC<ProfileSetupProps> = ({
  user,
  //   onUpdate,
  onNext,
  onPrevious,
}) => {
  return (
    <>
      <div className="bg-card/70 rounded-lg shadow-sm border border-[#f0e0e9] overflow-hidden">
        <div className="p-12  px-4 space-y-8">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl pt-4 font-bold text-[#1f1f1f]">
                Basic Profile Setup
              </h2>
              <p className="text-sm text-gray-400 mt-1 font-medium">
                Start by adding your personal details and a professional photo.
              </p>
            </div>
            <div className="bg-[#fef2f8] text-[#d41173] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
              Step 1 of 5
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-12 pt-4">
            {/* Photo Section */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden  ring-8 ring-primary transition-all border-4 border-accent-foreground/20 group-hover:ring-primary/80">
                  <img
                    src={user.avatar}
                    className="w-full h-full object-cover"
                    alt="Profile"
                  />
                </div>
                <div className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-lg border-2 border-white">
                  <Button className="w-8 h-8 p-0 flex items-center justify-center bg-primary text-white rounded-full hover:bg-primary/80 transition-colors">
                    <Pencil size={16} />
                  </Button>
                </div>
              </div>
              <div className="text-center mt-5">
                <p className="text-sm font-bold text-gray-800">Profile Photo</p>
                <p className="text-[10px] text-gray-400 mt-1 font-medium">
                  Min ...MB, PNG or JPG.
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="flex-1 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="light:text-popover font-semibold">
                    First Name
                  </Label>
                  <InputGroup>
                    <InputGroupInput
                      name="firstName"
                      onChange={() => {}}
                      type="text"
                      value={user.name.split(" ")[0]}
                      className="w-full px-4 py-3  border-transparent rounded-2xl text-sm focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none font-medium"
                    />
                  </InputGroup>
                </div>
                <div className="space-y-2">
                  <Label className="light:text-popover font-semibold">
                    Last Name
                  </Label>
                  <InputGroup>
                    <InputGroupInput
                      name="lastName"
                      onChange={() => {}}
                      type="text"
                      value={user.name.split(" ")[1] || ""}
                      className="w-full px-4 py-3  border-transparent rounded-2xl text-sm focus:ring-2 focus:ring-[#d41173] focus:bg-white transition-all outline-none font-medium"
                    />
                  </InputGroup>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="light:text-popover font-semibold">
                  Professional Title
                </Label>
                <InputGroup>
                  <InputGroupInput
                    name="title"
                    onChange={() => {}}
                    type="text"
                    placeholder="e.g. Clinical Psychologist, Doula, Lactation Consultant"
                    className="w-full px-4 py-3  border-transparent rounded-2xl text-sm focus:ring-2 focus:ring-[#d41173] focus:bg-white transition-all outline-none font-medium"
                  />
                </InputGroup>
                <p className="text-[10px] text-gray-400 font-medium px-1">
                  This will be displayed under your name on your articles.
                </p>
              </div>

              <div className="space-y-2">
                <Label className="light:text-popover font-semibold">
                  Short Bio
                </Label>
                <div className="relative ">
                  <InputGroup className="rounded-lg p-0">
                    <InputGroupTextarea
                      name="bio"
                      rows={4}
                      placeholder="Briefly describe your background and passion for maternal health.."
                      className="w-full  border py-0  border-transparent rounded-lg  text-sm focus:ring-2 focus:ring-[#d41173] focus:bg-white transition-all outline-none font-medium resize-none"
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

        <div className=" mt-4 py-8 px-4 bg-gray-100 flex justify-end bg">
          <Button
            onClick={onNext}
            className="flex items-center gap-2 px-10 py-3.5 bg-[#d41173] text-white bg-primary font-bold rounded-full shadow-xl shadow-[#d41173]/20 hover:bg-[#b50d62] transition-all group"
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
