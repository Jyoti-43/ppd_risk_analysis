import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  rightElement?: React.ReactNode;
  icon?: React.ReactNode;
}
export default function Input({
  label,
  rightElement,
  className,
  icon,
  ...props
}: InputProps) {
  return (
    <div className={`flex flex-col w-full ${className}`}>
      <div className="flex justify-between items-center">
        <label className=" pl-2 font-bold text-sm text-label-text pb-1">
          {label}
        </label>
        {rightElement}
      </div>

      {/* Container for the halo effect */}
      <div className="flex items-center gap-3 group rounded-full w-full  border border-google-border  bg-background-input px-4 py-3   transition-all focus-within:border-button  focus-within:ring-2 focus-within:ring-pink-200"> 
        {/* render the icon if available */}
        {icon && (
          <div className="text-accent/60 shrink-0  flex items-center justify-center">
            {icon}
          </div>
        )}

        <input
          className=" w-full bg-transparent  outline-none text-form-text placeholder:text-label-text/40 "
          {...props}
        />
      </div>
    </div>
  );
}
        {/* The "Box" container that holds both icon and input */}
        // <div className="flex items-center gap-3 w-full rounded-full border border-google-border bg-background-input px-4 py-3 transition-all focus-within:border-button focus-within:ring-1 focus-within:ring-button">
          

        //   <input
        //     className="w-full bg-transparent outline-none text-form-text placeholder:text-label-text/40"
        //     {...props}
          
