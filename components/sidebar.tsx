"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Home, BriefcaseBusiness, Users, LogOut } from "lucide-react"

import { authVerify } from "@/libs/utils/utils"
import { getAuthSessions } from "@/libs/utils/utils"
import { APIsRequest } from "@/libs/requestAPIs/requestAPIs"

const navigationItems = [
  {
    name: "Home",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Jobs",
    href: "/dashboard/jobs",
    icon: BriefcaseBusiness,
  },
  {
    name: "Applicants",
    href: "/dashboard/applicants",
    icon: Users,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [user, setUsr] = useState<any>({});
  
  useEffect(() => {
    const getUserProfile = async () => {
      const { user }: any = await authVerify();
      setUsr(user);
    }

    getUserProfile()
  }, [])
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const authSessionData = getAuthSessions();

    if (!authSessionData || !authSessionData.session || !authSessionData.session.access_token || !authSessionData.device) {
      window.location.href = `/`;
      return;
    }

    try {
      await APIsRequest.signoutRequest(authSessionData.session.access_token, authSessionData.device);
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = `/`;
    } catch (error: any) {
      window.location.href = `/`;
      return;
    }
  }

  return (
    <nav className="fixed left-0 top-0 z-50 h-screen w-20 text-white-active bg-primary-active overflow-hidden">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center justify-center">
          <Link href="/dashboard" className="flex items-center">
            <img src="/logo.svg?height=32&width=32" alt="Company Logo" className="h-8 w-8" />
          </Link>
        </div>

        <div className="flex-1 space-y-2 py-4">
          {navigationItems.map((item, index) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            if (user.role === 'ADMIN') {
              return (
                <Link key={item.name} href={item.href} aria-label={item.name} className="px-2 py-4 text-[10px] font-medium relative group flex flex-col items-center justify-center transition-all duration-200 animate-fade-up animation-fill-forwards" style={{ animationDelay: `${index * 100}ms`, animationDuration: "500ms" }}>
                  {isActive && <div className="absolute left-0 top-0 h-full w-[6px] bg-yellow-400 rounded-r-lg" />}
                  <Icon className={`h-6 w-6 mb-1 transition-colors ${ isActive ? "text-white-active" : "text-gray-400 group-hover:text-white-active" }`} />
                  <span className={`text-center leading-tight transition-colors ${ isActive ? "text-white-active font-semibold" : "text-gray-400 group-hover:text-white-active" }`} > {item.name} </span>
                </Link>
              )
            }
          })}
        </div>

        <div className="pb-4">
          <button onClick={(event) => handleSubmit(event)} className="relative group flex flex-col items-center justify-center px-2 py-4 text-xs font-medium transition-all duration-200 hover:bg-white/10 w-full" aria-label="Logout" >
            <LogOut className="h-6 w-6 mb-1 text-white/70 group-hover:text-white transition-colors" /> <span className="text-center leading-tight text-white/70 group-hover:text-white transition-colors"> Logout </span>
          </button>
        </div>
      </div>
    </nav>
  )
}

