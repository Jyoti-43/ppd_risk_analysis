"use client";
import React, { Suspense, useEffect } from "react";
import { LockKeyhole, Mail, MailIcon } from "lucide-react";
import { toast } from "react-toastify";
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
import { cn } from "@/lib/utils";

import {
  useLoginUserMutation,
  useVerifyPartnerOtpMutation,
} from "../../redux/services/authApi";
import { useAppDispatch } from "../../Hooks/hook";
import { setCredientials } from "../../redux/feature/user/userSlice";
import { communityPost } from "../../redux/services/communityPostApi";
import { communityGroup } from "../../redux/services/communityGroupApi";
import { screeningAPI } from "../../redux/services/screeningApi";
import { groupPost } from "../../redux/services/groupPostApi";
import {
  useInvitePartnerMutation,
  useGetInvitedPartnersQuery,
  useGetLinkedMotherProfileQuery,
  useLazyGetLinkedMotherProfileQuery,
  userDashboardApi,
} from "../../redux/services/userDashboardApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useRouter, useSearchParams } from "next/navigation";
import { OTPInput, SlotProps } from "input-otp";

const FcGoogle = dynamic(
  () => import("react-icons/fc").then((m) => m.FcGoogle),
  { ssr: false },
);
const FaArrowRight = dynamic(
  () => import("react-icons/fa").then((m) => m.FaArrowRight),
  { ssr: false },
);

