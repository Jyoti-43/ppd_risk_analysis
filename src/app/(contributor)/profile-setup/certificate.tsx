import React from 'react';
import { Pencil, Trash2, ArrowRight, Award, Plus, Calendar, ChevronLeft } from 'lucide-react';



interface CertificateProps {
  user?: any;
//   onUpdate: (user: UserProfile) => void;
  onNext: () => void;
  onPrevious: () => void;
}


  


export const Certificate: React.FC<CertificateProps> = ({ user, onNext, onPrevious }) => {
  // Provide fallback for user and user.name
  const safeUser = user || { name: "" };
  const nameParts =
    typeof safeUser.name === "string" ? safeUser.name.split(" ") : [""];
  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-[#f0e0e9] overflow-hidden">
      <div className="py-4 space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-[#1f1f1f]">Licenses & Certifications</h2>
            <p className="text-sm text-gray-400 mt-1 font-medium">
              Add valid credentials to verify your expertise and build trust.
            </p>
          </div>
          <div className="bg-[#fef2f8] text-[#d41173] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
            Step 4 of 5
          </div>
        </div>

        {/* Entry Form */}
        <div className="space-y-6 pt-2">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-800 uppercase tracking-tight">Certification Name</label>
            <input 
              type="text" 
              placeholder="e.g. Licensed Clinical Social Worker (LCSW)" 
              className="w-full px-6 py-3.5 bg-[#fcf8fa] border border-[#f0e0e9] rounded-2xl text-sm focus:ring-2 focus:ring-[#d41173]/10 focus:border-[#d41173] transition-all outline-none font-medium placeholder-gray-400" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-800 uppercase tracking-tight">Issuing Organization</label>
            <input 
              type="text" 
              placeholder="e.g. Association of Social Work Boards" 
              className="w-full px-6 py-3.5 bg-[#fcf8fa] border border-[#f0e0e9] rounded-2xl text-sm focus:ring-2 focus:ring-[#d41173]/10 focus:border-[#d41173] transition-all outline-none font-medium placeholder-gray-400" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-800 uppercase tracking-tight">Date Issued</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="mm/dd/yyyy" 
                  className="w-full px-6 py-3.5 bg-[#fcf8fa] border border-[#f0e0e9] rounded-2xl text-sm focus:ring-2 focus:ring-[#d41173]/10 focus:border-[#d41173] transition-all outline-none font-medium placeholder-gray-400" 
                />
                <Calendar size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-800 uppercase tracking-tight">Expiration Date <span className="text-gray-400 font-normal">(Optional)</span></label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="mm/dd/yyyy" 
                  className="w-full px-6 py-3.5 bg-[#fcf8fa] border border-[#f0e0e9] rounded-2xl text-sm focus:ring-2 focus:ring-[#d41173]/10 focus:border-[#d41173] transition-all outline-none font-medium placeholder-gray-400" 
                />
                <Calendar size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-800 uppercase tracking-tight">Credential ID <span className="text-gray-400 font-normal">(Optional)</span></label>
            <input 
              type="text" 
              placeholder="e.g. XYZ-12345-6789" 
              className="w-full px-6 py-3.5 bg-[#fcf8fa] border border-[#f0e0e9] rounded-2xl text-sm focus:ring-2 focus:ring-[#d41173]/10 focus:border-[#d41173] transition-all outline-none font-medium placeholder-gray-400" 
            />
          </div>
        </div>

        {/* Existing Certifications */}
        <div className="pt-4 space-y-4">
          <div className="p-5 bg-white rounded-3xl border border-[#f0e0e9] flex items-center gap-5 transition-all">
            <div className="w-10 h-10 bg-[#fef2f8] rounded-full flex items-center justify-center text-[#d41173]">
              <div className="w-6 h-6 bg-[#fef2f8] border-2 border-[#d41173] rounded-full flex items-center justify-center">
                <Award size={12} className="fill-[#d41173]" />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 text-sm">Certified Doula (CD)</h4>
              <p className="text-[11px] text-gray-500 font-medium">DONA International • Issued Jan 2020</p>
            </div>
            <div className="flex gap-1">
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all">
                <Pencil size={16} />
              </button>
              <button className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          {/* Add Another Certification Button */}
          <button className="w-full py-5 border-2 border-[#f0e0e9] border-dashed rounded-3xl text-[#d41173] font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#fef2f8] hover:border-[#d41173]/20 transition-all">
            <div className="w-5 h-5 bg-[#d41173] rounded-full flex items-center justify-center text-white">
              <Plus size={12} />
            </div>
            Add Another Certification
          </button>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-12 py-8 bg-gray-50/50 flex justify-between items-center">
        <button 
          onClick={onPrevious}
          className="flex items-center gap-2 px-6 py-2 text-gray-500 font-bold hover:text-[#d41173] transition-all group"
        >
          Previous
        </button>
        <button 
          onClick={onNext}
          className="flex items-center gap-2 px-10 py-3.5 bg-[#d41173]/50 text-white font-bold rounded-full transition-all group cursor-pointer"
        >
          Next Step
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );


}

