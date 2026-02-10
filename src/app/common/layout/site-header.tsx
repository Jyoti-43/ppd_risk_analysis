"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import { useAppDispatch, useAppSelector } from "../../Hooks/hook";

import {
  selectIsLoggedIn,
  logout,
  selectCurrentUser,
} from "../../redux/feature/user/userSlice";
import { useEffect, useState } from "react";
import { Avatar } from "@/components/ui/avatar";

export function SiteHeader() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const realIsLoggedIn = useAppSelector(selectIsLoggedIn);

  const realRole = useAppSelector(selectCurrentUser)?.role ?? "";

  const isLoggedIn = mounted ? realIsLoggedIn : false;
  const role = mounted ? realRole : "";

  return (
    <header className="sticky top-0 z-50  flex items-center border-b border-border bg-white px-6 lg:px-10 py-3">
      <div className="flex flex-1 items-center justify-between px-10">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-foreground transition-opacity hover:opacity-80"
        >
          <div className="size-7 text-primary shrink-0">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
          <span className="text-[17px] font-bold leading-none tracking-tight">
            MotherCare
          </span>
        </Link>
        {isLoggedIn && role === "mother" ? (
          <SiteNavAuth />
        ) : isLoggedIn && role === "contributor" ? (
          <SiteNavContributor />
        ) : isLoggedIn && role === "admin" ? (
          <SiteNavAdmin />
        ) : isLoggedIn && role === "partner" ? (
          <SiteNavPartner />
        ) : (
          <SiteNav />
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* <div className="hidden lg:flex items-center h-10 min-w-[200px] rounded-lg bg-secondary/60 focus-within:bg-secondary focus-within:ring-1 focus-within:ring-primary/20 transition-all px-3 gap-2">
          <span className="material-symbols-outlined text-[20px] text-primary">search</span>
          <Input
            type="text"
            placeholder="Search..."
            className="border-0 shadow-none h-auto p-0 text-sm focus-visible:ring-0 bg-transparent placeholder:text-muted-foreground"
          />
        </div> */}

        {/* <Button variant="ghost" size="icon" className="hidden md:flex rounded-lg h-10 w-10" aria-label="Language">
          <span className="material-symbols-outlined text-[22px]">ln</span>
        </Button> */}
        {/* <Button className="rounded-full h-10 px-5 bg-primary hover:bg-[#b50d62] text-white font-semibold text-sm shadow-sm">
          Get Help
        </Button> */}
      </div>
    </header>
  );
}

function SiteNavAuth() {
  const dispatch = useAppDispatch();

  const router = require("next/navigation").useRouter();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentUser = useAppSelector(selectCurrentUser)?.userName ?? "";

  useEffect(() => {}, []);

  const pathname = usePathname();

  if (!mounted) {
    return (
      <nav className="hidden lg:flex items-center gap-9">
        {/* Render a placeholder or skeleton that matches server output */}
      </nav>
    );
  }

  return (
    <nav className="hidden lg:flex gap-9 items-center pr-5">
      <Link
        href="/"
        className={cn(
          "text-md font-semibold transition-colors hover:text-primary",
          pathname === "/" ? "text-primary" : "text-foreground",
        )}
      >
        Home
      </Link>
      <Link
        href="/screening"
        className={cn(
          "text-md font-semibold transition-colors hover:text-primary",
          pathname === "/screening" ? "text-primary" : "text-foreground",
        )}
      >
        Screening
      </Link>
      <Link
        href="/resources"
        className={cn(
          "text-md font-semibold transition-colors hover:text-primary",
          pathname === "/resources" ? "text-primary" : "text-foreground",
        )}
      >
        Resources
      </Link>
      <Link
        href="/crisis-resources"
        className={cn(
          "text-md font-semibold transition-colors hover:text-primary",
          pathname === "/crisis-resources" ? "text-primary" : "text-foreground",
        )}
      >
        Crisis Support
      </Link>
      <Link
        href="/community"
        className={cn(
          "text-md font-semibold transition-colors hover:text-primary",
          pathname === "/community" ? "text-primary" : "text-foreground",
        )}
      >
        Community
      </Link>
      <Link
        href="/dashboard/mother"
        className={cn(
          "text-md font-semibold transition-colors hover:text-primary",
          pathname === "/dashboard/mother" ? "text-primary" : "text-foreground",
        )}
      >
        <Avatar className="h-8 w-8 bg-primary/10 ring-2 ring-primary text-primary font-bold items-center justify-center">
          {currentUser.charAt(0).toUpperCase()}
        </Avatar>
      </Link>
    </nav>
  );
}

