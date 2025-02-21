import { Home, Settings, UsersRound, Send, Bell, Bookmark, HelpCircle, LogOut } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
    {
        title: "Home",
        url: "#",
        icon: Home,
    },
    {
        title: "Messages",
        url: "#",
        icon: Send,
    },
    {
        title: "Groups",
        url: "#",
        icon: UsersRound,
    },
    {
        title: "Bookmarks",
        url: "#",
        icon: Bookmark,
    },
    {
        title: "Notifications",
        url: "#",
        icon: Bell,
    },
    {
        title: "Settings",
        url: "#",
        icon: Settings,
    },
]

const additionalItems = [
    {
        title: "Help",
        url: "#",
        icon: HelpCircle,
    },
    {
        title: "Log Out",
        url: "#",
        icon: LogOut,
    },
];

export function AppSidebar() {
    return (
        <Sidebar className="pt-16 w-40">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <hr className="my-4 border-gray-200 dark:border-gray-700" />

                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {additionalItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
