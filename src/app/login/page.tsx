"use client";
import React from "react";
import Input from "../common/ui/input";
import Button from "../common/ui/button";
import { Headset, LockKeyhole, Mail } from "lucide-react";
// import { FcGoogle } from "react-icons/fc";
// import { FaArrowRight } from "react-icons/fa";

import dynamic from "next/dynamic";

import BlobBackground from "../common/ui/backgroundblob";

const FcGoogle = dynamic(
  () => import("react-icons/fc").then((m) => m.FcGoogle),
  { ssr: false }
);
const FaArrowRight = dynamic(
  () => import("react-icons/fa").then((m) => m.FaArrowRight),
  { ssr: false }
);

const LoginPage = () => {
  return (
    <div className=" relative flex flex-col  items-center justify-center md:pt-7 md:my-0  gap-3 min-h-svh md:h-screen font-sans background px-4  overflow-y-auto md:overflow-y-hidden ">
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
            <h1 className="text-3xl md:text-4xl font-bold font-primary tracking-tight text-heading">
              Welcome back, Mama
            </h1>
            <p className="text-sub font-secondary font-medium ">
              You're not alone. This is your safe space.
            </p>
          </div>
          {/*   login form section */}

          <div className="mt-2 flex flex-col items-center justify-center rounded-4xl w-auto max-h-fit gap-3 bg-card/70 backdrop-blur-md md:gap-3 md:w-auto">
            <div className="w-full h-1 mt-0.5 bg-linear-to-r from-transparent via-accent/40 to-transparent"></div>
            {/* <div className="absolute top-0 left-0 w-full h-1 bg-[#e28e9b] from-transparent via-accent to-transparent opacity-50"></div> */}
            <div className="flex flex-col pt-3 pl-4 pr-4 gap-3 md:gap-4 w-full max-w-sm">
              <Input
                label="Email Address"
                placeholder="preeti@gmail.com"
                icon={
                  <Mail
                    size={18}
                    className="flex text-center justify-center w-full"
                  />
                }
              ></Input>
              <Input
                label="Password"
                placeholder="••••••••"
                icon={<LockKeyhole size={20} />}
                rightElement={
                  <a
                    href="#"
                    className="text-xs font-bold text-link hover:underline"
                  >
                    Forgot password?
                  </a>
                }
              ></Input>
              <Button className="w-full  mt-1 mb-2 font-bold  gap-3 text-white ">
                Log in{" "}
                <span>
                  {" "}
                  <FaArrowRight size={16} />
                </span>{" "}
              </Button>

              <div className="relative flex py-1 items-center mb-1">
                <div className="grow border-t border-accent/50"></div>
                <span className="shrink-0  text-xs font-medium tracking-wide text-seperator uppercase">
                  or log in with email
                </span>
                <div className="grow border-t border-accent/50"></div>
              </div>

              <Button variant="google" className="w-full pt-2 pb-2 py-3">
                <FcGoogle size={20} />
                Continue with Google
              </Button>

              {/* footer of login page */}
            </div>

            <div className="flex flex-col items-center justify-center text-sm mt-2 pt-3 pb-2 md:pt-5 md:pb-3 rounded-b-4xl border-t-0.5 border-google-border bg-[#fae4eb]  w-full">
              <p>
                {" "}
                New ?
                <span>
                  <a href="#" className="text-link hover:underline font-bold ">
                    {" "}
                    Register Here!
                  </a>
                </span>
              </p>
            </div>
          </div>
          <div className="text-sm flex flex-row  gap-2 md:mt-2    items-center justify-center  font-primary font-medium  text-seperator">
            <span>
              <LockKeyhole size={15} />
            </span>
            <span> Your data is safe and completely private.</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