function SiteNavContributor() {
  const dispatch = useAppDispatch();

  const router = require("next/navigation").useRouter();
  const role = useAppSelector(selectCurrentUser)?.role ?? "";

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const pathname = usePathname();

  if (!mounted) {
    return (
      <nav className="hidden lg:flex items-center gap-9 ">
        {/* Render a placeholder or skeleton that matches server output */}
      </nav>
    );
  }

  return (
    <nav className="hidden lg:flex gap-9 items-center px-6">
      <Link
        href="/"
        className={cn(
          "text-md font-semibold transition-colors hover:text-primary",
          pathname === "/" ? "text-primary" : "text-foreground",
        )}
      >
        Home
      </Link>

      <Link
        href="/resources"
        className={cn(
          "text-md font-semibold transition-colors hover:text-primary",
          pathname === "/resources" ? "text-primary" : "text-foreground",
        )}
      >
        Resources
      </Link>

      <Link
        href="/dashboard/contributor"
        className={cn(
          "text-md font-semibold transition-colors hover:text-primary",
          pathname.startsWith("/dashboard/contributor")
            ? "text-primary"
            : "text-foreground",
        )}
      >
        Dashboard
      </Link>
    </nav>
  );
}

function SiteNavAdmin() {
  const dispatch = useAppDispatch();

  const router = require("next/navigation").useRouter();
  const role = useAppSelector(selectCurrentUser)?.role ?? "";

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const pathname = usePathname();

  if (!mounted) {
    return (
      <nav className="hidden lg:flex items-center gap-9 ">
        {/* Render a placeholder or skeleton that matches server output */}
      </nav>
    );
  }

  return (
    <nav className="hidden lg:flex gap-9 items-center px-6">
      <Link
        href="/dashboard/admin"
        className={cn(
          "text-md font-semibold transition-colors hover:text-primary",
          pathname.startsWith("/dashboard/admin")
            ? "text-primary"
            : "text-foreground",
        )}
      >
        Dashboard
      </Link>
    </nav>
  );
}

function SiteNavPartner() {
  const dispatch = useAppDispatch();

  const router = require("next/navigation").useRouter();
  const role = useAppSelector(selectCurrentUser)?.role ?? "";

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const pathname = usePathname();

  if (!mounted) {
    return (
      <nav className="hidden lg:flex items-center gap-9 ">
        {/* Render a placeholder or skeleton that matches server output */}
      </nav>
    );
  }

  return (
    <nav className="hidden lg:flex gap-9 items-center px-6">
      {/* <Link
        href="/"
        className={cn(
          "text-md font-semibold transition-colors hover:text-primary",
          pathname === "/" ? "text-primary" : "text-foreground",
        )}
      >
        Home
      </Link>

      <Link
        href="/resources"
        className={cn(
          "text-md font-semibold transition-colors hover:text-primary",
          pathname === "/resources" ? "text-primary" : "text-foreground",
        )}
      >
        Resources
      </Link> */}

      <Link
        href="/dashboard/partner"
        className={cn(
          "text-md font-semibold transition-colors hover:text-primary",
          pathname.startsWith("/dashboard/partner")
            ? "text-primary"
            : "text-foreground",
        )}
      >
        Dashboard
      </Link>
    </nav>
  );
}

function SiteNav() {
  const pathname = usePathname();
  return (
    <nav className="hidden lg:flex items-center gap-9">
      <Link
        href="/"
        className={cn(
          "text-md font-semibold transition-colors hover:text-primary",
          pathname === "/" ? "text-primary" : "text-foreground",
        )}
      >
        Home
      </Link>
      {/* <Link
        href="/login"
        className={cn(
          "text-md font-semibold transition-colors hover:text-primary",
          pathname === "/login" ? "text-primary" : "text-foreground",
        )}
      >
        Screening
      </Link>
      <Link
        href="/login"
        className={cn(
          "text-md font-semibold transition-colors hover:text-primary",
          pathname === "/login" ? "text-primary" : "text-foreground",
        )}
      >
        Resources
      </Link>
      <Link
        href="/login"
        className={cn(
          "text-md font-semibold transition-colors hover:text-primary",
          pathname === "/login" ? "text-primary" : "text-foreground",
        )}
      >
        Community
      </Link> */}
      <Link
        href="/login"
        className={cn(
          "text-md font-semibold transition-colors hover:text-primary",
          pathname === "/login" ? "text-primary" : "text-foreground",
        )}
      >
        Login
      </Link>
    </nav>
  );
}
