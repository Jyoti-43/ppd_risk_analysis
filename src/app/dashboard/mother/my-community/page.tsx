import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// import { SectionCards } from "@/components/businessDashboard/sectionCard";
// import DashboardChart from "@/components/businessDashboard/chartSection";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { IoSearch } from "react-icons/io5";
import MyPostsTable from "@/src/app/component/dashboard/mother/my-community";
import { Badge, TrendingUpIcon } from "lucide-react";
import { SelectSeparator } from "@/components/ui/select";

const ClientDashboard = () => {
  return (
    <div className="w-full     flex   justify-center bg-amber-50/35 ">
      <div className="flex flex-col w-full pt-8 px-10 max-w-7xl ">
        <div className="flex flex-row justify-between items-center">
          <div className="absolute top-2 right-20 flex flex-row justify-start items-center space-x-5">
            <div className="relative w-full max-w-xs">
              <input
                type="text"
                placeholder="Search here..."
                className="w-full pl-10 pr-4 py-.5 rounded-md border-2 border-gray-300 "
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <IoSearch />
              </div>
            </div>
          </div>
        </div>

        <div className="  w-full flex flex-1 flex-col">
          <div className="flex flex-col  w-full py-4 md:gap-6 md:py-6">
            <div className=" flex flex-row w-full *:data-[slot=card]:shadow-xs  gap-10  *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-0">
              {/* Total bookings */}
              <Card className="@container/card flex flex-1 !w-100">
                <CardHeader className="relative">
                  <CardDescription>Total Bookings</CardDescription>
                  <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                    1,245
                  </CardTitle>
                  <div className="absolute right-4 top-4">
                    <Badge className="flex gap-1 rounded-lg text-xs">
                      <TrendingUpIcon className="size-3" />
                      +8.2%
                    </Badge>
                  </div>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1 text-sm">
                  <div className="flex gap-2 font-medium">
                    Growth from last week <TrendingUpIcon className="size-4" />
                  </div>
                  <div className="text-muted-foreground">
                    Includes all recent bookings
                  </div>
                </CardFooter>
              </Card>
              {/* New Reviews */}
              <Card className="@container/card flex flex-1 bg-card shadow">
                <CardHeader className="relative">
                  <CardDescription>New Reviews Today</CardDescription>
                  <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                    56
                  </CardTitle>
                  <div className="absolute right-4 top-4">
                    <Badge className="flex gap-1 rounded-lg text-xs">
                      <TrendingUpIcon className="size-3" />
                      +12.0%
                    </Badge>
                  </div>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1 text-sm">
                  <div className="flex gap-2 font-medium">
                    Higher engagement <TrendingUpIcon className="size-4" />
                  </div>
                  <div className="text-muted-foreground">
                    More positive reviews today
                  </div>
                </CardFooter>
              </Card>

              {/* Active Acounts/users */}
              <Card className="@container/card flex flex-1">
                <CardHeader className="relative">
                  <CardDescription>Active Accounts</CardDescription>
                  <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                    3,742
                  </CardTitle>
                  <div className="absolute right-4 top-4">
                    <Badge className="flex gap-1 rounded-lg text-xs">
                      <TrendingUpIcon className="size-3" />
                      +3.5%
                    </Badge>
                  </div>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1 text-sm">
                  <div className="line-clamp-1 flex gap-2 font-medium">
                    More daily visits <TrendingUpIcon className="size-4" />
                  </div>
                  <div className="text-muted-foreground">
                    Daily login rate increasing
                  </div>
                </CardFooter>
              </Card>
              {/* growth rate */}
              <Card className="@container/card flex flex-1">
                <CardHeader className="relative">
                  <CardDescription>Growth Rate</CardDescription>
                  <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                    4.5%
                  </CardTitle>
                  <div className="absolute right-4 top-4">
                    <Badge className="flex gap-1 rounded-lg text-xs">
                      <TrendingUpIcon className="size-3" />
                      +4.5%
                    </Badge>
                  </div>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1 text-sm">
                  <div className="line-clamp-1 flex gap-2 font-medium">
                    Steady performance <TrendingUpIcon className="size-4" />
                  </div>
                  <div className="text-muted-foreground">
                    Meets growth projections
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
        <div className=" w-full mt-3 flex flex-1 flex-col ">
          <div className="flex flex-col gap-10 w-full py-4 md:gap-6 md:py-6">
            {/* <DashboardChart /> */}
          </div>
        </div>
        {/* <div className="w-full flex   mt-10  pb-5  gap-10  pr-2">
          <div className=" flex flex-[1] flex-col     justify-stretch items-center  h-full   space-y-1 "> */}
        <Card className=" relative w-full h-full py-2 rounded-md gap-2  ">
          <CardHeader className="">
            <CardTitle className="flex mb-1 ">
              <h1 className="font-medium text-xl text-start  text-green-400 ">
               My posts
              </h1>

            </CardTitle>
          
          </CardHeader>
          <CardContent className="px-0">
            {/* <RecentBookings/> */}
            {/* <Calendar /> */}
            <MyPostsTable />
          </CardContent>
        </Card>
        {/* </div>
        </div> */}
        {/* <div className="w-full flex   mt-10  pb-5  gap-20  ">
          <div className=" flex flex-[1] flex-col   justify-stretch items-center  h-full   space-y-1 ">
            <Card className="w-full h-full py-2 rounded-sm gap-2  ">
              <CardHeader className="">
                <CardTitle>
                  <h1 className="font-medium text-xl text-start  text-green-400 ">
                    Recent Bookings
                  </h1>
                </CardTitle>
              </CardHeader>

              <CardContent className="px-0">
                {/* <UpcomingBookings/> 

                <RecentBookingTable />
              </CardContent>
            </Card>
          </div>

         
        </div> */}
      </div>
    </div>
  );
};

export default ClientDashboard;
