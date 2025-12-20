import React from "react";
import Input from "../common/ui/input";
import Button from "../common/ui/button";
import { ChevronLeft, Headset, LockKeyhole, Mail } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaArrowRight } from "react-icons/fa";
import { IoHeartCircle } from "react-icons/io5";
import BlobBackground from "../common/ui/backgroundblob";

const ForgotPassword = () => {
  return (
    <div className=" relative flex flex-col justify-center items-center md:pt-7 mt-2 md:my-0  h-svh md:h-screen font-sans background px-2 overflow-y-auto md:overflow-y-hidden">
      {/* for header section, logo emergency support contact */}
      <nav className="flex  flex-row justify-between items-center w-full max-w-6xl mb-4  px-3">
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
      {/* this dev for the container of login page welcome message plus form  */}
      <main className="flex flex-col gap-2 justify-center flex-1">
        {/* <div className="mb-8 flex flex-col gap-2"> */}
          <div className="mt-2  flex flex-col items-center justify-center rounded-4xl w-auto max-h-fit gap-2 md:gap-3 bg-card/70 backdrop-blur-md md:w-md  ">
            <div className="w-full h-1 mt-0.5  bg-linear-to-r from-transparent via-accent/40 to-transparent"></div>

            <div className="flex flex-col gap-2 mb-3 text-center items-center justify-center">
              <h1 className="text-lg md:text-xl font-bold font-primary tracking-tight text-heading">
                Forgot Password?
              </h1>
              <div className="flex flex-col text-xs md:text-sm gap-1">
                <p className="text-sub font-secondary font-medium ">
                  Don't worry, mama. It happens!
                </p>
                <p className="text-sub font-secondary font-medium ">
                  Enter your email to reset your password.
                </p>
              </div>
            </div>

            <div className="flex flex-col pt-2 pl-4 pr-4 gap-2 w-full  max-w-sm">
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
              <div className="text-xs flex flex-row  items-center justify-center  font-primary font-medium md:mb-2  text-seperator">
                We'll help you get back to your account safely
              </div>
              <Button className="w-full  mt-2 md:mt-4 mb-2 md:font-semibold font-normal  gap-3 md:text-md text-white  ">
                Send Reset Link{" "}
                <span>
                  {" "}
                  <FaArrowRight size={16} />
                </span>{" "}
              </Button>

              <div className="relative flex py-1 items-center mb-2">
                <div className="grow border-t border-accent/50 mr-2"></div>
                <span className="shrink-0  text-xs font-medium tracking-wide text-seperator uppercase">
                  or
                </span>
                <div className="grow border-t border-accent/50 ml-2"></div>
              </div>

              <div className="flex flex-col gap-3 mb-4 text-center items-center justify-center">
                <h1 className="flex flex-row items-center gap-2 text-center text-md md:text-md font-bold text-sub tracking-tight ">
                <span><ChevronLeft size={21} className="" /></span>
                  Back to Login
                </h1>
              </div>

              {/* footer of login page */}
            </div>
          </div>
          
        </main>
        {/* login form here */}
      </div>
    // </div>
  );
};

export default ForgotPassword;
