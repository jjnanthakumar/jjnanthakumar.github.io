import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/use-theme";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type React from "react";
import { HashRouter } from "react-router";

import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { LoadingProvider, useLoading } from "@/contexts/loading-context";
import ScrollToTopAuto from "./components/layout/scroll-to-top-auto";
import { queryClient } from "./lib/query-client";
import AppRoutes from "./routes";

// Create a wrapper component to use the loading context
const LoadingWrapper = ({ children }: { children: React.ReactNode }) => {
	const { isLoading, text } = useLoading();

	return (
		<>
			<LoadingOverlay isLoading={isLoading} text={text} fullScreen={true} />
			{children}
		</>
	);
};

const App = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider>
				<LoadingProvider>
					<TooltipProvider>
						<Toaster />
						<Sonner />
						<HashRouter>
							<LoadingWrapper>
								<div className="flex flex-col min-h-screen">
									<AppRoutes />
									<ScrollToTopAuto />
								</div>
							</LoadingWrapper>
						</HashRouter>
					</TooltipProvider>
				</LoadingProvider>
			</ThemeProvider>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
};

export default App;
