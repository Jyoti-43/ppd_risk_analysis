"use client";

import React from "react";
import {
  User,
  Mail,
  Briefcase,
  GraduationCap,
  Award,
  BookOpen,
  ExternalLink,
  Edit2,
  Plus,
  Eye,
  MapPin,
  Calendar,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetContributorProfileQuery } from "@/src/app/redux/services/contributorProfileSetupApi";
import { useAppSelector } from "@/src/app/Hooks/hook";
import { selectCurrentUser } from "@/src/app/redux/feature/user/userSlice";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const MyProfilePage = () => {
  const { data: profile, isLoading, error } = useGetContributorProfileQuery();
  const currentUser = useAppSelector(selectCurrentUser);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-gray-500 font-medium animate-pulse">
          Loading your professional profile...
        </p>
      </div>
    );
  }

  // Fallback if no profile data yet
  const basicInfo = profile?.step1_basic_profile || {};
  const education = profile?.step2_education || [];
  const experience = profile?.step3_experience || [];
  const certifications = profile?.step4_certifications || [];

  const expertiseData = profile?.step5_expertise_and_publications || {};
  const topics = expertiseData.expertise_topics || [];
  const publications = expertiseData.publications || [];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            My Professional Profile
          </h1>
          <p className="text-gray-500 mt-1">
            Update your public expert profile to maintain credibility.
          </p>
        </div>
        <Button
          variant="outline"
          className="rounded-full border-primary/20 text-primary hover:bg-primary/5 gap-2 px-6"
        >
          <Eye size={18} />
          View Public Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Quick Overview */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-[#f0e0e9] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-500" />

            <div className="relative flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-[#f0e0e9] overflow-hidden bg-gray-50">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${
                      currentUser?.userName || "User"
                    }`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-1 right-1 w-8 h-8 bg-primary rounded-full border-4 border-white flex items-center justify-center text-white cursor-pointer hover:scale-110 transition-transform">
                  <Edit2 size={12} />
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {basicInfo.first_name}{" "}
                  {basicInfo.last_name || currentUser?.userName}
                </h2>
                <p className="text-primary font-semibold text-sm tracking-wide uppercase mt-1">
                  {basicInfo.professional_title || "Professional Contributor"}
                </p>
              </div>

              <div className="w-full pt-4">
                <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                  <span>Profile Complete</span>
                  <span className="text-primary">100%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-[#d41173] w-full rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Contact & Meta Info */}
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-[#f0e0e9] space-y-4">
            <div className="flex items-center gap-3 text-gray-600">
              <div className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
                <Mail size={18} />
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                  Email Address
                </p>
                <p className="text-sm font-medium truncate">
                  {currentUser?.email || "n/a"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <div className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
                <MapPin size={18} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                  Location
                </p>
                <p className="text-sm font-medium">Remote / Global</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Detailed Sections */}
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Information Section */}
          <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-[#f0e0e9] relative">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#fef2f8] rounded-2xl flex items-center justify-center text-primary">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Basic Information
                  </h3>
                  <p className="text-sm text-gray-400 font-medium">
                    Your primary identity on the platform
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-primary rounded-full"
              >
                <Edit2 size={18} />
                <span className="ml-2 font-bold text-xs uppercase tracking-tight">
                  Edit
                </span>
              </Button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                    Full Name
                  </p>
                  <p className="text-gray-900 font-bold">
                    {basicInfo.first_name} {basicInfo.last_name}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                    Professional Title
                  </p>
                  <p className="text-gray-900 font-bold">
                    {basicInfo.professional_title}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Short Bio
                </p>
                <p className="text-gray-600 leading-relaxed font-medium">
                  {basicInfo.short_bio ||
                    "No bio added yet. Add a short bio to introduce yourself to the community."}
                </p>
              </div>
            </div>
          </section>

          {/* Education Section */}
          <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-[#f0e0e9]">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Education</h3>
                <p className="text-sm text-gray-400 font-medium font-medium">
                  Academic background and credentials
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-primary rounded-full"
              >
                <Plus size={18} />
                <span className="ml-2 font-bold text-xs uppercase tracking-tight">
                  Add Degree
                </span>
              </Button>
            </div>

            <div className="space-y-8">
              {education.length > 0 ? (
                education.map((edu: any, index: number) => (
                  <div key={index} className="flex gap-6 group">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-primary/5 group-hover:text-primary transition-colors duration-300">
                      <GraduationCap size={24} />
                    </div>
                    <div className="flex-1 flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">
                          {edu.degree} in {edu.field_of_study}
                        </h4>
                        <p className="text-gray-500 font-medium">
                          {edu.institution_name}
                        </p>
                      </div>
                      <p className="text-primary/60 font-bold text-sm bg-primary/5 px-3 py-1 rounded-full">
                        {edu.year_of_graduation}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 italic">
                  No education records found.
                </p>
              )}
            </div>
          </section>

          {/* Professional Experience Section */}
          <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-[#f0e0e9]">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Professional Experience
                </h3>
                <p className="text-sm text-gray-400 font-medium">
                  Your clinical and professional history
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-primary rounded-full"
              >
                <Edit2 size={18} />
                <span className="ml-2 font-bold text-xs uppercase tracking-tight">
                  Edit Experience
                </span>
              </Button>
            </div>

            <div className="space-y-10 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
              {experience.length > 0 ? (
                experience.map((exp: any, index: number) => (
                  <div key={index} className="relative pl-12 group">
                    <div className="absolute left-5 top-2 w-2.5 h-2.5 rounded-full bg-white border-2 border-primary group-hover:bg-primary transition-colors" />
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">
                          {exp.job_title}
                        </h4>
                        <p className="text-primary font-bold text-xs mt-1">
                          {exp.company_name}
                        </p>
                        <ul className="mt-4 space-y-2">
                          {exp.key_responsibilities
                            ?.split("\n")
                            .filter(Boolean)
                            .map((resp: string, idx: number) => (
                              <li
                                key={idx}
                                className="text-gray-500 text-sm leading-relaxed flex gap-2"
                              >
                                <span className="text-gray-300 mt-1.5 flex-shrink-0">
                                  •
                                </span>
                                {resp.trim()}
                              </li>
                            )) || (
                            <li className="text-gray-400 italic text-sm">
                              No responsibilities added.
                            </li>
                          )}
                        </ul>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-900 font-bold text-xs bg-gray-50 px-3 py-1.5 rounded-full inline-block">
                          {months[exp.start_month - 1]} {exp.start_year} -{" "}
                          {exp.is_currently_working
                            ? "Present"
                            : `${months[exp.end_month - 1]} ${exp.end_year}`}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="pl-12">
                  <p className="text-gray-400 italic">
                    No professional experience listed.
                  </p>
                </div>
              )}
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Certifications Section */}
            <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-[#f0e0e9]">
              <div className="flex justify-between items-start mb-8">
                <h3 className="text-xl font-bold text-gray-900">
                  Certifications
                </h3>
                <Edit2
                  size={18}
                  className="text-gray-300 cursor-pointer hover:text-primary transition-colors"
                />
              </div>

              <div className="space-y-6">
                {certifications.length > 0 ? (
                  certifications.map((cert: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 rounded-3xl bg-gray-50/50 hover:bg-white hover:shadow-md transition-all duration-300 border border-transparent hover:border-[#f0e0e9]"
                    >
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm">
                        <Award size={24} />
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="font-bold text-gray-900 text-sm truncate">
                          {cert.certification_name}
                        </h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight mt-0.5">
                          {cert.issuing_organization} •{" "}
                          {cert.date_issued?.split("-")[0]}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 italic text-sm">
                    No certifications listed.
                  </p>
                )}
              </div>
            </section>

            {/* Expertise & Publications */}
            <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-[#f0e0e9]">
              <div className="flex justify-between items-start mb-8">
                <h3 className="text-xl font-bold text-gray-900">
                  Expertise & Publications
                </h3>
                <Edit2
                  size={18}
                  className="text-gray-300 cursor-pointer hover:text-primary transition-colors"
                />
              </div>

              <div className="space-y-8">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                    Top Expertise Areas
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {topics.length > 0 ? (
                      topics.map((topic: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-[#fef2f8] text-primary text-xs font-bold rounded-full"
                        >
                          {topic}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-400 italic text-xs">
                        No topics selected.
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                    Published Papers
                  </p>
                  <div className="space-y-3">
                    {publications.length > 0 ? (
                      publications.map((pub: any, index: number) => (
                        <a
                          key={index}
                          href={pub.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 group/link"
                        >
                          <div className="w-6 h-6 rounded-full border border-gray-100 flex items-center justify-center text-gray-300 group-hover/link:text-primary group-hover/link:border-primary/20 transition-all">
                            <ChevronRight size={14} />
                          </div>
                          <span className="text-sm font-bold text-gray-600 group-hover/link:text-primary transition-colors truncate">
                            {pub.title}
                          </span>
                        </a>
                      ))
                    ) : (
                      <p className="text-gray-400 italic text-xs">
                        No publications listed.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfilePage;
