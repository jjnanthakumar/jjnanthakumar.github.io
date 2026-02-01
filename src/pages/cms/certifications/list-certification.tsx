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

// Number of certifications to fetch per page
const CERTIFICATIONS_PER_PAGE = 10;

const CmsCertifications = () => {
	const { user } = useAuth();
	const navigate = useNavigate();
	const [searchQuery, setSearchQuery] = useState("");
	const [filterStatus, setFilterStatus] = useState<string>("all");
	const [certificationToDelete, setCertificationToDelete] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
	const [hasMore, setHasMore] = useState(false);
	const [filteredCertifications, setFilteredCertifications] = useState<CertificationData[]>([]);

	const fetchCertifications = async () => {
		try {
			// Build the query - start simple
			let certificationsQuery = query(
				collection(db, "certifications"),
				orderBy("createdAt", "desc")
			);

			// Add status filter if provided
			if (filterStatus && filterStatus !== "all") {
				const isPublished = filterStatus === "published";
				certificationsQuery = query(
					collection(db, "certifications"),
					where("isPublished", "==", isPublished),
					orderBy("createdAt", "desc")
				);
			}

			// Add pagination
			if (lastVisible && currentPage > 1) {
				certificationsQuery = query(
					certificationsQuery,
					startAfter(lastVisible),
					limit(CERTIFICATIONS_PER_PAGE)
				);
			} else {
				certificationsQuery = query(certificationsQuery, limit(CERTIFICATIONS_PER_PAGE));
			}

			// Execute the query
			const snapshot = await getDocs(certificationsQuery);

			// Get the last visible document for pagination
			const lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1];

			// Check if there are more results
			let hasMoreResults = false;
			if (lastVisibleDoc) {
				const nextQuery = query(
					collection(db, "certifications"),
					startAfter(lastVisibleDoc),
					limit(1)
				);
				const nextSnapshot = await getDocs(nextQuery);
				hasMoreResults = !nextSnapshot.empty;
			}

			// Convert the documents to Certification objects
			const certifications = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			})) as CertificationData[];


			return {
				certifications,
				lastVisible: lastVisibleDoc,
				hasMore: hasMoreResults,
			};
		} catch (error) {
			console.error("Error fetching certifications:", error);
			throw error;
		}
	};

	const { data, isLoading, refetch, isRefetching, error } = useQuery({
		queryKey: ["certifications", user?.uid, currentPage, filterStatus],
		queryFn: fetchCertifications,
		enabled: !!user,
	});

	useEffect(() => {
		if (data) {
			setLastVisible(data.lastVisible);
			setHasMore(data.hasMore);

			// Apply search filter
			if (searchQuery) {
				const filtered = data.certifications.filter(
					(cert) =>
						cert.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
						cert.issuer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
						cert.description?.toLowerCase().includes(searchQuery.toLowerCase())
				);
				setFilteredCertifications(filtered);
			} else {
				setFilteredCertifications(data.certifications);
			}
		} else {
			// If no data, make sure filtered list is empty
			setFilteredCertifications([]);
		}
	}, [data, searchQuery]);

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

				{/* Debug Info */}
				{!isLoading && (
					<div className="mb-4 text-sm text-muted-foreground">
						Total: {data?.certifications?.length || 0} | Filtered: {filteredCertifications.length}
					</div>
				)}

				{/* Table */}
				<div className="rounded-md border bg-card">
					<DataTable
						columns={columns}
						data={filteredCertifications}
						isLoading={isLoading}
						emptyMessage={
							isLoading
								? "Loading certifications..."
								: error
								? "Error loading certifications. Please refresh."
								: "No certifications found. Click 'Add Certification' to create one."
						}
					/>
				</div>

				{/* Pagination */}
				{(currentPage > 1 || hasMore) && (
					<div className="flex items-center justify-between mt-6">
						<Button
							variant="outline"
							onClick={() => {
								setCurrentPage((prev) => Math.max(1, prev - 1));
								setLastVisible(null);
							}}
							disabled={currentPage === 1 || isLoading}
						>
							Previous
						</Button>
						<span className="text-sm text-muted-foreground">Page {currentPage}</span>
						<Button
							variant="outline"
							onClick={() => setCurrentPage((prev) => prev + 1)}
							disabled={!hasMore || isLoading}
						>
							Next
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
