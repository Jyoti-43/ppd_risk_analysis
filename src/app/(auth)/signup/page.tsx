"use client";


import Link from "next/link"
import SignupForm from "../../(user)/component/auth/signup";



export default function SignupPage() {



  return (
    <div className="min-h-screen bg-[#fdf2f7] flex flex-col">
      {/* Header */}
      <header className="px-6 pt-6  md:px-1">
        <Link href="/home" className="flex items-center gap-2.5 text-foreground transition-opacity hover:opacity-80">
          <div className="size-9 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-6" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
          <span className="text-xl font-bold leading-none tracking-tight">MamaCare</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-5 md:py-6">
        <div className="max-w-[1100px] w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column: Branding & Info */}
          <div className="flex flex-col gap-8">
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full w-fit shadow-sm">
              <span className="material-symbols-outlined text-primary text-[20px] fill">favorite</span>
              <span className="text-sm font-semibold text-muted-foreground">Trusted by 10,000+ mothers</span>
            </div>

            <div className="flex flex-col gap-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#361a27] leading-[1.1]">
                You're not alone <br />
                on this journey.
              </h1>
              <p className="text-lg text-[#6b3a51] leading-relaxed max-w-[480px]">
                Motherhood is beautiful, but it can also be overwhelming. Join our compassionate community to track your
                well-being, find resources, and connect with others who truly understand.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-white flex flex-col gap-3 shadow-sm">
                <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[24px]">psychology_alt</span>
                </div>
                <div>
                  <h3 className="font-bold text-[#361a27]">Daily Check-ins</h3>
                  <p className="text-sm text-muted-foreground leading-snug mt-1">
                    Simple, gentle tools to track your mood and anxiety over time.
                  </p>
                </div>
              </div>

              <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-white flex flex-col gap-3 shadow-sm">
                <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[24px]">groups</span>
                </div>
                <div>
                  <h3 className="font-bold text-[#361a27]">Community</h3>
                  <p className="text-sm text-muted-foreground leading-snug mt-1">
                    Safe, moderated spaces to share and listen without judgment.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Signup Form Card */}
          <div className="flex justify-center lg:justify-end   w-full">
            <SignupForm />
          </div>
        </div>
      </main>

      <footer className="py-6 px-6 text-center">
        <p className="text-sm text-[#a88d9b]">© 2025 MamaCare Support System. All rights reserved.</p>
      </footer>
    </div>
  )
}

// import React, { FormEvent } from "react";
// import { Headset, LockKeyhole, Mail, MailIcon } from "lucide-react";
// import dynamic from "next/dynamic";
// import BlobBackground from "../../common/ui/backgroundblob";
// import { Label } from "@radix-ui/react-label";
// import {
//   InputGroup,
//   InputGroupAddon,
//   InputGroupInput,
// } from "@/components/ui/input-group";
// import { Button } from "@/components/ui/button";

// const FcGoogle = dynamic(
//   () => import("react-icons/fc").then((m) => m.FcGoogle),
//   { ssr: false }
// );
// const FaArrowRight = dynamic(
//   () => import("react-icons/fa").then((m) => m.FaArrowRight),
//   { ssr: false }
// );

// const SignUp = () => {
//   const router = require("next/navigation").useRouter();

//   async function handleSubmit(event: FormEvent<HTMLFormElement>) {
//     event.preventDefault();
//     // Handle form submission logic here
//     try {
//       const formData = new FormData(event.currentTarget);
//       const name = formData.get("name");
//       const email = formData.get("email");
//       const password = formData.get("password");
//       const confirmPassword = formData.get("confirmPassword");

//       const response = await fetch(
//         "https://ppd-risk-analysis.onrender.com/signup",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ name, email, password , confirmPassword}),
//         }
//       );

//       if (response.ok) router.push("/home");
//     } catch (error: any) {
//       console.error("Error during signup:", error.message);
//     }
//   }

//   return (
//     <div className=" relative grid grid-row justify-items-center  md:pt-3  pt-3 md:my-0  gap-3 min-h-svh md:h-screen font-sans background px-4 pr-6  overflow-y-auto md:overflow-hidden ">
//       <nav className="flex  flex-row justify-between items-center w-full max-w-4xl md:max-w-6xl  mt-2  px-3 md:mb-2 md:mt-2">
//         <div className="text-lg font-semibold font-seperator text-primary">
//           Logo
//         </div>
//         <div className=" flex flex-row gap-2 text-sm font-semibold text-accent">
//           <span>
//             {" "}
//             <Headset size={18} />
//           </span>
//           Need Help? Call{" "}
//         </div>
//       </nav>

//       <BlobBackground />

//       {/* main content */}
//       <main className="grid  grid-flow-col  grid-row-2 justify-items-center w-lvw  md:min-w-md lg:max-w-lg gap-8 md:gap-16 lg:gap-24 items-center">
//         <div className="w-full">image here</div>

