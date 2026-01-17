
import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
// import { SiteHeader } from "../common/layout/site-header"
// import { SiteHeader } from "@/components/site-header"


export const iframeHeight = "800px"

export const description = "A sidebar with a header and a search form."

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        {/* <SiteHeader /> */}
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            <div className="flex items-center  justify-between gap-2 px-4 py-2 border-b">
              <div className="flex">
                <SidebarTrigger />
                <h1 className="text-lg font-semibold">Dashboard</h1>
              </div>

              <h4>search</h4>
            </div>
            {children}
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
}
