import { ArrowRight } from 'lucide-react';
import React from 'react'
interface CertificateProps {
  user?: any;
//   onUpdate: (user: UserProfile) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const Certificate: React.FC<CertificateProps> = ({
  user,
//   onUpdate,
  onNext,
  onPrevious,
}) => {
  return (
    <div>Certificate
        <button
          onClick={onNext}
          className="flex items-center gap-2 px-10 py-3.5 bg-[#d41173] text-white bg-primary font-bold rounded-full shadow-xl shadow-[#d41173]/20 hover:bg-[#b50d62] transition-all group"
        >
          Next Step
          <ArrowRight
            size={18}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
    </div>
  )
}

export default Certificate