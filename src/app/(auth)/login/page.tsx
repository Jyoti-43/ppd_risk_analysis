"use client";
import React, { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { Headset, LockKeyhole, Mail, MailIcon } from "lucide-react";

import {  toast } from 'react-toastify'
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

import { useLoginUserMutation } from "../../redux/services/authApi";
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

const LoginPage = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const router = require("next/navigation").useRouter();
  const dispatch = useAppDispatch();

  const [loginUser, { data, isSuccess, isError, error }] =
    useLoginUserMutation();
  // const { currentUser, isLoggedIn, status } = useSelector(
  //   (state: RootState) => state.user
  // );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (email && password) {
        await loginUser({ email, password });
        router.push("/");
        console.log("Login successful");
        setEmail("");
        setPassword("");
      }

      // Login successful, redirect or show success message
    } catch (err) {
      // Handle error
      toast.error("Login failed. Please try again.");
      console.error("Login failed:", err);
    }
  };

  useEffect(() => {
    if(isSuccess){
      toast.success("Login Successful");
      dispatch(setCredientials({
        userId: data.userId,
        access_token: data.access_token,
        refreshToken: data.refreshToken,
        email: data.email
      }));
       
      router.push("/");
    }
  
  }, [ isSuccess]);

  return (
    <>
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
              <div className="w-full h-1 mt-0.5 bg-linear-to-r from-transparent via-primary/30 to-transparent rounded-4xl"></div>
              {/* <div className="absolute top-0 left-0 w-full h-1 bg-[#e28e9b] from-transparent via-accent to-transparent opacity-50"></div> */}
              <form
                action="post"
                onSubmit={handleSubmit}
                className="w-full px-8"
              >
                <div className="flex flex-col pt-3  gap-2 md:gap-3 w-full max-w-md">
                  <div className="flex flex-col gap-2 md:gap-2 ">
                    <Label
                      htmlFor="email"
                      className="light:text-popover font-semibold"
                    >
                      Email Address
                    </Label>

                    <InputGroup>
                      <InputGroupInput
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        name="email"
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
                    <InputGroupInput
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      name="password"
                      type="password"
                      placeholder="••••••••"
                    />
                    <InputGroupAddon>
                      <LockKeyhole
                        size={20}
                        className="flex text-center justify-center w-full"
                      />
                    </InputGroupAddon>
                  </InputGroup>

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
              </form>

              <div className="flex flex-col items-center justify-center text-sm mt-2 pt-3 pb-2 md:pt-5 md:pb-3 md:mt-3 rounded-b-4xl border-t-0.5 border-google-border bg-[#f9ebef]  w-full">
                <p>
                  {" "}
                  New ?
                  <span>
                    <Link
                      href="/signup"
                      className="text-primary hover:underline font-bold "
                    >
                      {" "}
                      Register Here!
                    </Link>
                  </span>
                </p>
              </div>
            </div>
            <div className="text-xs flex flex-row  gap-2 md:mt-2 items-center justify-center  text-gray-500 font-medium  text-seperator">
              <span>
                <LockKeyhole
                  size={12}
                  strokeWidth={2}
                  className="text-primary"
                />
              </span>
              <span> Your data is safe and completely private.</span>
            </div>
          </div>
        </main>
      </div>
      <div></div>
    </>
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
