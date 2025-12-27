"use client";
import React, { useEffect } from "react";
import { Headset, LockKeyhole, Mail, MailIcon } from "lucide-react";
// import { FcGoogle } from "react-icons/fc";
// import { FaArrowRight } from "react-icons/fa";

import dynamic from "next/dynamic";
import BlobBackground from "../../common/ui/backgroundblob";
import { Label } from "@radix-ui/react-label";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const FcGoogle = dynamic(
  () => import("react-icons/fc").then((m) => m.FcGoogle),
  { ssr: false }
);
const FaArrowRight = dynamic(
  () => import("react-icons/fa").then((m) => m.FaArrowRight),
  { ssr: false }
);



useEffect(() => {

  
},[]);



const handleSubmit = () => {
  // Handle form submission logic here
}

const LoginPage = () => {
  return (
    <div className=" relative flex flex-col  items-center justify-center md:pt-7 md:my-0  gap-3 min-h-svh md:h-screen font-sans bg-accent-foreground/3 px-4  overflow-y-auto md:overflow-y-hidden ">
      {/* for header section, logo emergency support contact */}
      <nav className="flex  flex-row justify-between items-center w-full max-w-6xl  mt-  px-3 md:mb-2 md:mt-2">
        <div className="text-lg font-semibold font-seperator text-primary">
          Logo
        </div>
        <div className=" flex flex-row gap-2 text-sm font-medium text-accent/90  ">
          <span>
            {" "}
            <Headset size={18} />
          </span>
          Need Help? Call{" "}
        </div>
      </nav>

      <BlobBackground />
      {/* this dev for the container of login page welcome message plus form  */}
      <main className="flex-1 flex flex-col gap-1 md:gap-2 ">
        <div className="mb-5  flex flex-col gap-1 md:gap-2 md:mb-3">
          <div className="flex flex-col gap-2 md:gap-2 mb-4 md:mb-3 text-center items-center justify-center">
            <h1 className="text-3xl md:text-4xl font-bold text-amber-950/80 tracking-tight text-heading">
              Welcome back, Mama
            </h1>
            <p className="text-sub  font-medium text-amber-950/80  ">
              You're not alone. This is your safe space.
            </p>
          </div>
          {/*   login form section */}

          <div className="mt-2 flex flex-col items-center justify-center rounded-4xl w-auto max-h-fit gap-3 bg-card/70 shadow-md backdrop-blur-md md:gap-3 md:w-auto">
            <div className="w-full h-1 mt-0.5 bg-linear-to-r from-transparent via-accent/40 to-transparent"></div>
            {/* <div className="absolute top-0 left-0 w-full h-1 bg-[#e28e9b] from-transparent via-accent to-transparent opacity-50"></div> */}
            <div className="flex flex-col pt-3 pl-4 pr-4 gap-2 md:gap-3 w-full max-w-sm">
              <form action="post" onSubmit={(e)=>handleSubmit()}>
                <div className="flex flex-col gap-2 md:gap-2 ">
                  <Label
                    htmlFor="email"
                    className="light:text-popover font-semibold"
                  >
                    Email Address
                  </Label>

                  <InputGroup>
                    <InputGroupInput
                      type="email"
                      placeholder="preeti@gmail.com"
                    />
                    <InputGroupAddon>
                      <MailIcon
                        size={18}
                        className="flex text-center justify-center w-full"
                      />
                    </InputGroupAddon>
                  </InputGroup>
                </div>
                <div>
                  <div className="flex flex-row  justify-between gap-2 md:gap-2 ">
                    <Label
                      htmlFor="password"
                      className="light:text-card/60 font-semibold"
                    >
                      Password
                    </Label>
                    <div>
                      <Link
                        href="/forgotPassword"
                        className="text-primary font-normal text-sm hover:underline"
                      >
                        {" "}
                        Forgot password?
                      </Link>
                    </div>
                  </div>

                  <InputGroup>
                    <InputGroupInput type="password" placeholder="••••••••" />
                    <InputGroupAddon>
                      <LockKeyhole
                        size={20}
                        className="flex text-center justify-center w-full"
                      />
                    </InputGroupAddon>
                  </InputGroup>
                </div>

                <Button
                  variant="default"
                  className="w-full  mt-1 mb-2 font-bold  gap-3 text-white "
                >
                  Log in{" "}
                  <span>
                    {" "}
                    <FaArrowRight size={16} />
                  </span>{" "}
                </Button>
              </form>

              <div className="relative flex py-1 items-center mb-1">
                <div className="grow border-t border-black-200/50 mr-2"></div>
                <span className="shrink-0  text-xs font-semi-bold text-gray-400 uppercase">
                  or log in with email
                </span>
                <div className="grow border-t  border-black-200/50 ml-2"></div>
              </div>

              <Button variant="google" className="w-full pt-2 pb-2 py-3">
                <FcGoogle size={20} />
                Continue with Google
              </Button>

              {/* footer of login page */}
            </div>

            <div className="flex flex-col items-center justify-center text-sm mt-2 pt-3 pb-2 md:pt-5 md:pb-3 md:mt-3 rounded-b-4xl border-t-0.5 border-google-border bg-[#f9ebef]  w-full">
              <p>
                {" "}
                New ?
                <span>
                  <a
                    href="#"
                    className="text-primary hover:underline font-bold "
                  >
                    {" "}
                    Register Here!
                  </a>
                </span>
              </p>
            </div>
          </div>
          <div className="text-xs flex flex-row  gap-2 md:mt-2 items-center justify-center  text-gray-500 font-medium  text-seperator">
            <span>
              <LockKeyhole size={12} strokeWidth={2} className="text-primary" />
            </span>
            <span> Your data is safe and completely private.</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;

{
  /* <Input
                label="Password"
                placeholder=
                icon={<LockKeyhole size={20} />}
                rightElement={
                  <a
                    href="#"
                    className="text-xs font-bold text-link hover:underline"
                  >
                    Forgot password?
                  </a>
                }
              ></Input> */
}
