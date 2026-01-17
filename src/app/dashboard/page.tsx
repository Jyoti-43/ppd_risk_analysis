"use client"


import { selectCurrentUser } from "../redux/feature/user/userSlice"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useAppSelector } from "../Hooks/hook"

export default function DashboardPage() {
    const user = useAppSelector(selectCurrentUser)
    const router = useRouter()

    useEffect(() => {
        if (user?.role === "mother") {
            router.push("/dashboard/mother")
        } else if (user?.role === "contributor") {
            router.push("/dashboard/contributor")
        } else if (user?.role === "admin") {
            router.push("/dashboard/admin")
        }
    }, [user, router])

    return (
        <div className="flex items-center justify-center h-full">
            <p>Redirecting to your dashboard...</p>
        </div>
    )
}
