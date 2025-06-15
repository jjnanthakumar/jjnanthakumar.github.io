import { cn } from "@/lib/utils";
import React from "react";
import { Footer } from "./footer";
import { Navbar } from "./navbar";
import { ScrollToTop } from "./scroll-to-top";

interface LayoutProps {
	children: React.ReactNode;
	// Add more flexibility to layout
	className?: string;
	hideNavbar?: boolean;
	hideFooter?: boolean;
}

export const Layout = ({
	children,
	className,
	hideNavbar = false,
	hideFooter = false,
}: LayoutProps) => {
	return (
		<div className={cn("flex flex-col min-h-screen", className)}>
			{!hideNavbar && <Navbar />}
			<main className="flex-1 pt-20">{children}</main>
			{!hideFooter && <Footer />}
			<ScrollToTop />
		</div>
	);
};
