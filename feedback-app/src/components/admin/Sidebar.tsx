'use client';

import { LayoutDashboard, PieChart, Sparkles, Inbox } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarFooter,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
} from "@/components/ui/sidebar"

export type ViewType = 'feed' | 'charts' | 'insights';

interface AdminSidebarProps {
    activeView: ViewType;
    onChangeView: (view: ViewType) => void;
    children?: React.ReactNode;
}

export function AdminSidebar({ activeView, onChangeView, children }: AdminSidebarProps) {
    const items = [
        {
            title: "Live Feed",
            id: "feed",
            icon: Inbox,
        },
        {
            title: "Analytics",
            id: "charts",
            icon: PieChart,
        },
        {
            title: "AI Insights",
            id: "insights",
            icon: Sparkles,
        },
    ] as const;

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full">
                {/* Sidebar with transparent bg to let the fixed ambient bg show through */}
                <Sidebar
                    className="border-r border-white/10"
                    collapsible="icon"
                    style={{
                        "--sidebar": "transparent",
                        "--sidebar-foreground": "white",
                        "--sidebar-border": "rgba(255, 255, 255, 0.1)",
                        "--sidebar-accent": "rgba(255, 255, 255, 0.05)",
                        "--sidebar-accent-foreground": "white",
                        "--sidebar-ring": "rgba(129, 140, 248, 0.5)"
                    } as React.CSSProperties}
                >
                    <SidebarHeader className="border-b border-white/10 p-4">
                        <div className="flex items-center gap-2 px-1">
                            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-500">
                                <LayoutDashboard className="h-4 w-4 text-white" />
                            </div>
                            <span className="font-bold tracking-tight group-data-[collapsible=icon]:hidden">
                                FeedbackOS
                            </span>
                        </div>
                    </SidebarHeader>

                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupLabel className="text-white/50">Platform</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {items.map((item) => (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={activeView === item.id}
                                                onClick={() => onChangeView(item.id as ViewType)}
                                                className="text-white/70 hover:text-white hover:bg-white/10 data-[active=true]:bg-white/10 data-[active=true]:text-white transition-all h-10"
                                            >
                                                <button className="flex gap-3 items-center w-full">
                                                    <item.icon className="h-4 w-4" />
                                                    <span className="font-medium">{item.title}</span>
                                                </button>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>

                        {/* "Add the content" part - filling up space */}
                        <div className="mt-auto p-4 group-data-[collapsible=icon]:hidden">
                            <div className="rounded-xl bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-white/5 p-4">
                                <h4 className="flex items-center gap-2 text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                                    <Sparkles className="h-3 w-3 text-indigo-400" /> Pro Tip
                                </h4>
                                <p className="text-xs text-white/70 leading-relaxed">
                                    Check <span className="font-bold text-white">Insights</span> weekly to see new AI trends.
                                </p>
                            </div>
                        </div>
                    </SidebarContent>

                    <SidebarFooter className="border-t border-white/10 p-4">
                        <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-pink-500 to-indigo-500 shrink-0" />
                            <div className="group-data-[collapsible=icon]:hidden">
                                <p className="text-sm font-medium text-white">Admin User</p>
                                <p className="text-xs text-white/50">admin@company.com</p>
                            </div>
                        </div>
                    </SidebarFooter>
                </Sidebar>
                <main className="flex-1 w-full overflow-hidden">
                    {children}
                </main>
            </div>
        </SidebarProvider>
    )
}
