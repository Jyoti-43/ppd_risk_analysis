import { ArrowRight } from "lucide-react";
import React from "react";
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
  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-[#f0e0e9] overflow-hidden">
      <div className="py-8 px-8 space-y-8">
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
            {[
              "Postpartum Depression",
              "Breastfeeding Support",
              "Newborn Care",
              "Maternal Nutrition",
              "Sleep Training",
              "Mental Wellness",
            ].map((area) => (
              <label
                key={area}
                className="flex items-center gap-4 p-4 rounded-3xl border border-[#f0e0e9] hover:border-primary hover:bg-[#fef2f8]/30 transition-all cursor-pointer group"
              >
                <input
                  type="checkbox"
                  className="w-5 h-5 accent-primary rounded-lg"
                />
                <span className="text-gray-700 font-bold group-hover:text-primary transition-colors">
                  {area}
                </span>
              </label>
            ))}
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
        <button
          onClick={onNext}
          className="flex items-center gap-2 px-10 py-3.5 bg-primary text-white font-bold rounded-full shadow-lg shadow-primary/20 hover:bg-[#b50d62] transition-all group"
        >
          Complete Setup
          <ArrowRight
            size={18}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>
    </div>
  );
};

export default Experties;
