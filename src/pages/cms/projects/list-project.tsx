"use client";

import type React from "react";

import { useQuery } from "@tanstack/react-query";
import {
	collection,
	deleteDoc,
	doc,
	getDocs,
	limit,
	orderBy,
	query,
	startAfter,
	updateDoc,
	where,
	type DocumentData,
	type QueryDocumentSnapshot,
} from "firebase/firestore";
import {
	CalendarArrowUp,
	CalendarCog,
	CalendarPlus,
	Check,
	ExternalLink,
	Eye,
	Filter,
	Folder,
	FolderPlus,
	Github,
	MoreHorizontal,
	Pencil,
	RefreshCw,
	Search,
	Trash2,
	X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { toast } from "sonner";

import { CmsLayout } from "@/components/layout/cms-layout";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Chip from "@/components/ui/chip";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/auth-context";
import { db } from "@/lib/firebase";
import { formatDate } from "@/lib/utils";
import { Project } from "@/services";

// Number of projects to fetch per page
const PROJECTS_PER_PAGE = 10;

const CmsProjects = () => {
	const { user } = useAuth();
	const navigate = useNavigate();
	const [searchQuery, setSearchQuery] = useState("");
	const [filterStatus, setFilterStatus] = useState<string>("");
	const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
	const [hasMore, setHasMore] = useState(false);
	const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);

	const fetchProjects = async () => {
		try {
			// Build the query
			let projectsQuery = query(collection(db, "projects"), orderBy("createdAt", "desc"));

			// Add status filter if provided
			if (filterStatus && filterStatus !== "all") {
				const isPublished = filterStatus === "published";
				projectsQuery = query(projectsQuery, where("isPublished", "==", isPublished));
			}

			// Add pagination
			if (lastVisible && currentPage > 1) {
				projectsQuery = query(projectsQuery, startAfter(lastVisible), limit(PROJECTS_PER_PAGE));
			} else {
				projectsQuery = query(projectsQuery, limit(PROJECTS_PER_PAGE));
			}

			// Execute the query
			const snapshot = await getDocs(projectsQuery);

			// Get the last visible document for pagination
			const lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1];

			// Check if there are more results
			let hasMoreResults = false;
			if (lastVisibleDoc) {
				const nextQuery = query(
					collection(db, "projects"),
					// orderBy("createdAt", "desc"),
					startAfter(lastVisibleDoc),
					limit(1)
				);
				const nextSnapshot = await getDocs(nextQuery);
				hasMoreResults = !nextSnapshot.empty;
			}

			// Convert the documents to Project objects
			const projects = snapshot.docs.map(doc => ({
				id: doc.id,
				...doc.data(),
			})) as Project[];

			return {
				projects,
				lastVisible: lastVisibleDoc,
				hasMore: hasMoreResults,
			};
		} catch (error) {
			console.error("Error fetching projects:", error);
			throw error;
		}
	};

	const { data, isLoading, refetch, isRefetching } = useQuery({
		queryKey: ["projects", user?.uid, currentPage, filterStatus],
		queryFn: fetchProjects,
		enabled: !!user,
	});

	// Update state when data changes
	useEffect(() => {
		if (data) {
			setLastVisible(data.lastVisible);
			setHasMore(data.hasMore);
		}
	}, [data]);

	// Apply client-side search filtering
	useEffect(() => {
		if (data?.projects) {
			if (searchQuery) {
				const filtered = data.projects.filter(
					project =>
						project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
						project.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
						(project.technologies &&
							project.technologies.some(tech =>
								tech.toLowerCase().includes(searchQuery.toLowerCase())
							))
				);
				setFilteredProjects(filtered);
			} else {
				setFilteredProjects(data.projects);
			}
		}
	}, [data?.projects, searchQuery]);

	// Reset to first page when search query or filter changes
	useEffect(() => {
		setCurrentPage(1);
	}, [searchQuery, filterStatus]);

	if (!user) {
		return <Navigate to="/auth" />;
	}

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const handleFilterChange = (value: string) => {
		setFilterStatus(value);
	};

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		// Search is applied client-side in the useEffect
	};

	const handlePublishToggle = async (projectId: string, currentStatus: boolean) => {
		try {
			const projectRef = doc(db, "projects", projectId);
			await updateDoc(projectRef, {
				isPublished: !currentStatus,
				...(currentStatus ? {} : { publishedDate: new Date() }),
			});

			refetch();
			toast.success(currentStatus ? "Project unpublished" : "Project published");
		} catch (error) {
			console.error("Error toggling publish status:", error);
			toast.error("Failed to update project status");
		}
	};

	const handleDeleteProject = async (projectId: string) => {
		try {
			const projectRef = doc(db, "projects", projectId);
			await deleteDoc(projectRef);

			refetch();
			setProjectToDelete(null);
			toast.success("Project deleted successfully");
		} catch (error) {
			console.error("Error deleting project:", error);
			toast.error("Failed to delete project");
		}
	};

	// Define columns for DataTable
	const columns: ColumnDef<Project>[] = [
		{
			header: "Title",
			cell: project => (
				<div className="flex flex-col">
					<div className="font-medium">{project.title}</div>
					<div className="text-sm text-muted-foreground truncate max-w-lg">{project.summary}</div>
					<div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-1">
						{project.technologies &&
							project.technologies.slice(0, 3).map(tech => <Chip key={tech}>{tech}</Chip>)}
						{project.technologies && project.technologies.length > 3 && (
							<Chip>+{project.technologies.length - 3}</Chip>
						)}
					</div>
				</div>
			),
			className: "w-[350px]",
		},
		{
			header: "Status",
			cell: project => (
				<div className="flex flex-col items-start gap-1">
					<Badge variant={project.isPublished ? "default" : "secondary"}>
						{project.isPublished ? "Published" : "Draft"}
					</Badge>
					{project.isFeatured && (
						<Badge variant="outline" className="text-primary font-bold border border-primary">
							Featured
						</Badge>
					)}
				</div>
			),
			className: "hidden md:table-cell",
		},
		{
			header: "Date",
			cell: project => (
				<div className="flex flex-col gap-y-1">
					<div className="flex items-center text-muted-foreground text-sm">
						<CalendarArrowUp className="w-4 h-4 mr-1.5" />
						{formatDate(project.publishedDate)}
					</div>
					<div className="flex items-center text-muted-foreground text-sm">
						<CalendarCog className="w-4 h-4 mr-1.5" />
						{formatDate(project.updatedAt)}
					</div>
					<div className="flex items-center text-muted-foreground text-sm">
						<CalendarPlus className="w-4 h-4 mr-1.5" />
						{formatDate(project.createdAt)}
					</div>
				</div>
			),
			className: "hidden md:table-cell",
		},
		{
			header: "Links",
			cell: project => (
				<div className="flex space-x-3">
					{project.demoUrl && (
						<a
							href={project.demoUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="text-muted-foreground hover:text-primary transition-colors"
							title="View Demo"
						>
							<ExternalLink className="h-4 w-4" />
						</a>
					)}
					{project.repoUrl && (
						<a
							href={project.repoUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="text-muted-foreground hover:text-primary transition-colors"
							title="View Repository"
						>
							<Github className="h-4 w-4" />
						</a>
					)}
				</div>
			),
			className: "hidden md:table-cell",
		},
		{
			header: "Stats",
			cell: project => (
				<div className="text-sm">
					<div className="flex items-center gap-1">
						<Eye className="h-3.5 w-3.5" />
						<span>{project.views || 0} views</span>
					</div>
				</div>
			),
			className: "hidden md:table-cell",
		},
		{
			header: "Actions",
			cell: project => (
				<div className="flex justify-end">
					<AlertDialog
						open={projectToDelete === project.id}
						onOpenChange={open => !open && setProjectToDelete(null)}
					>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="icon" className="h-8 w-8">
									<MoreHorizontal className="h-4 w-4" />
									<span className="sr-only">Open menu</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem onClick={() => navigate(`/projects/${project.slug}`)}>
									<Eye className="h-4 w-4 mr-2" />
									View
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => navigate(`/cms/projects/form/${project.id}`)}>
									<Pencil className="h-4 w-4 mr-2" />
									Edit
								</DropdownMenuItem>
								{project.demoUrl && (
									<DropdownMenuItem asChild>
										<a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
											<ExternalLink className="h-4 w-4 mr-2" />
											Open Demo
										</a>
									</DropdownMenuItem>
								)}
								{project.repoUrl && (
									<DropdownMenuItem asChild>
										<a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
											<Github className="h-4 w-4 mr-2" />
											View Code
										</a>
									</DropdownMenuItem>
								)}
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onClick={() => handlePublishToggle(project.id, project.isPublished)}
									className={project.isPublished ? "text-destructive" : ""}
								>
									{project.isPublished ? (
										<>
											<X className="h-4 w-4 mr-2" />
											Unpublish
										</>
									) : (
										<>
											<Check className="h-4 w-4 mr-2" />
											Publish
										</>
									)}
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onClick={() => setProjectToDelete(project.id)}
									className="text-destructive"
								>
									<Trash2 className="h-4 w-4 mr-2" />
									Delete
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Are you sure?</AlertDialogTitle>
								<AlertDialogDescription>
									This action cannot be undone. This will permanently delete the project "
									{project.title}" and remove it from our servers.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction
									className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
									onClick={() => handleDeleteProject(project.id)}
								>
									Delete
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			),
			className: "w-[50px]",
		},
	];

	return (
		<CmsLayout>
			<div className="space-y-6">
				<div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
					<div>
						<h1 className="text-2xl font-bold tracking-tight">Projects</h1>
						<p className="text-muted-foreground">Manage and showcase your portfolio projects</p>
					</div>

					<div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
						<Button asChild>
							<Link to="/cms/projects/form">
								<FolderPlus className="mr-2 h-4 w-4" />
								New Project
							</Link>
						</Button>
					</div>
				</div>

				<div className="flex flex-col md:flex-row justify-between gap-4">
					<form onSubmit={handleSearch} className="relative w-full md:w-auto">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Search projects..."
							value={searchQuery}
							onChange={e => setSearchQuery(e.target.value)}
							className="pl-9 w-full md:w-[250px] rounded-lg"
						/>
					</form>

					<div className="flex gap-3">
						<Select value={filterStatus} onValueChange={handleFilterChange}>
							<SelectTrigger className="w-full sm:w-[180px] rounded-lg">
								<div className="flex items-center">
									<Filter className="mr-2 h-4 w-4" />
									<SelectValue placeholder="Filter by status" />
								</div>
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Projects</SelectItem>
								<SelectItem value="published">Published</SelectItem>
								<SelectItem value="draft">Drafts</SelectItem>
							</SelectContent>
						</Select>

						<Button
							variant="outline"
							size="icon"
							onClick={() => refetch()}
							disabled={isRefetching}
							className="rounded-lg"
						>
							<RefreshCw className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`} />
							<span className="sr-only">Refresh</span>
						</Button>
					</div>
				</div>

				<DataTable
					columns={columns}
					data={filteredProjects}
					isLoading={isLoading}
					keyField="id"
					emptyState={{
						icon: <Folder className="h-8 w-8 mb-2" />,
						title: "No projects found",
						description: searchQuery
							? "Try adjusting your search query"
							: filterStatus && filterStatus !== "all"
								? `No ${filterStatus} projects found`
								: "Get started by creating your first project",
					}}
					pagination={{
						currentPage,
						hasMore,
						onPageChange: handlePageChange,
					}}
					rowClassName={project => (!project.isPublished ? "bg-muted/30" : "")}
				/>
			</div>
		</CmsLayout>
	);
};

export default CmsProjects;
