import { ProtectedRoute } from "@/components/auth/protected-route";
import { lazy } from "react";
import { Route, Routes } from "react-router";

// Lazy load CMS components
const Dashboard = lazy(() => import("@/pages/cms/dashboard"));
const FormProject = lazy(() => import("@/pages/cms/projects/form-project"));
const CmsProjects = lazy(() => import("@/pages/cms/projects/list-project"));
const CmsContacts = lazy(() => import("@/pages/cms/contacts/list-contact"));
const CmsServices = lazy(() => import("@/pages/cms/services/list-service"));
const CmsConsultations = lazy(() => import("@/pages/cms/consultations/list-consultations"));
const CmsConsultationSettings = lazy(() => import("@/pages/cms/consultations/settings"));
const CmsProfile = lazy(() => import("@/pages/cms/profile"));
const CmsSettings = lazy(() => import("@/pages/cms/settings"));

const CmsRoutes = () => {
	return (
		<Routes>
			{/* Protected route with nested routes */}
			<Route element={<ProtectedRoute requireAuth={true} />}>
				<Route path="/dashboard" element={<Dashboard />} />
				<Route path="/projects" element={<CmsProjects />} />
				<Route path="/projects/form" element={<FormProject />} />
				<Route path="/projects/form/:id" element={<FormProject />} />
				<Route path="/contacts" element={<CmsContacts />} />
				<Route path="/services" element={<CmsServices />} />
				<Route path="/consultations" element={<CmsConsultations />} />
				<Route path="/consultations/settings" element={<CmsConsultationSettings />} />
				<Route path="/profile" element={<CmsProfile />} />
				<Route path="/settings" element={<CmsSettings />} />
			</Route>
		</Routes>
	);
};

export default CmsRoutes;