//         <div className="w-full max-w-sm md:max-w-lg lg:max-w-2xl">
//           <div className="mb-5 px-0 flex flex-col gap-1 md:gap-2 md:mb-3 md:w-full">
//             <div className="md:mt-2 mt-1 md:px-6 md:m-5 flex flex-col  justify-center rounded-4xl  max-h-fit gap-2   md:gap-2 w-full max-w-sm md:max-w-md bg-card/70 shadow-md ">
//               <div className="flex flex-col gap-2 md:gap-1 mb-1 mt-2 md:mb-1  items-left justify-left">
//                 <h1 className="text-3xl md:text-2xl font-bold font-primary  text-heading ">
//                   Create your Account
//                 </h1>
//                 <p className="text-sub font-secondary font-medium text-left  ">
//                   You're not alone in this journey.
//                 </p>
//               </div>
//               <form
//                 action="post"
//                 onSubmit={handleSubmit}
//                 className="w-full px-5 gap-2"
//               >
//                 <div className="flex flex-col pt-2   gap-3 md:gap-3 w-full max-w-full md:max-w-full">
//                   {/* <div className="grid grid-flow-row grid-cols-2 gap-5 w-full"> */}
//                   <div className="flex flex-col gap-2 md:gap-1 ">
//                     <Label
//                       htmlFor="name"
//                       className="light:text-popover font-semibold"
//                     >
//                       Name
//                     </Label>

//                     <InputGroup>
//                       <InputGroupInput
//                         type="name"
//                         placeholder="Preeti Sharma"
//                       />
//                       <InputGroupAddon>
//                         <MailIcon
//                           size={18}
//                           className="flex text-center justify-center w-full"
//                         />
//                       </InputGroupAddon>
//                     </InputGroup>
//                   </div>

//                   <div className="flex flex-col gap-2 md:gap-2 ">
//                     <Label
//                       htmlFor="email"
//                       className="light:text-popover font-semibold"
//                     >
//                       Email Address
//                     </Label>

//                     <InputGroup>
//                       <InputGroupInput
//                         type="email"
//                         placeholder="preeti@gmail.com"
//                       />
//                       <InputGroupAddon>
//                         <MailIcon
//                           size={18}
//                           className="flex text-center justify-center w-full"
//                         />
//                       </InputGroupAddon>
//                     </InputGroup>
//                   </div>

//                   <div className="flex flex-col gap-2 md:gap-2 ">
//                     <Label
//                       htmlFor="password"
//                       className="light:text-popover font-semibold"
//                     >
//                       Create a Password
//                     </Label>

//                     <InputGroup>
//                       <InputGroupInput type="password" placeholder="••••••••" />
//                       <InputGroupAddon>
//                         <LockKeyhole
//                           size={20}
//                           className="flex text-center justify-center w-full"
//                         />
//                       </InputGroupAddon>
//                     </InputGroup>
//                   </div>

//                   <div className="flex flex-col gap-2 md:gap-2 ">
//                     <Label
//                       htmlFor="confirm-password"
//                       className="light:text-popover font-semibold"
//                     >
//                       Confirm Password
//                     </Label>

//                     <InputGroup>
//                       <InputGroupInput
//                         type="password"
//                         placeholder="••••••••"
//                       ></InputGroupInput>
//                       <InputGroupAddon>
//                         <LockKeyhole
//                           size={20}
//                           className="flex text-center justify-center w-full"
//                         />
//                       </InputGroupAddon>
//                     </InputGroup>
//                   </div>
//                   {/* </div> */}

//                   <Button className="max-w-full md:min-w-max  md:mt-1  md:mb-2 font-bold  gap-3 text-white ">
//                     Sign Up{" "}
//                     <span>
//                       {" "}
//                       <FaArrowRight size={16} />
//                     </span>{" "}
//                   </Button>

//                   <div className="relative flex py-1 items-center mb-1">
//                     <div className="grow border-t border-accent/50"></div>
//                     <span className="shrink-0  text-xs font-medium tracking-wide text-gray-600 uppercase pr-1">
//                       or log in with email
//                     </span>
//                     <div className="pl-1 grow border-t border-accent/50"></div>
//                   </div>

//                   <Button variant="google" className="w-full pt-2 pb-2 py-3">
//                     <FcGoogle size={20} />
//                     Continue with Google
//                   </Button>

//                   {/* footer of login page */}
//                 </div>
//               </form>

//               <div className="flex flex-col items-center justify-center text-sm md:mt-2 py-1 md:pt-2 md:pb-2   w-full">
//                 <p>
//                   {" "}
//                   Already part of us?
//                   <span>
//                     <a
//                       href="#"
//                       className="text-link hover:underline text-md font-bold "
//                     >
//                       {" "}
//                       Log in here
//                     </a>
//                   </span>
//                 </p>
//               </div>
//             </div>
//             <div className="text-sm flex flex-row  gap-2 md:mt-1  items-center justify-center  font-primary font-medium  text-seperator">
//               <span>
//                 <LockKeyhole size={15} />
//               </span>
//               <span> Your data is safe and completely private.</span>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default SignUp;
