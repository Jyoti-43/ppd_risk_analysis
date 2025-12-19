import React from "react";
import Input from "../common/ui/input";
import Button from "../common/ui/button";
import { LockKeyhole, Mail } from "lucide-react";
import { FcGoogle } from "react-icons/fc";


const LoginPage = () => {
  return (
    <div className=" relative flex flex-col  items-center justify-center  h-screen font-sans background px-4 overflow-hidden">
      {/* for header section, logo emergency support contact */}
      {/* top-right Blob */}
      <div className="absolute bottom-[5%] left-[15%] -z-10 animate-float opacity-40 text-accent" style={{ animationDelay: "2s" }}>
        <svg width="350" height="350" viewBox="0 0 200 200">
          {/* Paste your SVG path here */}
          <path
            fill="currentColor"
            d="M40,-50C52,-40,62,-26,65,-10C68,5,64,22,55,36C45,50,31,61,15,64C-1,67,-18,63,-32,54C-46,45,-56,31,-61,15C-66,-1,-66,-18,-58,-32C-50,-46,-34,-57,-18,-62C-2,-67,14,-66,40,-50Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>

      {/* Bottom-Left Blob */}
      <div
        className="absolute  top-[5%] right-[15%] -z-10 animate-float opacity-30 text-button"
        style={{ animationDelay: "2s" }}
      >
        <svg width="300" height="300" viewBox="0 0 200 200">
          {/* Paste your SVG path here */}
          <path
            fill="currentColor"
            d="M44,-62C56,-54,64,-40,68,-25C72,-10,72,5,67,19C62,33,52,45,39,54C26,63,10,69,-6,72C-22,75,-44,75,-58,66C-72,57,-78,39,-79,22C-80,5,-76,-11,-68,-25C-60,-39,-48,-51,-34,-58C-20,-65,-5,-67,11,-62Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>
      {/* this dev for the container of login page welcome message plus form  */}
      <div className="flex flex-col gap-2">
        <div className="mb-8 flex flex-col gap-2">
          <div className="flex flex-col gap-3 mb-4 text-center items-center justify-center">
            <h1 className="text-3xl md:text-4xl font-bold font-primary tracking-tight text-heading">
              Welcome back, Mama
            </h1>
            <p className="text-sub font-secondary font-medium ">
              You're not alone. This is your safe space.
            </p>
          </div>

          <div className="mt-2 flex flex-col items-center justify-center rounded-4xl w-auto max-h-fit gap-3 bg-card/70 backdrop-blur-md">
            <div className="w-full h-1 mt-0.5 bg-linear-to-r from-transparent via-accent/40 to-transparent"></div>
            {/* <div className="absolute top-0 left-0 w-full h-1 bg-[#e28e9b] from-transparent via-accent to-transparent opacity-50"></div> */}
            <div className="flex flex-col pt-3 pl-4 pr-4 gap-5 w-full max-w-sm">
              <Input
                label="Email Address"
                placeholder="preeti@gmail.com"
               
                icon={  <Mail  size={18}   className="flex text-center justify-center w-full"/>}
              ></Input>
              <Input
                label="Password"
                placeholder="••••••••"
                icon={<LockKeyhole  size={20}/>}
                rightElement={
                  <a
                    href="#"
                    className="text-xs font-bold text-link hover:underline"
                  >
                    Forgot password?
                  </a>
                }
              ></Input>
              <Button className="w-full  mt-1 mb-2 ">Log in </Button>

              <div className="relative flex py-1 items-center mb-1">
                <div className="grow border-t border-accent/50"></div>
                <span className="shrink-0  text-xs font-medium tracking-wide text-seperator uppercase">
                  or log in with email
                </span>
                <div className="grow border-t border-accent/50"></div>
              </div>

              <Button variant="google" className="w-full pt-2 pb-2">
                <FcGoogle  size={20}/>
                Continue with Google
              </Button>

              {/* footer of login page */}
            </div>

            <div className="flex flex-col items-center justify-center text-sm mt-2 pt-6 pb-4 rounded-b-4xl border-t-0.5 border-google-border bg-[#fae4eb]  w-full">
              <p>
                {" "}
                New here?
                <span>
                  <a href="#" className="text-link hover:underline font-bold ">
                    {" "}
                    Join our Community!
                  </a>
                </span>
              </p>
            </div>
          </div>
          <div className="text-sm flex flex-row  gap-2 items-center justify-center pt-2 font-primary font-medium  text-seperator">
            <span><LockKeyhole  size={15}/></span>
            <p>  Your data is safe and completely private.</p>
          </div>
        </div>
        {/* login form here */}
      </div>
    </div>
  );
};

export default LoginPage;
