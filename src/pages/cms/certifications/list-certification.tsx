"use client";

import type React from "react";

import { useInfiniteQuery } from "@tanstack/react-query";
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
	Award,
	Calendar,
	Check,
	ExternalLink,
	Filter,
	MoreHorizontal,
	Pencil,
	Plus,
	RefreshCw,
	Search,
	Shield,
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

// Type for certification data from Firestore
interface CertificationData {
	id: string;
	title: string;
	issuer: string;
	issuerLogo?: string;
	issueDate: any;
	expiryDate?: any;
	credentialId?: string;
	credentialUrl?: string;
	thumbnailUrl: string;
	description: string;
	skills?: string[];
	isEnterprise?: boolean;
	isPublished: boolean;
	order?: number;
	createdAt?: any;
	updatedAt?: any;
}

const ITEMS_PER_PAGE = 30;

const CmsCertifications = () => {
	const { user } = useAuth();
	const navigate = useNavigate();
	const [searchQuery, setSearchQuery] = useState("");
	const [filterStatus, setFilterStatus] = useState<string>("all");
	const [certificationToDelete, setCertificationToDelete] = useState<string | null>(null);

	const fetchCertifications = async ({ pageParam }: { pageParam?: QueryDocumentSnapshot<DocumentData> | null }) => {
		try {
			// Build the query
			let certificationsQuery = query(
				collection(db, "certifications"),
				orderBy("createdAt", "desc"),
				limit(ITEMS_PER_PAGE)
			);

			// Add status filter if provided
			if (filterStatus && filterStatus !== "all") {
				const isPublished = filterStatus === "published";
				certificationsQuery = query(
					collection(db, "certifications"),
					where("isPublished", "==", isPublished),
					orderBy("createdAt", "desc"),
					limit(ITEMS_PER_PAGE)
				);
			}

			// Add pagination cursor
			if (pageParam) {
				certificationsQuery = query(certificationsQuery, startAfter(pageParam));
			}

			// Execute the query
			const snapshot = await getDocs(certificationsQuery);

			// Convert the documents to Certification objects
			const certifications = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			})) as CertificationData[];

			// Get the last visible document for next page
			const lastVisible = snapshot.docs[snapshot.docs.length - 1];

			return {
				certifications,
				nextCursor: snapshot.docs.length === ITEMS_PER_PAGE ? lastVisible : undefined,
			};
		} catch (error) {
			console.error("Error fetching certifications:", error);
			throw error;
		}
	};

	const {
		data,
		isLoading,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		refetch,
		isRefetching,
		error,
	} = useInfiniteQuery({
		queryKey: ["cms-certifications", user?.uid, filterStatus],
		queryFn: fetchCertifications,
		getNextPageParam: (lastPage) => lastPage.nextCursor,
		enabled: !!user,
		initialPageParam: null,
		staleTime: 30000,
	});

	// Flatten all pages into single array
	const certifications = data?.pages.flatMap((page) => page.certifications) ?? [];

	// Client-side search filtering
	const filteredCertifications = searchQuery
		? certifications.filter(
				(cert) =>
					cert.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
					cert.issuer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
					cert.description?.toLowerCase().includes(searchQuery.toLowerCase())
		  )
		: certifications;

	// Show error if query fails
	useEffect(() => {
		if (error) {
			console.error("Error loading certifications:", error);
			toast.error("Failed to load certifications");
		}
	}, [error]);

	if (!user) {
		return <Navigate to="/auth" />;
	}

	const handleDelete = async (id: string) => {
		try {
			await deleteDoc(doc(db, "certifications", id));
			toast.success("Certification deleted successfully!");
			refetch();
		} catch (error) {
			console.error("Error deleting certification:", error);
			toast.error("Failed to delete certification");
		} finally {
			setCertificationToDelete(null);
		}
	};

	const handleTogglePublish = async (id: string, currentStatus: boolean) => {
		try {
			await updateDoc(doc(db, "certifications", id), {
				isPublished: !currentStatus,
			});
			toast.success(`Certification ${!currentStatus ? "published" : "unpublished"} successfully!`);
			refetch();
		} catch (error) {
			console.error("Error updating certification:", error);
			toast.error("Failed to update certification");
		}
	};

	const columns: ColumnDef<CertificationData>[] = [
		{
			header: "Badge",
			cell: cert => {
				return (
					<div className="flex items-center gap-2">
						<img
							src={cert.thumbnailUrl}
							alt={cert.title}
							className="w-12 h-12 object-contain rounded"
						/>
					</div>
				);
			},
		},
		{
			header: "Title",
			accessorKey: "title",
			cell: (cert) => {
				return (
					<div className="space-y-1">
						<div className="font-medium">{cert.title}</div>
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							{cert.issuerLogo && (
								<img
									src={cert.issuerLogo}
									alt={cert.issuer}
									className="w-4 h-4 object-contain"
								/>
							)}
							<span>{cert.issuer}</span>
						</div>
					</div>
				);
			},
		},
		{
			header: "Issue Date",
			cell: (cert) => {
				if (!cert) return null;
				const issueDate = cert?.issueDate;
				return (
					<div className="flex items-center gap-2">
						<Calendar className="h-4 w-4 text-muted-foreground" />
						<span className="text-sm">
							{issueDate && issueDate.toDate
								? formatDate(issueDate.toDate())
								: issueDate
								? formatDate(new Date(issueDate))
								: "N/A"}
						</span>
					</div>
				);
			},
		},
		{
			header: "Status",
			cell: cert => {
				if (!cert) return null;
				return (
					<div className="flex flex-wrap gap-2">
						{cert.isPublished ? (
							<Badge variant="default" className="gap-1">
								<Check className="h-3 w-3" />
								Published
							</Badge>
						) : (
							<Badge variant="secondary" className="gap-1">
								<X className="h-3 w-3" />
								Draft
							</Badge>
						)}
						{cert.isEnterprise && (
							<Badge variant="outline" className="gap-1 border-primary text-primary">
								<Shield className="h-3 w-3" />
								Enterprise
							</Badge>
						)}
					</div>
				);
			},
		},
		{
			header: "Order",
			accessorKey: "order",
			cell: (cert) => {
				if (!cert) return null;
				return (
					<span className="text-sm text-muted-foreground">{cert.order || 0}</span>
				);
			},
		},
		{
			header: "Actions",
			cell: (cert) => {
				if (!cert) return null;
				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon">
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={() => navigate(`/cms/certifications/form/${cert.id}`)}>
								<Pencil className="mr-2 h-4 w-4" />
								Edit
							</DropdownMenuItem>
							{cert.credentialUrl && (
								<DropdownMenuItem asChild>
									<a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer">
										<ExternalLink className="mr-2 h-4 w-4" />
										View Credential
									</a>
								</DropdownMenuItem>
							)}
							<DropdownMenuItem
								onClick={() => handleTogglePublish(cert.id, cert.isPublished)}
							>
								{cert.isPublished ? (
									<>
										<X className="mr-2 h-4 w-4" />
										Unpublish
									</>
								) : (
									<>
										<Check className="mr-2 h-4 w-4" />
										Publish
									</>
								)}
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={() => setCertificationToDelete(cert.id)}
								className="text-destructive"
							>
								<Trash2 className="mr-2 h-4 w-4" />
								Delete
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
	];

	return (
		<CmsLayout>
			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
					<div>
						<h1 className="text-3xl font-bold mb-2">Certifications</h1>
						<p className="text-muted-foreground">Manage your professional certifications</p>
					</div>
					<Button onClick={() => navigate("/cms/certifications/form")}>
						<Plus className="mr-2 h-4 w-4" />
						Add Certification
					</Button>
				</div>

				{/* Filters */}
				<div className="flex flex-col md:flex-row gap-4 mb-6">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Search certifications..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-9"
						/>
					</div>
					<Select value={filterStatus} onValueChange={setFilterStatus}>
						<SelectTrigger className="w-full md:w-48">
							<SelectValue placeholder="Filter by status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Status</SelectItem>
							<SelectItem value="published">Published</SelectItem>
							<SelectItem value="draft">Draft</SelectItem>
						</SelectContent>
					</Select>
					<Button variant="outline" onClick={() => refetch()} disabled={isRefetching}>
						<RefreshCw className={`mr-2 h-4 w-4 ${isRefetching ? "animate-spin" : ""}`} />
						Refresh
					</Button>
				</div>

				{/* Stats */}
				{!isLoading && certifications.length > 0 && (
					<div className="mb-4 text-sm text-muted-foreground">
						Showing {filteredCertifications.length} of {certifications.length} certifications
						{hasNextPage && " (scroll to load more)"}
					</div>
				)}

				{/* Table */}
				<div className="rounded-md border bg-card">
					<DataTable
						columns={columns}
						data={filteredCertifications}
						isLoading={isLoading}
						keyField="id"
						emptyMessage={
							isLoading
								? "Loading certifications..."
								: error
								? "Error loading certifications. Please refresh."
								: "No certifications found. Click 'Add Certification' to create one."
						}
					/>
				</div>

				{/* Load More Button */}
				{hasNextPage && (
					<div className="flex justify-center mt-6">
						<Button
							variant="outline"
							onClick={() => fetchNextPage()}
							disabled={isFetchingNextPage}
						>
							{isFetchingNextPage ? (
								<>
									<RefreshCw className="mr-2 h-4 w-4 animate-spin" />
									Loading more...
								</>
							) : (
								<>
									Load More
								</>
							)}
						</Button>
					</div>
				)}

				{/* Delete Confirmation Dialog */}
				<AlertDialog
					open={!!certificationToDelete}
					onOpenChange={() => setCertificationToDelete(null)}
				>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Are you sure?</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. This will permanently delete the certification from
								the database.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction
								onClick={() => certificationToDelete && handleDelete(certificationToDelete)}
								className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
							>
								Delete
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>
		</CmsLayout>
	);
};

export default CmsCertifications;
