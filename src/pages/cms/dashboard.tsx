import { CmsLayout } from "@/components/layout/cms-layout";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/auth-context";
import { db } from "@/lib/firebase";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query } from "firebase/firestore";
import {
	ArrowUpRight,
	BarChart3,
	Briefcase,
	Calendar,
	FilePlus,
	FileText,
	Folder,
	MessageSquare,
	PlusCircle,
	Settings,
} from "lucide-react";
import { Link, Navigate } from "react-router";

const Dashboard = () => {
	const { user } = useAuth();

	// Fetch summary counts from all collections
	const fetchSummaryData = async () => {
		const blogsQuery = query(collection(db, "blogs"));
		const projectsQuery = query(collection(db, "projects"));
		const contactsQuery = query(collection(db, "contacts"));
		const servicesQuery = query(collection(db, "service-requests"));
		const consultationsQuery = query(collection(db, "consultations"));

		const [
			blogsSnapshot,
			projectsSnapshot,
			contactsSnapshot,
			servicesSnapshot,
			consultationsSnapshot,
		] = await Promise.all([
			getDocs(blogsQuery),
			getDocs(projectsQuery),
			getDocs(contactsQuery),
			getDocs(servicesQuery),
			getDocs(consultationsQuery),
		]);

		return {
			blogCount: blogsSnapshot.size,
			projectCount: projectsSnapshot.size,
			contactCount: contactsSnapshot.size,
			serviceCount: servicesSnapshot.size,
			consultationCount: consultationsSnapshot.size,
			publishedBlogs: blogsSnapshot.docs.filter((doc) => doc.data().isPublished).length,
			publishedProjects: projectsSnapshot.docs.filter((doc) => doc.data().isPublished).length,
			newContacts: contactsSnapshot.docs.filter((doc) => doc.data().status === "new").length,
			pendingServices: servicesSnapshot.docs.filter((doc) => doc.data().status === "pending")
				.length,
			upcomingConsultations: consultationsSnapshot.docs.filter(
				(doc) => new Date(doc.data().date) >= new Date() && doc.data().status !== "cancelled",
			).length,
		};
	};

	const {
		data: counts = {
			blogCount: 0,
			projectCount: 0,
			contactCount: 0,
			serviceCount: 0,
			consultationCount: 0,
			publishedBlogs: 0,
			publishedProjects: 0,
			newContacts: 0,
			pendingServices: 0,
			upcomingConsultations: 0,
		},
		isLoading,
	} = useQuery({
		queryKey: ["dashboardSummary"],
		queryFn: fetchSummaryData,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});

	if (!user) {
		return <Navigate to="/auth" />;
	}

	return (
		<CmsLayout>
			<div className="space-y-8">
				{/* Header with welcome message */}
				<div className="flex flex-col space-y-2">
					<h1 className="text-3xl font-bold tracking-tight">
						Welcome back, {user.displayName || "User"}
					</h1>
					<p className="text-muted-foreground">
						Here's an overview of your content and recent activity.
					</p>
				</div>

				{/* Stats Overview Cards */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
					<StatsCard
						title="Blog Posts"
						value={counts.blogCount}
						description={`${counts.publishedBlogs} published`}
						icon={<FileText className="h-4 w-4" />}
						linkTo="/cms/blogs"
						loading={isLoading}
					/>

					<StatsCard
						title="Projects"
						value={counts.projectCount}
						description={`${counts.publishedProjects} published`}
						icon={<Folder className="h-4 w-4" />}
						linkTo="/cms/projects"
						loading={isLoading}
					/>

					<StatsCard
						title="Contacts"
						value={counts.contactCount}
						description={`${counts.newContacts} new messages`}
						icon={<MessageSquare className="h-4 w-4" />}
						linkTo="/cms/contacts"
						loading={isLoading}
						highlight={counts.newContacts > 0}
					/>

					<StatsCard
						title="Service Requests"
						value={counts.serviceCount}
						description={`${counts.pendingServices} pending`}
						icon={<Briefcase className="h-4 w-4" />}
						linkTo="/cms/services"
						loading={isLoading}
						highlight={counts.pendingServices > 0}
					/>

					<StatsCard
						title="Consultations"
						value={counts.consultationCount}
						description={`${counts.upcomingConsultations} upcoming`}
						icon={<Calendar className="h-4 w-4" />}
						linkTo="/cms/consultations"
						loading={isLoading}
						highlight={counts.upcomingConsultations > 0}
					/>
				</div>

				{/* Quick Actions */}
				<div>
					<h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
						<QuickAction
							title="New Blog Post"
							description="Create and publish a new blog article"
							icon={<FilePlus className="h-5 w-5" />}
							link="/cms/blogs/form"
							color="bg-blue-50 dark:bg-blue-950/30"
							iconColor="text-blue-500"
						/>

						<QuickAction
							title="New Project"
							description="Add a new project to your portfolio"
							icon={<PlusCircle className="h-5 w-5" />}
							link="/cms/projects/form"
							color="bg-purple-50 dark:bg-purple-950/30"
							iconColor="text-purple-500"
						/>

						<QuickAction
							title="Consultation Settings"
							description="Manage your availability and booking options"
							icon={<Settings className="h-5 w-5" />}
							link="/cms/consultations/settings"
							color="bg-amber-50 dark:bg-amber-950/30"
							iconColor="text-amber-500"
						/>
					</div>
				</div>

				{/* Content Overview */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center justify-between">
								<span>Content Overview</span>
								<BarChart3 className="h-5 w-5 text-muted-foreground" />
							</CardTitle>
							<CardDescription>Summary of your published content</CardDescription>
						</CardHeader>
						<CardContent>
							{isLoading ? (
								<div className="space-y-3">
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-4 w-11/12" />
									<Skeleton className="h-4 w-10/12" />
								</div>
							) : (
								<div className="space-y-4">
									<div className="flex justify-between items-center border-b pb-2">
										<span className="font-medium">Content Type</span>
										<span className="font-medium">Published / Total</span>
									</div>
									<ContentOverviewItem
										label="Blog Posts"
										published={counts.publishedBlogs}
										total={counts.blogCount}
										percentage={calculatePercentage(counts.publishedBlogs, counts.blogCount)}
									/>
									<ContentOverviewItem
										label="Projects"
										published={counts.publishedProjects}
										total={counts.projectCount}
										percentage={calculatePercentage(counts.publishedProjects, counts.projectCount)}
									/>
								</div>
							)}
						</CardContent>
						<CardFooter>
							<Button variant="ghost" asChild className="text-sm w-full">
								<Link to="/cms/blogs" className="flex items-center justify-center">
									View All Content
									<ArrowUpRight className="ml-2 h-4 w-4" />
								</Link>
							</Button>
						</CardFooter>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center justify-between">
								<span>Recent Activity</span>
								<Calendar className="h-5 w-5 text-muted-foreground" />
							</CardTitle>
							<CardDescription>New messages and upcoming consultations</CardDescription>
						</CardHeader>
						<CardContent>
							{isLoading ? (
								<div className="space-y-4">
									<Skeleton className="h-16 w-full rounded-md" />
									<Skeleton className="h-16 w-full rounded-md" />
								</div>
							) : (
								<div className="space-y-4">
									<ActivityItem
										title={`${counts.newContacts} new contact messages`}
										description={
											counts.newContacts > 0 ? "Waiting for response" : "No new messages"
										}
										icon={
											<div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
												<MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
											</div>
										}
										link="/cms/contacts"
									/>
									<ActivityItem
										title={`${counts.upcomingConsultations} upcoming consultations`}
										description={
											counts.upcomingConsultations > 0
												? "Check your schedule"
												: "No upcoming consultations"
										}
										icon={
											<div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
												<Calendar className="h-4 w-4 text-green-600 dark:text-green-400" />
											</div>
										}
										link="/cms/consultations"
									/>
								</div>
							)}
						</CardContent>
						<CardFooter>
							<Button variant="ghost" asChild className="text-sm w-full">
								<Link to="/cms/consultations" className="flex items-center justify-center">
									View All Activities
									<ArrowUpRight className="ml-2 h-4 w-4" />
								</Link>
							</Button>
						</CardFooter>
					</Card>
				</div>
			</div>
		</CmsLayout>
	);
};

// Helper function to calculate percentage
function calculatePercentage(value: number, total: number): number {
	if (total === 0) return 0;
	return Math.round((value / total) * 100);
}

// Stats Card component
interface StatsCardProps {
	title: string;
	value: number;
	description: string;
	icon: React.ReactNode;
	linkTo: string;
	loading?: boolean;
	highlight?: boolean;
}

function StatsCard({
	title,
	value,
	description,
	icon,
	linkTo,
	loading = false,
	highlight = false,
}: StatsCardProps) {
	return (
		<Card
			className={`transition-all hover:shadow-md ${
				highlight ? "border-primary/20 bg-primary/5 dark:bg-primary/10" : ""
			}`}
		>
			<Link to={linkTo}>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">{title}</CardTitle>
					<div className="opacity-70">{icon}</div>
				</CardHeader>
				<CardContent>
					{loading ? (
						<>
							<Skeleton className="h-7 w-1/2 mb-1" />
							<Skeleton className="h-4 w-2/3" />
						</>
					) : (
						<>
							<div className="text-2xl font-bold">{value}</div>
							<p className="text-xs text-muted-foreground mt-1">{description}</p>
						</>
					)}
				</CardContent>
			</Link>
		</Card>
	);
}

// Quick Action component
interface QuickActionProps {
	title: string;
	description: string;
	icon: React.ReactNode;
	link: string;
	color: string;
	iconColor: string;
}

function QuickAction({ title, description, icon, link, color, iconColor }: QuickActionProps) {
	return (
		<Link to={link} className="block">
			<div className="flex items-center p-4 rounded-lg border border-border/80 hover:bg-accent/50 transition-colors">
				<div className={`rounded-full p-3 mr-2 ${color}`}>
					<div className={iconColor}>{icon}</div>
				</div>
				<div className="flex-1">
					<h3 className="font-medium">{title}</h3>
					<p className="text-xs text-muted-foreground">{description}</p>
				</div>
				<ArrowUpRight className="h-4 w-4 text-muted-foreground" />
			</div>
		</Link>
	);
}

// Content Overview Item component
interface ContentOverviewItemProps {
	label: string;
	published: number;
	total: number;
	percentage: number;
}

function ContentOverviewItem({ label, published, total, percentage }: ContentOverviewItemProps) {
	return (
		<div className="space-y-2">
			<div className="flex justify-between text-sm">
				<span>{label}</span>
				<span>
					{published} / {total}
				</span>
			</div>
			<div className="h-2 bg-muted rounded-full overflow-hidden">
				<div
					className="h-full bg-primary rounded-full"
					style={{ width: `${percentage}%` }}
					aria-label={`${percentage}% published`}
				/>
			</div>
		</div>
	);
}

// Activity Item component
interface ActivityItemProps {
	title: string;
	description: string;
	icon: React.ReactNode;
	link: string;
}

function ActivityItem({ title, description, icon, link }: ActivityItemProps) {
	return (
		<Link to={link} className="block">
			<div className="flex items-center border rounded-lg p-3 hover:bg-accent/50 transition-colors">
				<div className="mr-3">{icon}</div>
				<div className="space-y-1">
					<p className="font-medium text-sm">{title}</p>
					<p className="text-xs text-muted-foreground">{description}</p>
				</div>
				<ArrowUpRight className="h-4 w-4 text-muted-foreground ml-auto" />
			</div>
		</Link>
	);
}

export default Dashboard;
