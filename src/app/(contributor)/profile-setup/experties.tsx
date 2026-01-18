"use client";
import { ArrowRight, Loader2, Plus, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { useExpertiesProfileSetupMutation } from "@/src/app/redux/services/contributorProfileSetupApi";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";

interface ExpertiesProps {
  user?: any;
  //   onUpdate: (user: UserProfile) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const Experties: React.FC<ExpertiesProps> = ({
  user,
  onNext,
  onPrevious,
}) => {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [publicationTitle, setPublicationTitle] = useState("");
  const [publicationUrl, setPublicationUrl] = useState("");

  const [publications, setPublications] = useState<any[]>([]);

  const [expertiesProfileSetup, { isLoading }] =
    useExpertiesProfileSetupMutation();

  const topics = [
    "Postpartum Depression",
    "Breastfeeding Support",
    "Newborn Care",
    "Maternal Nutrition",
    "Sleep Training",
    "Mental Wellness",
  ];

  const handleTopicToggle = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic],
    );
  };

  const handleSavePublication = () => {
    if (!publicationTitle || !publicationUrl) {
      toast.warn("Please provide both a title and a URL for the publication.");
      return;
    }

    const newPub = {
      publication_id: Math.random().toString(36).substr(2, 9),
      title: publicationTitle,
      url: publicationUrl,
    };

    setPublications([...publications, newPub]);
    setPublicationTitle("");
    setPublicationUrl("");
    toast.success("Publication added!");
  };

  const handleRemovePublication = (id: string) => {
    setPublications(publications.filter((p) => p.publication_id !== id));
  };

  const handleComplete = async () => {
    try {
      if (selectedTopics.length === 0) {
        toast.warn("Please select at least one expertise topic");
        return;
      }

      await expertiesProfileSetup({
        expertise_topics: selectedTopics,
        publications: publications,
      }).unwrap();

      toast.success("Profile setup complete!");
      onNext();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to complete setup");
    }
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-[#f0e0e9] overflow-hidden">
      <div className="py-8 px-10 space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-[#1f1f1f]">
              Your Expertise
            </h2>
            <p className="text-sm text-gray-400 mt-1 font-medium">
              Highlight your specialized skills and areas of professional focus.
            </p>
          </div>
          <div className="bg-[#fef2f8] text-[#d41173] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
            Step 5 of 5
          </div>
        </div>

        <div className="space-y-6">
          <p className="text-sm text-gray-500 font-medium leading-relaxed">
            Select the areas you're most proficient in. This helps us match you
            with the right content and community needs.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topics.map((area) => (
              <label
                key={area}
                className={`flex items-center gap-4 p-4 rounded-3xl border transition-all cursor-pointer group ${
                  selectedTopics.includes(area)
                    ? "border-primary bg-[#fef2f8]/30"
                    : "border-[#f0e0e9] hover:border-primary/50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedTopics.includes(area)}
                  onChange={() => handleTopicToggle(area)}
                  className="w-5 h-5 accent-primary rounded-lg"
                />
                <span
                  className={`font-bold transition-colors ${
                    selectedTopics.includes(area)
                      ? "text-primary"
                      : "text-gray-700"
                  }`}
                >
                  {area}
                </span>
              </label>
            ))}
          </div>

          <div className="space-y-4 pt-4 border-t border-[#f0e0e9]">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#1f1f1f]">
                Publications (Optional)
              </h3>
              <Button
                onClick={handleSavePublication}
                className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-full font-bold text-xs"
              >
                Add Publication
              </Button>
            </div>

            {/* Saved Publications List */}
            <div className="space-y-3">
              {publications.map((pub) => (
                <div
                  key={pub.publication_id}
                  className="flex items-center justify-between p-3 bg-[#fcf8fa] border border-[#f0e0e9] rounded-2xl group"
                >
                  <div className="overflow-hidden">
                    <h4 className="text-sm font-bold text-gray-800 truncate">
                      {pub.title}
                    </h4>
                    <a
                      href={pub.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-primary hover:underline truncate block"
                    >
                      {pub.url}
                    </a>
                  </div>
                  <Button
                    onClick={() => handleRemovePublication(pub.publication_id)}
                    variant="ghost"
                    className="p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Publication Title"
                value={publicationTitle}
                onChange={(e) => setPublicationTitle(e.target.value)}
                className="px-6 py-3.5 bg-[#fcf8fa] border border-[#f0e0e9] rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary/10"
              />
              <input
                type="text"
                placeholder="Publication URL"
                value={publicationUrl}
                onChange={(e) => setPublicationUrl(e.target.value)}
                className="px-6 py-3.5 bg-[#fcf8fa] border border-[#f0e0e9] rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary/10"
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
          onClick={handleComplete}
          disabled={isLoading}
          className="flex items-center gap-2 px-10 py-3.5 bg-primary text-white font-bold rounded-full shadow-lg shadow-primary/20 hover:bg-[#b50d62] transition-all group"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <>
              Complete Setup
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

export default Experties;
