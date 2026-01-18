"use client";
import React, { useState } from "react";
import {
  Pencil,
  Trash2,
  ArrowRight,
  Award,
  Plus,
  Calendar,
  Loader2,
} from "lucide-react";
import { useCertificateProfileSetupMutation } from "@/src/app/redux/services/contributorProfileSetupApi";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";

interface CertificateProps {
  user?: any;
  //   onUpdate: (user: UserProfile) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const Certificate: React.FC<CertificateProps> = ({
  user,
  onNext,
  onPrevious,
}) => {
  const [certificationName, setCertificationName] = useState("");
  const [issuingOrganization, setIssuingOrganization] = useState("");
  const [dateIssued, setDateIssued] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [credentialId, setCredentialId] = useState("");

  const [certifications, setCertifications] = useState<any[]>([]);

  const [certificateProfileSetup, { isLoading }] =
    useCertificateProfileSetupMutation();

  const formatDateToISO = (dateStr: string) => {
    if (!dateStr) return null;
    const [month, day, year] = dateStr.split("/");
    if (month && day && year) {
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
    return dateStr; // Fallback to original if format is unexpected
  };

  const handleSaveCertificate = () => {
    if (!certificationName || !issuingOrganization || !dateIssued) {
      toast.warn(
        "Please fill in certification name, issuing organization, and date issued.",
      );
      return;
    }

    const newCert = {
      certification_id: Math.random().toString(36).substr(2, 9),
      certification_name: certificationName,
      issuing_organization: issuingOrganization,
      date_issued: formatDateToISO(dateIssued),
      expiration_date: formatDateToISO(expirationDate),
      credential_id: credentialId || null,
    };

    setCertifications([...certifications, newCert]);

    // Clear fields
    setCertificationName("");
    setIssuingOrganization("");
    setDateIssued("");
    setExpirationDate("");
    setCredentialId("");
    toast.success("Certification added to list!");
  };

  const handleRemoveCertificate = (id: string) => {
    setCertifications(
      certifications.filter((cert) => cert.certification_id !== id),
    );
  };

  const handleNext = async () => {
    if (certifications.length === 0 && certificationName) {
      toast.info("Saving current certification before proceeding...");
    }

    if (certifications.length === 0) {
      toast.warn("Please add at least one certification.");
      return;
    }

    try {
      await certificateProfileSetup({
        certifications: certifications,
      }).unwrap();
      toast.success("All certifications saved!");
      onNext();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save certifications");
      console.error("Certification Save Error:", error);
    }
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-[#f0e0e9] overflow-hidden">
      <div className="py-4 space-y-8 px-10">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-[#1f1f1f]">
              Licenses & Certifications
            </h2>
            <p className="text-sm text-gray-400 mt-1 font-medium">
              Add valid credentials to verify your expertise and build trust.
            </p>
          </div>
          <div className="bg-[#fef2f8] text-[#d41173] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
            Step 4 of 5
          </div>
        </div>

        {/* Saved Certifications List */}
        <div className="space-y-4">
          {certifications.map((cert) => (
            <div
              key={cert.certification_id}
              className="p-4 bg-white rounded-3xl border border-[#f0e0e9] flex items-center justify-between group hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#fef2f8] rounded-full flex items-center justify-center text-[#d41173]">
                  <Award size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">
                    {cert.certification_name}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {cert.issuing_organization} • {cert.date_issued}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => handleRemoveCertificate(cert.certification_id)}
                variant="ghost"
                className="p-2 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-dashed border-[#f0e0e9]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-[#1f1f1f]">
              Add Certification
            </h3>
            <Button
              onClick={handleSaveCertificate}
              className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-full font-bold text-xs"
            >
              Save Certificate
            </Button>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-800 uppercase tracking-tight">
                Certification Name
              </label>
              <input
                type="text"
                value={certificationName}
                onChange={(e) => setCertificationName(e.target.value)}
                placeholder="e.g. Licensed Clinical Social Worker (LCSW)"
                className="w-full px-6 py-3.5 bg-[#fcf8fa] border border-[#f0e0e9] rounded-2xl text-sm focus:ring-2 focus:ring-[#d41173]/10 focus:border-[#d41173] transition-all outline-none font-medium placeholder-gray-300"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-800 uppercase tracking-tight">
                Issuing Organization
              </label>
              <input
                type="text"
                value={issuingOrganization}
                onChange={(e) => setIssuingOrganization(e.target.value)}
                placeholder="e.g. Association of Social Work Boards"
                className="w-full px-6 py-3.5 bg-[#fcf8fa] border border-[#f0e0e9] rounded-2xl text-sm focus:ring-2 focus:ring-[#d41173]/10 focus:border-[#d41173] transition-all outline-none font-medium placeholder-gray-300"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-800 uppercase tracking-tight">
                  Date Issued
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={dateIssued}
                    onChange={(e) => setDateIssued(e.target.value)}
                    placeholder="mm/dd/yyyy"
                    className="w-full px-6 py-3.5 bg-[#fcf8fa] border border-[#f0e0e9] rounded-2xl text-sm focus:ring-2 focus:ring-[#d41173]/10 focus:border-[#d41173] transition-all outline-none font-medium placeholder-gray-300"
                  />
                  <Calendar
                    size={16}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-800 uppercase tracking-tight">
                  Expiration Date{" "}
                  <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                    placeholder="mm/dd/yyyy"
                    className="w-full px-6 py-3.5 bg-[#fcf8fa] border border-[#f0e0e9] rounded-2xl text-sm focus:ring-2 focus:ring-[#d41173]/10 focus:border-[#d41173] transition-all outline-none font-medium placeholder-gray-400"
                  />
                  <Calendar
                    size={16}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-800 uppercase tracking-tight">
                Credential ID{" "}
                <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={credentialId}
                onChange={(e) => setCredentialId(e.target.value)}
                placeholder="e.g. XYZ-12345-6789"
                className="w-full px-6 py-3.5 bg-[#fcf8fa] border border-[#f0e0e9] rounded-2xl text-sm focus:ring-2 focus:ring-[#d41173]/10 focus:border-[#d41173] transition-all outline-none font-medium placeholder-gray-300"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="px-12 py-8 bg-gray-50/50 flex justify-between items-center">
        <button
          onClick={onPrevious}
          className="flex items-center gap-2 px-6 py-2 text-gray-500 font-bold hover:text-[#d41173] transition-all group"
        >
          Previous
        </button>
        <Button
          onClick={handleNext}
          disabled={isLoading}
          className="flex items-center gap-2 px-10 py-3.5 bg-primary text-white font-bold rounded-full transition-all group cursor-pointer"
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
  );
};
