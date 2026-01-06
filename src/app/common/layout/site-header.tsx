import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "../../Hooks/hook";
import { authUserAPI } from "../../redux/services/authApi";
import { selectIsLoggedIn, logout } from "../../redux/feature/user/userSlice";
import { useEffect, useState } from "react";

export function SiteHeader() {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-white px-6 lg:px-10 py-3">
      <div className="flex items-center gap-10">
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
        {isLoggedIn ? <SiteNavAuth /> : <SiteNav />}
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

  useEffect(() => {}, []);
  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };
  
   if (!mounted) {
    return (
      <nav className="hidden lg:flex items-center gap-9">
        {/* Render a placeholder or skeleton that matches server output */}
      </nav>
    );
  }

  return (
    <nav className="hidden lg:flex  gap-9 wrap lg:items-end-safe">
      <Link
        href="/"
        className="text-[15px] font-medium text-foreground hover:text-primary transition-colors"
      >
        Home
      </Link>
      <Link
        href="/screening"
        className="text-[15px] font-medium text-foreground hover:text-primary transition-colors"
      >
        Screening
      </Link>
      <Link
        href="/resources"
        className="text-[15px] font-medium text-foreground hover:text-primary transition-colors"
      >
        Resources
      </Link>
      <Link href="/community" className="text-[15px] font-bold text-primary">
        Community
      </Link>
      <Link
        href="/profile"
        className="text-[15px] font-medium text-foreground hover:text-primary transition-colors"
      >
        Profile
      </Link>
      <button
        className="text-[15px] font-medium text-foreground hover:text-primary transition-colors p-0"
        onClick={handleLogout}
      >
        Logout
      </button>
    </nav>
  );
}

function SiteNav() {
  return (
    <nav className="hidden lg:flex items-center gap-9">
      <Link
        href="/"
        className="text-[15px] font-medium text-foreground hover:text-primary transition-colors"
      >
        Home
      </Link>
      <Link
        href="/login"
        className="text-[15px] font-medium text-foreground hover:text-primary transition-colors"
      >
        Screening
      </Link>
      <Link
        href="/login"
        className="text-[15px] font-medium text-foreground hover:text-primary transition-colors"
      >
        Resources
      </Link>
      <Link href="/login" className="text-[15px] font-bold text-primary">
        Community
      </Link>
      <Link
        href="/login"
        className="text-[15px] font-medium text-foreground hover:text-primary transition-colors"
      >
        Login
      </Link>
    </nav>
  );
}
