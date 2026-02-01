"use client";

import type React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarSeparator,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/auth-context";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";
import {
	Briefcase,
	CalendarDays,
	FileText,
	Folder,
	FolderPlus,
	Home,
	LayoutDashboard,
	LogOut,
	MessageSquare,
	Moon,
	Award,
	PenSquare,
	Sun,
	User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { ScrollToTop } from "./scroll-to-top";

interface CmsLayoutProps {
	children: React.ReactNode;
}

export const CmsLayout = ({ children }: CmsLayoutProps) => {
	const { user, signOut } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const { theme, setTheme } = useTheme();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

	// Close mobile menu when route changes
	useEffect(() => {
		setIsMobileMenuOpen(false);
	}, [location.pathname]);

	// Handle window resize
	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth < 768) {
				setIsSidebarCollapsed(true);
			}
		};

		// Initial check
		handleResize();

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const handleSignOut = async () => {
		try {
			await signOut();
			toast.success("You have been successfully logged out.");
			navigate("/");
		} catch (error) {
			toast.error("Failed to log out. Please try again.");
		}
	};

	const toggleTheme = () => {
		setTheme(theme === "dark" ? "light" : "dark");
	};

	const navigationItems = [
		{
			group: "General",
			items: [
				{
					label: "Dashboard",
					icon: <LayoutDashboard className="h-4 w-4" />,
					path: "/cms/dashboard",
				},
			],
		},
		{
			group: "Content",
			items: [
				{
					label: "Blog Posts",
					icon: <FileText className="h-4 w-4" />,
					path: "/cms/blogs",
				},
				{
					label: "Add Blog",
					icon: <PenSquare className="h-4 w-4" />,
					path: "/cms/blogs/form",
				},
				{
					label: "Projects",
					icon: <Folder className="h-4 w-4" />,
					path: "/cms/projects",
				},
				{
					label: "Add Project",
					icon: <FolderPlus className="h-4 w-4" />,
					path: "/cms/projects/form",
				},
				{
					label: "Certifications",
					icon: <Award className="h-4 w-4" />,
					path: "/cms/certifications",
				},
				{
					label: "Add Certification",
					icon: <Award className="h-4 w-4" />,
					path: "/cms/certifications/form",
				},
				{
					label: "Contacts",
					icon: <MessageSquare className="h-4 w-4" />,
					path: "/cms/contacts",
				},
				{
					label: "Services",
					icon: <Briefcase className="h-4 w-4" />,
					path: "/cms/services",
				},
				{
					label: "Consultations",
					icon: <CalendarDays className="h-4 w-4" />,
					path: "/cms/consultations",
				},
			],
		},
		{
			group: "Account",
			items: [
				{
					label: "Profile",
					icon: <User className="h-4 w-4" />,
					path: "/cms/profile",
				},
				// {
				// 	label: "Settings",
				// 	icon: <Settings className="h-4 w-4" />,
				// 	path: "/cms/settings",
				// },
			],
		},
	];

	const renderNavigationItems = () => {
		return navigationItems.map((group, index) => (
			<div key={group.group}>
				{index > 0 && <SidebarSeparator />}
				<SidebarGroup>
					<SidebarGroupLabel>{group.group}</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{group.items.map(item => (
								<SidebarMenuItem key={item.path}>
									<SidebarMenuButton
										asChild
										tooltip={item.label}
										className={cn(
											"transition-colors",
											location.pathname === item.path && "bg-primary/10 text-primary font-medium"
										)}
									>
										<Link to={item.path}>
											{item.icon}
											<span>{item.label}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</div>
		));
	};

	return (
		<SidebarProvider defaultOpen={!isSidebarCollapsed}>
			<div className="w-full flex min-h-screen bg-background relative">
				{/* Sidebar */}
				<Sidebar className="border-r border-border/50 shadow-sm">
					<SidebarHeader className="border-b border-border/50 px-4 py-3.5">
						<div className="flex items-center gap-3">
							<Avatar className="h-9 w-9 border-2 border-primary/20">
								<AvatarImage src={user?.photoURL || ""} alt={user?.displayName || "User"} />
								<AvatarFallback className="bg-primary/10 text-primary font-semibold">
									{user?.displayName?.[0] || user?.email?.[0] || "U"}
								</AvatarFallback>
							</Avatar>
							<div className="flex flex-col overflow-hidden">
								<span className="font-medium text-sm truncate">{user?.displayName || "User"}</span>
								<span className="text-xs text-muted-foreground truncate">{user?.email}</span>
							</div>
						</div>
					</SidebarHeader>

					<SidebarContent className="py-2">{renderNavigationItems()}</SidebarContent>

					<SidebarFooter className="border-t border-border/50 p-4">
						<Button
							variant="outline"
							size="sm"
							className="w-full rounded-lg hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors"
							onClick={handleSignOut}
						>
							<LogOut className="h-4 w-4 mr-2" />
							Sign Out
						</Button>
					</SidebarFooter>
				</Sidebar>

				{/* Main Content */}
				<div className="flex-1 flex flex-col">
					{/* Header */}
					<header className="h-16 border-b border-border/50 flex items-center px-4 md:px-6 sticky top-0 bg-background/80 backdrop-blur-sm z-10 shadow-sm">
						<div className="flex-1 flex items-center gap-4">
							<SidebarTrigger />
						</div>

						<div className="flex items-center gap-2">
							<Button
								variant="ghost"
								size="icon"
								className="rounded-full h-9 w-9"
								onClick={toggleTheme}
								aria-label="Toggle theme"
							>
								{theme === "dark" ? (
									<Sun className="h-[1.2rem] w-[1.2rem] text-yellow-500" />
								) : (
									<Moon className="h-[1.2rem] w-[1.2rem]" />
								)}
							</Button>

							<Button
								variant="outline"
								size="sm"
								onClick={() => navigate("/")}
								className="rounded-lg hidden md:flex"
							>
								<Home className="h-4 w-4 mr-2" />
								View Site
							</Button>

							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" size="icon" className="rounded-full h-9 w-9 md:hidden">
										<User className="h-[1.2rem] w-[1.2rem]" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuLabel>My Account</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuItem onClick={() => navigate("/cms/profile")}>
										<User className="h-4 w-4 mr-2" />
										Profile
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => navigate("/")}>
										<Home className="h-4 w-4 mr-2" />
										View Site
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem onClick={handleSignOut} className="text-destructive">
										<LogOut className="h-4 w-4 mr-2" />
										Sign Out
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</header>

					{/* Main Content */}
					<main className="flex-1 p-4 md:p-6 overflow-auto">
						<div className="max-w-7xl mx-auto">{children}</div>
					</main>

					{/* Footer */}
					<footer className="h-14 border-t border-border/50 flex items-center justify-between px-4 md:px-6 text-sm text-muted-foreground">
						<div>© {new Date().getFullYear()} Nanthakumar. All rights reserved.</div>
						<div className="text-xs">Version 1.0.0</div>
					</footer>
				</div>
				<ScrollToTop />
			</div>
		</SidebarProvider>
	);
};
