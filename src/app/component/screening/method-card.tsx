import React from "react";
import { LucideIcon, ChevronRight } from "lucide-react";
import { ScreeningMethod } from "../../type";

interface MethodCardProps {
  id: ScreeningMethod;
  title: string;
  description: string;
  icon: LucideIcon;
  colorClass: string;
  onClick: (method: ScreeningMethod) => void;
}

const MethodCard: React.FC<MethodCardProps> = ({
  id,
  title,
  description,
  icon: Icon,
  colorClass,
  onClick,
}) => {
  return (
    <div
      onClick={() => onClick(id)}
      className="group relative bg-card rounded-2xl shadow-sm border border-border p-4 cursor-pointer hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300"
      style={{ height: 'max-content' }}
    >
      <div className="group flex flex-col items-center justify-center">
        <div className="flex items-center justify-start gap-4 pb-3">
          <div
            className={`${colorClass} w-8 h-8 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 shadow-lg shadow-black/5`}
          >
            <Icon size={26} className="text-white p-1" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
        </div>
        <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
          {description}
        </p>
        <div className="flex items-center text-left text-primary font-semibold text-sm mt-2">
          <span>Get Started</span>
          <ChevronRight
            size={16}
            className="ml-1 group-hover:translate-x-1 transition-transform"
          />
        </div>
      </div>
    </div>
  );
};
export default MethodCard;
