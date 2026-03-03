
"use client"

import * as React from "react"
import { 
  LayoutDashboard, 
  BookOpen, 
  Trophy, 
  Target, 
  Newspaper, 
  Settings, 
  ShieldCheck, 
  Users,
  Leaf,
  Calculator
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
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MOCK_USER } from "@/lib/constants"

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, url: "/dashboard", role: ["student", "teacher", "admin"] },
  { title: "Carbon Tracker", icon: Calculator, url: "/carbon-calculator", role: ["student"] },
  { title: "Missions", icon: Target, url: "/missions", role: ["student"] },
  { title: "Learning Hub", icon: BookOpen, url: "/learn", role: ["student"] },
  { title: "Leaderboards", icon: Trophy, url: "/leaderboards", role: ["student", "teacher", "admin"] },
  { title: "Verification", icon: ShieldCheck, url: "/admin/verify", role: ["admin", "teacher"] },
]

export function AppSidebar() {
  const pathname = usePathname()
  
  const filteredItems = menuItems.filter(item => 
    item.role.includes(MOCK_USER.role)
  )

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
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Mission Control</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
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
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="hover:bg-sidebar-accent transition-colors">
              <Avatar className="h-8 w-8">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${MOCK_USER.name}`} />
                <AvatarFallback>{MOCK_USER.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-0.5 group-data-[collapsible=icon]:hidden">
                <span className="font-medium text-sm leading-none">{MOCK_USER.name}</span>
                <span className="text-xs text-muted-foreground capitalize">Level {MOCK_USER.level} {MOCK_USER.role}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
