import { Layout } from "@/components/layout/layout";
import { AuthProvider } from "@/contexts/auth-context";
import { Suspense, lazy } from "react";
import { Outlet, Route, Routes } from "react-router";
import { ProtectedRoute } from "./components/auth/protected-route";
import { PageLoader } from "./components/ui/page-loader";

// Public routes - keep these in main bundle
const Home = lazy(() => import("@/pages/home"));
const Projects = lazy(() => import("@/pages/projects"));
const ProjectDetail = lazy(() => import("@/pages/project-detail"));
const About = lazy(() => import("@/pages/about"));
const OpenSource = lazy(() => import("@/pages/open-source"));
const Contact = lazy(() => import("@/pages/contact"));
const Services = lazy(() => import("@/pages/services"));
const BookConsultation = lazy(() => import("@/pages/book-consultation"));
const NotFound = lazy(() => import("@/pages/not-found"));
const Auth = lazy(() => import("@/pages/auth"));
const TermsOfService = lazy(() => import("@/pages/terms-of-service"));
const PrivacyPolicy = lazy(() => import("@/pages/privacy-policy"));
const HireMePage = lazy(() => import("@/pages/hire-me"));
const Certifications = lazy(() => import("@/pages/certifications"));

// Archive routes
const Offers = lazy(() => import("@/pages/offers"));

// CMS routes - separate chunk
const CmsRoutes = lazy(() => import("@/pages/cms"));

const LayoutWrapper = () => (
	<Layout>
		<Outlet />
	</Layout>
);

const AppRoutes = () => (
	<AuthProvider>
		<Suspense fallback={<PageLoader />}>
			<Routes>
				<Route element={<LayoutWrapper />}>
					<Route path="/" element={<Home />} />
					<Route path="/projects" element={<Projects />} />
					<Route path="/projects/:slug" element={<ProjectDetail />} />
					<Route path="/about" element={<About />} />
					<Route path="/open-source" element={<OpenSource />} />
					<Route path="/contact" element={<Contact />} />
					<Route path="/services" element={<Services />} />
					<Route path="/book-consultation" element={<BookConsultation />} />
					<Route path="/certifications" element={<Certifications />} />
					<Route path="/terms-of-service" element={<TermsOfService />} />
					<Route path="/privacy-policy" element={<PrivacyPolicy />} />
					<Route path="/hire-me" element={<HireMePage />} />
					<Route path="/offers" element={<Offers />} />
				</Route>

				{/* Auth routes */}
				<Route
					path="/auth"
					element={
						<ProtectedRoute requireAuth={false} redirectPath="/cms/dashboard">
							<Auth />
						</ProtectedRoute>
					}
				/>

				{/* CMS routes with nested suspense */}
				<Route
					path="/cms/*"
					element={
						<Suspense fallback={<PageLoader />}>
							<CmsRoutes />
						</Suspense>
					}
				/>

				{/* 404 Page */}
				<Route path="*" element={<NotFound />} />
			</Routes>
		</Suspense>
	</AuthProvider>
);

export default AppRoutes;
