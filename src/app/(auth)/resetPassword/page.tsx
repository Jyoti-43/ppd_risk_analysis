"use client";
import React, { useEffect, useState } from "react";
import { ArrowLeft, Eye, LockKeyhole, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import BlobBackground from "../../common/ui/backgroundblob";

import { Label } from "@radix-ui/react-label";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { resetPassword } from "../../redux/feature/user/userSlice";
import { reset_Password } from "../../redux/feature/user/userSlice";

import { useAppDispatch, useAppSelector } from "../../Hooks/hook";
import Link from "next/link";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [token, setToken] = useState("");
  const dispatch = useAppDispatch();
  const { success } = useAppSelector((state) => state.user.resetPassword);
  const router = require("next/navigation").useRouter();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    dispatch(resetPassword({ token, newPassword }));

    dispatch(reset_Password());
    // Handle password reset logic here
  };
  useEffect(() => {
    if (success) {
      setNewPassword("");
      setToken("");
      router.push("/login");
    }
  }, [success, router]);

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
            <Link href="/login"> Back to Login </Link>
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
            Create a password that feels safe and easy to remember. <br /> We're
            here to keep your journey secure.
          </p>
        </div>

        <div className="mt-2  flex flex-col items-center justify-center rounded-4xl w-auto max-h-fit gap-4 pb-4 md:gap-3 bg-card/70 backdrop-blur-md md:w-md  ">
          <div className="w-full h-1 mt-0.5  bg-linear-to-r from-transparent via-accent/40 to-transparent"></div>

          <form action="http" method="post" onSubmit={handleSubmit}>
            <div className="flex flex-col pt-2 pl-4 py-2 pr-4 gap-5 w-full  max-w-sm">
              <Label htmlFor="picture"> New Password</Label>

              <InputGroup>
                <InputGroupInput
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="choose a gental , strong password"
                  required
                />
                <InputGroupAddon>
                  <LockKeyhole size={20} />
                </InputGroupAddon>
              </InputGroup>
              <Label htmlFor="picture"> Token</Label>

              <InputGroup>
                <InputGroupInput
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="enter your token from email"
                  required
                />
                <InputGroupAddon>
                  <ShieldCheck size={20} />
                </InputGroupAddon>
              </InputGroup>

              <Button className="w-full md:mb-4  mt-2 md:mt-4 md: mb-2 md:font-semibold font-normal  gap-3 md:text-md text-white  ">
                Update Password
              </Button>
            </div>
          </form>
        </div>
      </main>
      {/* login form here */}
    </div>
    // </div>
  );
};

export default ResetPassword;
