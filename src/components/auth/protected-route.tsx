import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { useAuth } from "@/contexts/auth-context";
import { trackEvent } from "@/lib/umami";
import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router";

interface ProtectedRouteProps {
	children?: React.ReactNode;
	requireAuth?: boolean;
	redirectPath?: string;
}

export const ProtectedRoute = ({
	children,
	requireAuth = true,
	redirectPath = "/auth",
}: ProtectedRouteProps) => {
	const { user, loading: isLoading, error } = useAuth();
	const location = useLocation();

	// Track unauthorized access attempts
	useEffect(() => {
		if (requireAuth && !user && !isLoading) {
			trackEvent("unauthorized_access_attempt", {
				path: location.pathname,
				timestamp: new Date().toISOString(),
			});
		}
	}, [user, isLoading, location.pathname]);

	// Show loading state
	if (isLoading) {
		return <LoadingOverlay isLoading={true} text="Checking authentication..." fullScreen={false} />;
	}

	// Handle authentication error
	if (error) {
		console.error("Auth error:", error);
		return <Navigate to="/auth/error" state={{ error }} replace />;
	}

	// Handle authentication rules
	if (requireAuth && !user) {
		// Save the attempted location for post-login redirect
		return (
			<Navigate
				to={redirectPath}
				state={{
					from: location,
					message: "Please log in to access this page",
				}}
				replace
			/>
		);
	}

	// Prevent authenticated users from accessing auth pages
	if (!requireAuth && user) {
		return <Navigate to="/cms/dashboard" replace />;
	}

	// Render either children or outlet for nested routes
	return children ? <>{children}</> : <Outlet />;
};

// HOC version for class components
export const withProtectedRoute = (
	WrappedComponent: React.ComponentType,
	options: Omit<ProtectedRouteProps, "children"> = {},
) => {
	return function WithProtectedRouteWrapper(props: TAny) {
		return (
			<ProtectedRoute {...options}>
				<WrappedComponent {...props} />
			</ProtectedRoute>
		);
	};
};
