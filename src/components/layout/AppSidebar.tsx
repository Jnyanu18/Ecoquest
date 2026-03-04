
"use client"

import * as React from "react"
import { 
  LayoutDashboard, 
  BookOpen, 
  Trophy, 
  Target, 
  ShieldCheck, 
  Leaf,
  Calculator,
  Loader2,
  LineChart,
  Settings
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUser, useDoc, useFirestore } from '@/firebase'
import { doc } from 'firebase/firestore'

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, url: "/dashboard", roles: ["student", "teacher", "admin"] },
  { title: "Institutional Hub", icon: LineChart, url: "/teacher", roles: ["teacher", "admin"] },
  { title: "Carbon Tracker", icon: Calculator, url: "/carbon-calculator", roles: ["student"] },
  { title: "Missions", icon: Target, url: "/missions", roles: ["student"] },
  { title: "Learning Hub", icon: BookOpen, url: "/learn", roles: ["student"] },
  { title: "Leaderboards", icon: Trophy, url: "/leaderboards", roles: ["student", "teacher", "admin"] },
  { title: "Verification", icon: ShieldCheck, url: "/admin/verify", roles: ["admin", "teacher"] },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { user, loading: authLoading } = useUser()
  const db = useFirestore()
  
  const userRef = React.useMemo(() => user && db ? doc(db, 'users', user.uid) : null, [user, db])
  const { data: profile, loading: profileLoading } = useDoc(userRef)

  const filteredItems = React.useMemo(() => {
    const role = profile?.role || 'student'
    return menuItems.filter(item => item.roles.includes(role))
  }, [profile])

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="bg-accent rounded-lg p-2">
            <Leaf className="w-5 h-5 text-accent-foreground" />
          </div>
          <span className="font-headline font-bold text-xl group-data-[collapsible=icon]:hidden">EcoQuest</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu className="px-2">
          {filteredItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
                <Link href={item.url}>
                  <item.icon className="w-5 h-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="hover:bg-sidebar-accent transition-colors">
              {authLoading || profileLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.displayName}`} />
                    <AvatarFallback>{user?.displayName?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-0.5 group-data-[collapsible=icon]:hidden overflow-hidden">
                    <span className="font-medium text-sm leading-none truncate">{user?.displayName || 'User'}</span>
                    <span className="text-xs text-muted-foreground capitalize">Level {profile?.level || 1} {profile?.role || 'Student'}</span>
                  </div>
                </>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
