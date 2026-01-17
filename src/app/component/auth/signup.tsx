"use client";

import React, { FormEvent, useEffect } from "react";
import { Headset, LockKeyhole, Mail, MailIcon, UserCircle, Heart } from "lucide-react";
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

import axios from "axios";
import { toast } from "react-toastify";
import { useRegisterUserMutation } from "../../redux/services/authApi";
import { useAppDispatch } from "../../Hooks/hook";
import { setCredientials } from "../../redux/feature/user/userSlice";

const FcGoogle = dynamic(
  () => import("react-icons/fc").then((m) => m.FcGoogle),
  { ssr: false }
);
const FaArrowRight = dynamic(
  () => import("react-icons/fa").then((m) => m.FaArrowRight),
  { ssr: false }
);

interface SignupFormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string; // Add role to the type
}

const initialState: SignupFormState = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "", // Added role field
};

const SignupForm = () => {
  const [formValue, setFormValue] = React.useState(initialState);
  const { name, email, password, confirmPassword, role } = formValue;

  const router = require("next/navigation").useRouter();
  const dispatch = useAppDispatch();
  const [registerUser, { data, isSuccess, isError, error }] =
    useRegisterUserMutation();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!role) {
      return alert("Please select your role");
    }

    if (password !== confirmPassword) {
      console.log("Passwords do not match");
      return alert("Passwords do not match");
    }

    if (name && email && password && confirmPassword && role) {
      await registerUser({ name, email, password, confirmPassword, role });
    }
    if (isError) {
      console.log("Error during registration:", error);
      alert(error);


    }
  };

  useEffect(() => {
    if (isSuccess) {
      alert("Registration Successful");
      console.log("Registered user data:", data);
      dispatch(
        setCredientials({
          userName: data.userName,
          email: data.email,
          access_token: data.access_token,
          refreshToken: data.refreshToken,
          userId: data.userId,
          role: data.role,
        })
      );

      setFormValue(initialState);
      console.log("Registration successful");
      router.push("/");
    }
  }, [isSuccess]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (selectedRole: string) => {
    setFormValue({ ...formValue, role: selectedRole });
  };

  return (
    <>
      <div className="relative justify-items-center w-full md:max-w-md lg:max-w-full gap-3 font-sans background px-4 overflow-y-auto md:overflow-hidden">
        <BlobBackground />

        <div className="flex flex-col gap-1 md:gap-1 mb-2 md:mb-2 items-center justify-left">
          <h1 className="text-3xl md:text-2xl font-bold text-amber-950/80 text-heading">
            Create your Account
          </h1>
          <p className="text-sm font-secondary text-amber-950/80 font-medium">
            You're not alone in this journey.
          </p>
        </div>

        <div className="bg-white px-8 py-4 md:px-10 md:py-4 md:pt-2 md:mx-3 rounded-[32px] shadow-2xl shadow-primary/5 w-full max-w-full border border-white flex flex-col gap-2">
          <form
            action="post"
            onSubmit={handleSubmit}
            className="w-full px-3 md:px-5"
          >
            <div className="flex flex-col pt-2 gap-3 md:gap-3 w-full max-w-full md:max-w-full">

              {/* Role Selection Section */}
              <div className="flex flex-col gap-2 md:gap-2">
                <Label className="light:text-popover font-semibold">
                  Who are you?
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleRoleSelect("mother")}
                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${role === "mother"
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-gray-200 hover:border-primary/50"
                      }`}
                  >
                    <UserCircle
                      size={32}
                      className={role === "mother" ? "text-primary" : "text-gray-400"}
                    />
                    <span className="font-semibold text-sm">Mother</span>
                    <span className="text-xs text-primary text-center">
                      I need support
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleSelect("contributor")}
                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${role === "contributor"
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-gray-200 hover:border-primary/50"
                      }`}
                  >
                    <Heart
                      size={32}
                      className={
                        role === "contributor" ? "text-primary" : "text-gray-400"
                      }
                    />
                    <span className="font-semibold text-sm">Contributor</span>
                    <span className="text-xs text-primary text-center">
                      I want to help
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2 md:gap-1">
                <Label
                  htmlFor="name"
                  className="light:text-popover font-semibold"
                >
                  Name
                </Label>

                <InputGroup>
                  <InputGroupInput
                    value={name}
                    onChange={handleChange}
                    type="text"
                    name="name"
                    placeholder="Preeti Sharma"
                  />
                  <InputGroupAddon>
                    <MailIcon
                      size={18}
                      className="flex text-center justify-center w-full"
                    />
                  </InputGroupAddon>
                </InputGroup>
              </div>

              <div className="flex flex-col gap-2 md:gap-2">
                <Label
                  htmlFor="email"
                  className="light:text-popover font-semibold"
                >
                  Email Address
                </Label>

                <InputGroup>
                  <InputGroupInput
                    value={email}
                    onChange={handleChange}
                    type="email"
                    name="email"
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

              <div className="flex flex-col gap-2 md:gap-2">
                <Label
                  htmlFor="password"
                  className="light:text-popover font-semibold"
                >
                  Create a Password
                </Label>

                <InputGroup>
                  <InputGroupInput
                    value={password}
                    onChange={handleChange}
                    type="password"
                    name="password"
                    placeholder="••••••••"
                  />
                  <InputGroupAddon>
                    <LockKeyhole
                      size={20}
                      className="flex text-center justify-center w-full"
                    />
                  </InputGroupAddon>
                </InputGroup>
              </div>

              <div className="flex flex-col gap-2 md:gap-2">
                <Label
                  htmlFor="confirm-password"
                  className="light:text-popover font-semibold"
                >
                  Confirm Password
                </Label>

                <InputGroup>
                  <InputGroupInput
                    value={confirmPassword}
                    onChange={handleChange}
                    type="password"
                    name="confirmPassword"
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

              <Button className="max-w-full md:min-w-max md:mt-1 md:mb-2 font-bold gap-3 text-white">
                Sign Up{" "}
                <span>
                  {" "}
                  <FaArrowRight size={16} />
                </span>{" "}
              </Button>

              <div className="relative flex py-1 items-center mb-1">
                <div className="grow border-t border-accent/50"></div>
                <span className="shrink-0 text-xs font-medium tracking-wide text-gray-600 uppercase pr-1">
                  or log in with email
                </span>
                <div className="pl-1 grow border-t border-accent/50"></div>
              </div>

              <Button variant="google" className="w-full pt-2 pb-2 py-3">
                <FcGoogle size={20} />
                Continue with Google
              </Button>
            </div>
          </form>

          <div className="flex flex-col items-center justify-center text-sm md:mt-2 py-1 md:pt-2 gap-2 w-full">
            <p>
              Already part of us?
              <span>
                <Link
                  href="/login"
                  className="text-link hover:underline text-primary text-md text-center font-bold"
                >
                  {" "}
                  Log In
                </Link>
              </span>
            </p>
          </div>
        </div>
        <div className="text-sm flex flex-row gap-2 md:mt-1 items-center justify-center font-primary font-medium text-seperator">
          <span>
            <LockKeyhole size={15} />
          </span>
          <span> Your data is safe and completely private.</span>
        </div>
      </div>
    </>
  );
};

export default SignupForm;