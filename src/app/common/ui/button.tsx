// // components/ui/Button.tsx
// import React from 'react';

// interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
//   variant?: 'primary' | 'google';
// }

// export default function Button({ variant = 'primary', children, className, ...props }: ButtonProps) {
//   const baseStyles = " md:py-3 py-2 rounded-4xl transition-all duration-200 flex items-center justify-center gap-2";
  
//   const variants = {
//     // Uses your --color-button and --color-button-hover from @theme
//     primary: "bg-button/80  hover:bg-button-hover  font-secondary font-semibold text-lg",
//     // Uses your --color-google-border and --google-button-text
//     google: "bg-white  border border-google-border text-[#333333] hover:bg-background-hover text-sm font-semibold focus-within:ring-pink-400 focus-within:ring-1",
//   };

//   return (
//     <button className={`${baseStyles} ${variants[variant]} ${className || 'w-full'}`} {...props}>
//       {children}
//     </button>
//   );
// }