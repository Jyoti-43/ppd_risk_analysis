"use client";
import React, { useEffect, useState } from "react";

import {
  ChevronLeft,
  Headset,
  LockKeyhole,
  Mail,
  MailIcon,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaArrowRight } from "react-icons/fa";
import { IoHeartCircle } from "react-icons/io5";

import { Button } from "@/components/ui/button";

import { Label } from "@/components/ui/label";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import BlobBackground from "../../common/ui/backgroundblob";
import Link from "next/link";
import { forgotPassword } from "../../redux/feature/user/userSlice";
import { forgot_Password } from "../../redux/feature/user/userSlice";

import { useAppDispatch, useAppSelector } from "../../Hooks/hook";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const dispatch = useAppDispatch();
  const { loading, success, error } = useAppSelector(
    (state) => state.user.forgotPassword
  );
  const router = require("next/navigation").useRouter();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
    dispatch(forgot_Password());
  };

  useEffect(() => {
    if (success) {
      setEmail("");
      router.push("/resetPassword");
    }
  }, [success, router]);

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
          <Link href="/">Back to home</Link>
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
            <form
              action="http"
              method="Post"
              onSubmit={handleSubmit}
              className="flex flex-col gap-2"
            >
              <Label htmlFor="picture">Enter Your Email</Label>

              <InputGroup>
                <InputGroupInput
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
                <InputGroupAddon>
                  <MailIcon />
                </InputGroupAddon>
              </InputGroup>
              <div className="text-xs flex flex-row  items-center justify-center  font-primary font-medium md:mb-2  text-seperator">
                We'll help you get back to your account safely
              </div>

              <Button
                disabled={loading}
                className="w-full  mt-2 md:mt-4 mb-2 md:font-semibold font-normal  gap-3 md:text-md text-white  "
              >
                {loading ? "Sending..." : "Send Reset Link"}
                <span>
                  {" "}
                  <FaArrowRight size={16} />
                </span>{" "}
              </Button>
              {success && <div>Password reset link sent!</div>}
              {error && <div>{error}</div>}
            </form>
            <div className="relative flex py-1 items-center mb-2">
              <div className="grow border-t border-accent/50 mr-2"></div>
              <span className="shrink-0  text-xs font-medium tracking-wide text-seperator uppercase">
                or
              </span>
              <div className="grow border-t border-accent/50 ml-2"></div>
            </div>

            <div className="flex flex-col gap-3 mb-4 text-center items-center justify-center">
              <h1 className="flex flex-row items-center gap-2 text-center text-md md:text-md font-bold text-sub tracking-tight ">
                <span>
                  <ChevronLeft size={21} className="" />
                </span>
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
