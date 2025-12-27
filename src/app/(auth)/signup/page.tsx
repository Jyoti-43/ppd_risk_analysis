"use client";
import React from "react";
import { Headset, LockKeyhole, Mail, MailIcon } from "lucide-react";
import dynamic from "next/dynamic";
import BlobBackground from "../../common/ui/backgroundblob";
import { Label } from "@radix-ui/react-label";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";

const FcGoogle = dynamic(
  () => import("react-icons/fc").then((m) => m.FcGoogle),
  { ssr: false }
);
const FaArrowRight = dynamic(
  () => import("react-icons/fa").then((m) => m.FaArrowRight),
  { ssr: false }
);

const SignUp = () => {
  return (
    <div className=" relative grid grid-row justify-items-center  md:pt-3  pt-3 md:my-0  gap-3 min-h-svh md:h-screen font-sans background px-4 pr-6  overflow-y-auto md:overflow-hidden ">
      <nav className="flex  flex-row justify-between items-center w-full max-w-4xl md:max-w-6xl  mt-2  px-3 md:mb-2 md:mt-2">
        <div className="text-lg font-semibold font-seperator text-primary">
          Logo
        </div>
        <div className=" flex flex-row gap-2 text-sm font-semibold text-accent">
          <span>
            {" "}
            <Headset size={18} />
          </span>
          Need Help? Call{" "}
        </div>
      </nav>

      <BlobBackground />

      {/* main content */}
      <main className="grid  grid-flow-col  grid-row-2 justify-items-center w-lvw  md:min-w-md lg:max-w-lg gap-8 md:gap-16 lg:gap-24 items-center">
        <div className="w-full">image here</div>

        <div className="w-full max-w-sm md:max-w-lg lg:max-w-2xl">
          <div className="mb-5 px-0 flex flex-col gap-1 md:gap-2 md:mb-3 md:w-full">
            <div className="md:mt-2 mt-1 md:px-6 md:m-5 flex flex-col  justify-center rounded-4xl  max-h-fit gap-2   md:gap-2 w-full max-w-sm md:max-w-md bg-card/70 shadow-md ">
              <div className="flex flex-col gap-2 md:gap-1 mb-1 mt-2 md:mb-1  items-left justify-left">
                <h1 className="text-3xl md:text-2xl font-bold font-primary  text-heading ">
                  Create your Account
                </h1>
                <p className="text-sub font-secondary font-medium text-left  ">
                  You're not alone in this journey.
                </p>
              </div>
              <div className="flex flex-col pt-2  pr-4 gap-3 md:gap-3 w-full max-w-sm md:max-w-md">
                {/* <div className="grid grid-flow-row grid-cols-2 gap-5 w-full"> */}
                <div className="flex flex-col gap-2 md:gap-1 ">
                  <Label
                    htmlFor="name"
                    className="light:text-popover font-semibold"
                  >
                    Name
                  </Label>

                  <InputGroup>
                    <InputGroupInput type="name" placeholder="Preeti Sharma" />
                    <InputGroupAddon>
                      <MailIcon
                        size={18}
                        className="flex text-center justify-center w-full"
                      />
                    </InputGroupAddon>
                  </InputGroup>
                </div>

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

                <div className="flex flex-col gap-2 md:gap-2 ">
                  <Label
                    htmlFor="password"
                    className="light:text-popover font-semibold"
                  >
                    Create a Password
                  </Label>

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

                <div className="flex flex-col gap-2 md:gap-2 ">
                  <Label
                    htmlFor="confirm-password"
                    className="light:text-popover font-semibold"
                  >
                    Confirm Password
                  </Label>

                  <InputGroup>
                    <InputGroupInput
                      type="confirm-password"
                      placeholder="••••••••"
                    ></InputGroupInput>
                    <InputGroupAddon>
                      <LockKeyhole
                        size={20}
                        className="flex text-center justify-center w-full"
                      />
                    </InputGroupAddon>
                  </InputGroup>
                </div>
                {/* </div> */}

                <Button className="max-w-full md:min-w-max  md:mt-1  md:mb-2 font-bold  gap-3 text-white ">
                  Sign Up{" "}
                  <span>
                    {" "}
                    <FaArrowRight size={16} />
                  </span>{" "}
                </Button>

                <div className="relative flex py-1 items-center mb-1">
                  <div className="grow border-t border-accent/50"></div>
                  <span className="shrink-0  text-xs font-medium tracking-wide text-gray-600 uppercase pr-1">
                    or log in with email
                  </span>
                  <div className="pl-1 grow border-t border-accent/50"></div>
                </div>

                <Button variant="google" className="w-full pt-2 pb-2 py-3">
                  <FcGoogle size={20} />
                  Continue with Google
                </Button>

                {/* footer of login page */}
              </div>

              <div className="flex flex-col items-center justify-center text-sm md:mt-2 py-1 md:pt-2 md:pb-2   w-full">
                <p>
                  {" "}
                  Already part of us?
                  <span>
                    <a
                      href="#"
                      className="text-link hover:underline text-md font-bold "
                    >
                      {" "}
                      Log in here
                    </a>
                  </span>
                </p>
              </div>
            </div>
            <div className="text-sm flex flex-row  gap-2 md:mt-1  items-center justify-center  font-primary font-medium  text-seperator">
              <span>
                <LockKeyhole size={15} />
              </span>
              <span> Your data is safe and completely private.</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignUp;
