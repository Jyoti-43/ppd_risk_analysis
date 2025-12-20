import React from "react";
import Input from "../common/ui/input";
import Button from "../common/ui/button";
import {
  ArrowLeft,
  Eye,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import BlobBackground from "../common/ui/backgroundblob";

const ResetPassword = () => {
  return (
    <div className=" relative flex flex-col justify-center items-center md:pt-5 mt-2 md:my-0  h-svh md:h-screen font-sans background px-2 overflow-y-auto md:overflow-y-hidden">
      {/* for header section, logo emergency support contact */}
      <nav className="flex  flex-row justify-between items-center w-full max-w-6xl mb-4  px-3">
        <div className="text-lg font-semibold font-seperator text-primary">
          Logo
        </div>
        <div className=" flex flex-row gap-2 text-sm font-medium text-seperator">
          <Button className="flex flex-row w-full py-2 px-3 mt-2 md:mt-4 mb-2 md:font-semibold font-normal bg-white/70 gap-3 md:text-md  text-sub hover:text-white ">
            <span>
              <ArrowLeft size={18} />
            </span>
            Back to Login
          </Button>
        </div>
      </nav>
      <BlobBackground />

      {/* this dev for the container of login page welcome message plus form  */}
      <main className="flex flex-col gap-2 justify-center flex-1">
        
        {/* <div className="mb-8 flex flex-col gap-2"> */}
        <div className="flex flex-col gap-2 md:gap-2 mb-4 md:mb-3 text-center items-center justify-center">
          <h1 className="text-3xl md:text-4xl font-bold font-primary tracking-tight text-heading">
            Set New Password
          </h1>
          <p className="text-sub font-secondary font-medium ">
            Create a password that feels safe and easy to remember. <br />{" "} We're
            here to keep your journey secure.
          </p>
        </div>

        <div className="mt-2  flex flex-col items-center justify-center rounded-4xl w-auto max-h-fit gap-4 pb-4 md:gap-3 bg-card/70 backdrop-blur-md md:w-md  ">
          <div className="w-full h-1 mt-0.5  bg-linear-to-r from-transparent via-accent/40 to-transparent"></div>

          <div className="flex flex-col pt-2 pl-4 py-2 pr-4 gap-5 w-full  max-w-sm">
            <Input
              label="New Password"
              placeholder="choose a gental , strong password"
              icon={<LockKeyhole size={20} />}
              trailingIcon={<Eye size={16} />}
            ></Input>
            <Input
              label="Confirm Password"
              placeholder="re-enter your new password"
              icon={<ShieldCheck size={20} />}
            ></Input>
            <Button className="w-full md:mb-4  mt-2 md:mt-4 md: mb-2 md:font-semibold font-normal  gap-3 md:text-md text-white  ">
              Update Password
            </Button>
          </div>
        </div>
      </main>
      {/* login form here */}
    </div>
    // </div>
  );
};

export default ResetPassword;
