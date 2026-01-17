"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Settings,
  Bookmark,
  FileText,
  Users,
  BarChart,
  Shield,
  HandHeart,
  SquareActivity,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/src/app/Hooks/hook";
import { selectCurrentUser } from "@/src/app/redux/feature/user/userSlice";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useAppSelector(selectCurrentUser);
  const pathname = usePathname();
  const role = user?.role || "mother"; // Default to mother if no role

  return (
    <Sidebar
      collapsible="icon"
      className="border-r-0 pt-12 bg-background"
      {...props}
    >
      {/* <SidebarHeader className="h-16 flex items-center justify-center px-4">
        Brand or Logo area if needed 
       <div className="flex items-center gap-2 font-bold text-xl text-foreground">
           <div className="w-8 h-8 bg-[#FF6B98] rounded-lg"></div>
           <span className="text-gray-800">Wellness Mom</span>
        </div> 
      </SidebarHeader> */}
      <SidebarContent className="px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:pt-3">
        {/* Profile Section */}
        <div className="flex flex-col items-center justify-center py-4 text-center group-data-[collapsible=icon]:!p-0">
          <div className="relative mb-3 group-data-[collapsible=icon]:mb-0 ">
            <Avatar className="h-20 w-20 border-4 border-white shadow-sm group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:border-2">
              <AvatarImage
                src="/avatars/sarah.jpg"
                alt={user?.userName || "User"}
              />
              <AvatarFallback>
                {user?.userName?.substring(0, 2).toUpperCase() || "AM"}
              </AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-[#FF8BA7] text-white text-[10px] border-2 border-white group-data-[collapsible=icon]:hidden">
              ✓
            </span>
          </div>
          <h3 className="text-lg font-bold text-gray-800 group-data-[collapsible=icon]:hidden">
            {user?.userName || "Guest User"}
          </h3>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mt-1 group-data-[collapsible=icon]:hidden">
            {role.charAt(0).toUpperCase() + role.slice(1)} • Joined Oct '23
          </p>
          <Button
            variant="default"
            className="mt-4 w-full bg-primary hover:bg-[#ff5286] text-white rounded-full h-8 text-sm font-medium shadow-sm group-data-[collapsible=icon]:hidden"
          >
            Edit Profile
          </Button>
        </div>

        <SidebarSeparator className=" group-data-[collapsible=icon]:hidden" />

        {/* --- DYNAMIC MENUS BASED ON ROLE --- */}

        {/* MOTHER MENU */}
        {role === "mother" && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 group-data-[collapsible=icon]:hidden">
              Quick Access
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/dashboard/mother"}
                    tooltip="Dashboard"
                    className={cn(
                      "text-gray-600 hover:text-gray-900 group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:justify-center",
                      pathname === "/dashboard/mother" &&
                        "bg-[#FFF0F3] text-[#FF6B98] hover:bg-[#ffe0e9] hover:text-[#FF6B98] font-semibold",
                    )}
                  >
                    <Link href="/dashboard/mother" className="flex ">
                      <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
                        <LayoutDashboard
                          size={22}
                          className={cn(
                            "text-primary",
                            pathname === "/dashboard/mother" &&
                              "text-[#FF6B98]",
                          )}
                        />
                        <span className="group-data-[collapsible=icon]:hidden">
                          Dashboard
                        </span>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/dashboard/mother/screening-center"}
                    tooltip="Screening Center"
                    className={cn(
                      "text-gray-600 hover:text-gray-900 group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:justify-center",
                      pathname === "/dashboard/mother/screening-center" &&
                        "bg-[#FFF0F3] text-[#FF6B98] hover:bg-[#ffe0e9] hover:text-[#FF6B98] font-semibold",
                    )}
                  >
                    <Link
                      href="/dashboard/mother/screening-center"
                      className="flex  w-full group-data-[collapsible=icon]:justify-center"
                    >
                      <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
                        <SquareActivity
                          size={22}
                          className={cn(
                            "text-primary",
                            pathname === "/dashboard/mother/screening-center" &&
                              "text-[#FF6B98]",
                          )}
                        />
                        <span className="group-data-[collapsible=icon]:hidden">
                          Screening Center
                        </span>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/dashboard/mother/community"}
                    tooltip="Community"
                    className={cn(
                      "text-gray-600 hover:text-gray-900 group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:justify-center",
                      pathname === "/dashboard/mother/community" &&
                        "bg-[#FFF0F3] text-[#FF6B98] hover:bg-[#ffe0e9] hover:text-[#FF6B98] font-semibold",
                    )}
                  >
                    <Link href="/dashboard/mother/community" className="flex ">
                      <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
                        <HandHeart
                          size={22}
                          className={cn(
                            "text-primary",
                            pathname === "/dashboard/mother/community" &&
                              "text-[#FF6B98]",
                          )}
                        />
                        <span className="group-data-[collapsible=icon]:hidden">
                          My community
                        </span>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* CONTRIBUTOR MENU */}
        {role === "contributor" && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 group-data-[collapsible=icon]:hidden">
              Contributor Tools
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/dashboard/contributor"}
                    tooltip="Dashboard"
                    className={cn(
                      "text-gray-600 hover:text-gray-900 group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:justify-center",
                      pathname === "/dashboard/contributor" &&
                        "bg-[#FFF0F3] text-[#FF6B98] hover:bg-[#ffe0e9] hover:text-[#FF6B98] font-semibold",
                    )}
                  >
                    <Link
                      href="/dashboard/contributor"
                      className="flex items-center justify-center"
                    >
                      <LayoutDashboard size={22} />
                      <span className="group-data-[collapsible=icon]:hidden">
                        Dashboard
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/dashboard/contributor/new-article"}
                    tooltip="Create Article"
                    className={cn(
                      "text-gray-600 hover:text-gray-900 group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:justify-center",
                      pathname === "/dashboard/contributor/new-article" &&
                        "bg-[#FFF0F3] text-[#FF6B98] hover:bg-[#ffe0e9] hover:text-[#FF6B98] font-semibold",
                    )}
                  >
                    <Link
                      href="/dashboard/contributor/new-article"
                      className="flex items-center justify-center"
                    >
                      <FileText size={22} />
                      <span className="group-data-[collapsible=icon]:hidden">
                        Create Article
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/dashboard/contributor/analytics"}
                    tooltip="Analytics"
                    className={cn(
                      "text-gray-600 hover:text-gray-900 group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:justify-center",
                      pathname === "/dashboard/contributor/analytics" &&
                        "bg-[#FFF0F3] text-[#FF6B98] hover:bg-[#ffe0e9] hover:text-[#FF6B98] font-semibold",
                    )}
                  >
                    <Link
                      href="/dashboard/contributor/analytics"
                      className="flex items-center justify-center"
                    >
                      <BarChart size={22} />
                      <span className="group-data-[collapsible=icon]:hidden">
                        Analytics
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* ADMIN MENU */}
        {role === "admin" && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 group-data-[collapsible=icon]:hidden">
              Admin Panel
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/dashboard/admin"}
                    tooltip="Admin Dashboard"
                    className={cn(
                      "text-gray-600 hover:text-gray-900 group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:justify-center",
                      pathname === "/dashboard/admin" &&
                        "bg-[#FFF0F3] text-[#FF6B98] hover:bg-[#ffe0e9] hover:text-[#FF6B98] font-semibold",
                    )}
                  >
                    <Link
                      href="/dashboard/admin"
                      className="flex items-center justify-center"
                    >
                      <Shield size={22} />
                      <span className="group-data-[collapsible=icon]:hidden">
                        Dashboard
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/dashboard/admin/users"}
                    tooltip="Users"
                    className={cn(
                      "text-gray-600 hover:text-gray-900 group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:justify-center",
                      pathname === "/dashboard/admin/users" &&
                        "bg-[#FFF0F3] text-[#FF6B98] hover:bg-[#ffe0e9] hover:text-[#FF6B98] font-semibold",
                    )}
                  >
                    <Link
                      href="/dashboard/admin/users"
                      className="flex items-center justify-center"
                    >
                      <Users size={22} />
                      <span className="group-data-[collapsible=icon]:hidden">
                        Users
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/dashboard/admin/content"}
                    tooltip="Content"
                    className={cn(
                      "text-gray-600 hover:text-gray-900 group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:justify-center",
                      pathname === "/dashboard/admin/content" &&
                        "bg-[#FFF0F3] text-[#FF6B98] hover:bg-[#ffe0e9] hover:text-[#FF6B98] font-semibold",
                    )}
                  >
                    <Link
                      href="/dashboard/admin/content"
                      className="flex items-center justify-center"
                    >
                      <FileText size={22} />
                      <span className="group-data-[collapsible=icon]:hidden">
                        Content
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Shared Recent Alerts (User specific in real app, keeping fixed for now) */}
        {/* {role === "mother" && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-4 mb-2">Recent Alerts</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="flex flex-col gap-4 mt-1">
                <div className="flex flex-col gap-1">
                  <div className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#FF6B98] flex-shrink-0"></span>
                    <p className="text-sm font-medium text-gray-800 leading-tight">Weekly screening is due today.</p>
                  </div>
                  <p className="text-xs text-muted-foreground pl-3.5">2 hours ago</p>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#F97316] flex-shrink-0"></span>
                    <p className="text-sm font-medium text-gray-800 leading-tight">New comment on your story.</p>
                  </div>
                  <p className="text-xs text-muted-foreground pl-3.5">Yesterday</p>
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )} */}
      </SidebarContent>

      <SidebarFooter className="px-4 pb-6">
        <SidebarSeparator className=" group-data-[collapsible=icon]:hidden" />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === "/settings"}
              className={cn(
                "text-gray-600 hover:text-gray-900 font-medium group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:justify-center",
                pathname === "/settings" &&
                  "bg-[#FFF0F3] text-[#FF6B98] hover:bg-[#ffe0e9] hover:text-[#FF6B98] font-semibold",
              )}
            >
              <Link
                href="/settings"
                className="flex items-center justify-center"
              >
                <Settings size={22} />
                <span className="group-data-[collapsible=icon]:hidden">
                  Account Settings
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === "/saved"}
              className={cn(
                "text-gray-600 hover:text-gray-900 font-medium group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:justify-center",
                pathname === "/saved" &&
                  "bg-[#FFF0F3] text-[#FF6B98] hover:bg-[#ffe0e9] hover:text-[#FF6B98] font-semibold",
              )}
            >
              <Link href="/saved" className="flex items-center justify-center">
                <Bookmark size={22} />
                <span className="group-data-[collapsible=icon]:hidden">
                  Saved Stories
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
