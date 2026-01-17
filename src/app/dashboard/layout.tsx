import { AppSidebar } from "@/components/app-sidebar"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="[--header-height:calc(--spacing(14))]">
            <SidebarProvider className="flex flex-col">
                <div className="flex flex-1">
                    <AppSidebar />
                    <SidebarInset>
                        <div className="flex items-center justify-between gap-2 px-4 py-2 border-b">
                            <div className="flex items-center gap-2">
                                <SidebarTrigger />
                                <h1 className="text-lg font-semibold">Dashboard</h1>
                            </div>
                        </div>
                        <div className="flex flex-col p-4">
                            {children}
                        </div>
                    </SidebarInset>
                </div>
            </SidebarProvider>
        </div>
    )
}