const LoginForm = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isOtpOpen, setIsOtpOpen] = React.useState(false);
  const [otp, setOtp] = React.useState("");

  const router = useRouter();
  const dispatch = useAppDispatch();

  const [loginUser, { data, isSuccess, isError, error }] =
    useLoginUserMutation();
  const [verifyOtp, { isLoading: isVerifying, isSuccess: isVerifySuccess }] =
    useVerifyPartnerOtpMutation();
  const [triggerGetLinkedMothers] = useLazyGetLinkedMotherProfileQuery();

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (email && password) {
      await loginUser({ email, password });
      // Don't navigate here - let useEffect handle it after success
    }
  };

  const handleOtpSubmit = async () => {
    if (otp.length !== 8) {
      toast.error("Please enter an 8-digit OTP");
      return;
    }

    try {
      const res = await verifyOtp({
        invite_code: otp,
      }).unwrap();
      console.log("OTP Verified Successfully:", res);

      // Normalize response fields for Partner
      const accessToken = res.access_token || res.accessToken || null;
      const refreshToken = res.refreshToken || res.refresh_token || null;
      const userId = res.user?.id ?? res.userId ?? null;
      const userName = res.user?.name ?? res.userName ?? null;
      const emailResp = res.user?.email ?? res.email ?? null;

      dispatch(
        setCredientials({
          userId: userId || "",
          userName: userName || "",
          email: emailResp || "",
          access_token: accessToken || "",
          refreshToken: refreshToken || "",
          role: res.role || "partner",
          is_verified: true, // If they verified OTP, they are verified
        }),
      );

      toast.success("OTP Verified Successfully");
      setIsOtpOpen(false);
      router.push("/dashboard/partner");
    } catch (err: any) {
      console.error("OTP Verification Error:", err);
      const detail = err?.data?.detail || err?.data?.message || "";

      // If the code was already used, it means they are already verified
      if (
        detail.includes("already been used") ||
        detail.includes("already verified")
      ) {
        // Update credentials to mark as verified
        if (data) {
          const accessToken = data.access_token || data.accessToken || null;
          const refreshToken = data.refreshToken || data.refresh_token || null;
          const userId = data.user?.id ?? data.userId ?? null;
          const userName = data.user?.name ?? data.userName ?? null;
          const emailResp = data.user?.email ?? data.email ?? null;

          dispatch(
            setCredientials({
              userId: userId || "",
              userName: userName || "",
              email: emailResp || "",
              access_token: accessToken || "",
              refreshToken: refreshToken || "",
              role: data.role || "partner",
              is_verified: true,
            }),
          );
        }

        toast.success("Identity already verified");
        setIsOtpOpen(false);
        router.push("/dashboard/partner");
        return;
      }

      toast.error(detail || "Invalid OTP. Please try again.");
    }
  };

  useEffect(() => {
    if (isSuccess && data) {
      toast.success("Login Successful");
      // Normalize response fields (support snake_case or camelCase from backend)
      const accessToken = data.access_token || data.accessToken || null;
      const refreshToken = data.refreshToken || data.refresh_token || null;
      const userId = data.user?.id ?? data.userId ?? null;
      const userName = data.user?.name ?? data.userName ?? null;
      const emailResp = data.user?.email ?? data.email ?? null;

      console.debug("Login response normalized:", {
        userId,
        userName,
        email: emailResp,
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken,
      });

      const userRoleAttr = (data.role || "").toLowerCase();
      console.log("User Role for redirection:", userRoleAttr);

      dispatch(
        setCredientials({
          userId,
          userName,
          email: emailResp,
          access_token: accessToken || "",
          refreshToken: refreshToken || "",
          role: userRoleAttr,
          is_verified:
            data.user?.is_verified === true ||
            data.is_verified === true ||
            (data.user?.is_verified as any) === 1 ||
            (data.is_verified as any) === 1 ||
            data.user?.status === "active" ||
            data.status === "active",
        }),
      );

      dispatch(communityPost.util.resetApiState());
      dispatch(communityGroup.util.resetApiState());
      dispatch(screeningAPI.util.resetApiState());
      dispatch(groupPost.util.resetApiState());
      dispatch(userDashboardApi.util.resetApiState());

      if (userRoleAttr !== "partner") {
        setEmail("");
      }
      setPassword("");

      const setupCompleted = localStorage.getItem(`setup_completed_${userId}`);
      if (userRoleAttr === "contributor" && !setupCompleted) {
        router.push("/dashboard/contributor/profile-setup");
      } else if (userRoleAttr === "admin") {
        router.push("/dashboard/admin");
      } else if (userRoleAttr === "partner") {
        // Broad verification check including numerical and status based
        const isPartnerVerifiedDirectly =
          data.user?.is_verified === true ||
          data.is_verified === true ||
          (data.user?.is_verified as any) === 1 ||
          (data.is_verified as any) === 1 ||
          data.user?.status === "active" ||
          data.status === "active";

        const checkPartnerStatus = async () => {
          try {
            // Check if they have linked mothers
            const mothersResponse = await triggerGetLinkedMothers().unwrap();

            // If they have any linked mothers, they are effectively verified for skipping OTP
            const hasMothers =
              mothersResponse &&
              (Array.isArray(mothersResponse)
                ? mothersResponse.length > 0
                : !!mothersResponse.data?.length);

            if (isPartnerVerifiedDirectly || hasMothers) {
              console.log("Partner is verified or linked, redirecting...");
              router.push("/dashboard/partner");
            } else {
              console.log(
                "New/Unverified partner without links, opening OTP...",
              );
              setIsOtpOpen(true);
            }
          } catch (err) {
            console.error("Error checking linked mothers:", err);
            // Fallback to direct check
            if (isPartnerVerifiedDirectly) {
              router.push("/dashboard/partner");
            } else {
              setIsOtpOpen(true);
            }
          }
        };

        checkPartnerStatus();
      } else if (userRoleAttr === "mother") {
        router.push((callbackUrl as string) || "/dashboard/mother");
      } else {
        router.push((callbackUrl as string) || "/");
      }
    }

    if (isError && error) {
      toast.error("Login failed. Please try again.");
      // alert("login failed. Please try again.");
      console.error(error); // alert(error) might be object
    }

    if (error) {
      console.error(error);
    }
  }, [isSuccess, isError, data, error, dispatch, router, callbackUrl]);

  return (
    <>
      <div className=" relative flex flex-col  items-center justify-center md:pt-7 md:my-0  gap-3 min-h-svh md:h-screen font-sans bg-accent-foreground/3 px-4  overflow-y-auto md:overflow-y-hidden ">
        {/* for header section, logo emergency support contact */}
        <nav className="flex  flex-row justify-between items-center w-full max-w-6xl  mt-  px-3 md:mb-2 md:mt-2">
          <div className="text-lg font-semibold font-seperator text-primary">
            Logo
          </div>
          <div className=" flex flex-row gap-2 text-sm font-medium   ">
            <span> {/* <Headset size={18} /> */}</span>
            <Link
              href="/"
              className="flex items-center gap-1 text-primary hover:underline"
            >
              Back to Home{" "}
            </Link>
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
      <Dialog open={isOtpOpen} onOpenChange={setIsOtpOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-8 backdrop-blur-xl bg-white/90 border-primary/10">
          <DialogHeader className="space-y-4">
            <div className="mx-auto size-16 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Mail className="size-8 text-primary animate-bounce" />
            </div>
            <div className="space-y-2 text-center">
              <DialogTitle className="text-2xl font-bold text-amber-950/80">
                Verify Your Identity
              </DialogTitle>
              <DialogDescription className="text-amber-900/60 font-medium">
                Please Enter an 8-digit verification code send to your email
                <span className="block font-bold text-primary mt-1">
                  {email}
                </span>
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="py-6 flex flex-col items-center gap-6">
            <OTPInput
              value={otp}
              onChange={setOtp}
              maxLength={8}
              containerClassName="group flex items-center has-[:disabled]:opacity-50"
              render={({ slots }) => (
                <div className="flex gap-2">
                  {slots.map((slot, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "relative w-10 h-14 md:w-12 md:h-16 flex items-center justify-center text-2xl font-bold bg-white border-2 rounded-xl transition-all duration-300",
                        slot.isActive
                          ? "border-primary ring-4 ring-primary/10 scale-105"
                          : "border-gray-200",
                      )}
                    >
                      {slot.char !== null ? slot.char : ""}
                      {slot.hasFakeCaret && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-px h-8 bg-primary animate-caret-blink" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            />

            <Button
              onClick={handleOtpSubmit}
              disabled={otp.length !== 8 || isVerifying}
              className="w-full h-12 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-white"
            >
              {isVerifying ? "Verifying..." : "Verify & Continue"}
            </Button>

            {/* <button
             
              className="text-sm font-bold text-primary hover:underline transition-all"
            >
              Resend Code
            </button> */}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const LoginPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
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
