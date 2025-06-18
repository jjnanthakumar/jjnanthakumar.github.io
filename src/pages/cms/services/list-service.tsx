"use client";

import type React from "react";

import { CmsLayout } from "@/components/layout/cms-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useLoadingState } from "@/hooks/use-loading-state";
import { ServiceRequest, serviceRequestService } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import type { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import {
	Briefcase,
	Calendar,
	CheckCircle,
	Clock,
	DollarSign,
	Eye,
	Filter,
	Mail,
	RefreshCw,
	Search,
	XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const CmsServices = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
	const [hasMore, setHasMore] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [filterStatus, setFilterStatus] = useState<string>("");
	const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
	const [isDetailOpen, setIsDetailOpen] = useState(false);
	const [filteredRequests, setFilteredRequests] = useState<ServiceRequest[]>([]);
	const { withLoading } = useLoadingState();

	const { data, isLoading, refetch, isRefetching } = useQuery({
		queryKey: ["serviceRequests", currentPage, filterStatus],
		queryFn: () =>
			serviceRequestService.getRequests(
				currentPage,
				currentPage === 1 ? null : lastVisible,
				filterStatus || undefined,
			),
	});

	useEffect(() => {
		if (data) {
			setLastVisible(data.lastVisible);
			setHasMore(data.hasMore);

			// Apply client-side search filtering
			if (searchQuery) {
				const filtered = data.requests.filter(
					(request) =>
						request.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
						request.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
						request.serviceType.toLowerCase().includes(searchQuery.toLowerCase()),
				);
				setFilteredRequests(filtered);
			} else {
				setFilteredRequests(data.requests);
			}
		}
	}, [data, searchQuery]);

	const handleViewRequest = async (id: string) => {
		try {
			// Start loading state
			const request = await withLoading(
				async () => {
					const result = await serviceRequestService.getById(id);
					return result;
				},
				{ loadingText: "Loading service request details..." },
			);

			if (request) {
				setSelectedRequest(request);
				setIsDetailOpen(true);

				// Mark as in-progress if it's new
				if (request.status === "new") {
					await serviceRequestService.updateStatus(id, "in-progress");
					refetch();
				}
			}
		} catch (error) {
			console.error("Error fetching service request details:", error);
			toast.error("Failed to load service request details");
		}
	};

	const handleUpdateStatus = async (
		id: string,
		status: "new" | "in-progress" | "completed" | "cancelled",
	) => {
		try {
			await serviceRequestService.updateStatus(id, status);
			toast.success(`Service request marked as ${status}`);
			refetch();
			if (selectedRequest?.id === id) {
				setSelectedRequest({ ...selectedRequest, status });
			}
		} catch (error) {
			console.error("Error updating service request status:", error);
			toast.error("Failed to update service request status");
		}
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		// Search is applied client-side in the useEffect
	};

	const handleFilterChange = (value: string) => {
		setFilterStatus(value);
		setCurrentPage(1); // Reset to first page when filter changes
	};

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "new":
				return <Badge variant="default">New</Badge>;
			case "in-progress":
				return <Badge variant="secondary">In Progress</Badge>;
			case "completed":
				return (
					<Badge variant="default" className="bg-green-500">
						Completed
					</Badge>
				);
			case "cancelled":
				return <Badge variant="destructive">Cancelled</Badge>;
			default:
				return <Badge variant="outline">{status}</Badge>;
		}
	};

	const formatDate = (date: Date) => {
		return format(date, "dd MMM yyyy HH:mm");
	};

	const getServiceTypeLabel = (serviceType: string) => {
		const serviceTypes: Record<string, string> = {
			frontend: "Frontend Development",
			performance: "Performance Optimization",
			api: "API Integration",
			leadership: "Technical Leadership",
		};

		return serviceTypes[serviceType] || serviceType;
	};

	const getBudgetLabel = (budget: string) => {
		const budgets: Record<string, string> = {
			"under-1000": "Under $1,000",
			"1000-5000": "$1,000 - $5,000",
			"5000-10000": "$5,000 - $10,000",
			"10000-plus": "$10,000+",
			hourly: "Hourly rate",
		};

		return budgets[budget] || budget;
	};

	const getTimeframeLabel = (timeframe: string) => {
		const timeframes: Record<string, string> = {
			asap: "As soon as possible",
			"1-2-weeks": "Within 1-2 weeks",
			"1-month": "Within a month",
			flexible: "Flexible / Not urgent",
		};

		return timeframes[timeframe] || timeframe;
	};

	// Define columns for the DataTable
	const columns: ColumnDef<ServiceRequest>[] = [
		{
			header: "Client",
			cell: (request) => (
				<div className="flex items-start gap-2">
					<Briefcase
						className={`h-4 w-4 mt-1 ${
							request.status === "new" ? "text-primary" : "text-muted-foreground"
						}`}
					/>
					<div>
						<div>{request.name}</div>
						<div className="text-sm text-muted-foreground">{request.email}</div>
						{request.company && (
							<div className="text-xs text-muted-foreground">{request.company}</div>
						)}
					</div>
				</div>
			),
			className: "w-[250px]",
		},
		{
			header: "Service",
			cell: (request) => (
				<div className="max-w-xs truncate">{getServiceTypeLabel(request.serviceType)}</div>
			),
		},
		{
			header: "Budget",
			cell: (request) => (
				<div className="flex items-center text-muted-foreground text-sm">
					<DollarSign className="h-3.5 w-3.5 mr-1.5" />
					{getBudgetLabel(request.budget)}
				</div>
			),
			className: "hidden md:table-cell",
		},
		{
			header: "Timeframe",
			cell: (request) => (
				<div className="flex items-center text-muted-foreground text-sm">
					<Clock className="h-3.5 w-3.5 mr-1.5" />
					{getTimeframeLabel(request.timeframe)}
				</div>
			),
			className: "hidden md:table-cell",
		},
		{
			header: "Date",
			cell: (request) => (
				<div className="flex items-center text-muted-foreground text-sm">
					<Calendar className="h-3.5 w-3.5 mr-1.5" />
					{formatDate(request.createdAt)}
				</div>
			),
			className: "hidden md:table-cell",
		},
		{
			header: "Status",
			cell: (request) => getStatusBadge(request.status),
			className: "hidden md:table-cell",
		},
		{
			header: "Actions",
			cell: (request) => (
				<div className="flex justify-end gap-2">
					<Button
						variant="ghost"
						size="sm"
						onClick={() => handleViewRequest(request.id)}
						className="h-8 px-2"
					>
						<Eye className="h-4 w-4 mr-1" />
						View
					</Button>
				</div>
			),
			className: "text-right",
		},
	];

	return (
		<CmsLayout>
			<div className="space-y-6">
				<div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
					<div>
						<h1 className="text-2xl font-bold tracking-tight">Service Requests</h1>
						<p className="text-muted-foreground">
							Manage and respond to service requests from clients
						</p>
					</div>

					<div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
						<form onSubmit={handleSearch} className="relative w-full sm:w-auto">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search requests..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-9 w-full sm:w-[250px] rounded-lg"
							/>
						</form>

						<Select value={filterStatus} onValueChange={handleFilterChange}>
							<SelectTrigger className="w-full sm:w-[180px] rounded-lg">
								<div className="flex items-center">
									<Filter className="mr-2 h-4 w-4" />
									<SelectValue placeholder="Filter by status" />
								</div>
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Requests</SelectItem>
								<SelectItem value="new">New</SelectItem>
								<SelectItem value="in-progress">In Progress</SelectItem>
								<SelectItem value="completed">Completed</SelectItem>
								<SelectItem value="cancelled">Cancelled</SelectItem>
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
					data={filteredRequests}
					isLoading={isLoading}
					loadingRows={5}
					emptyState={{
						icon: <Briefcase className="h-8 w-8 mb-2" />,
						title: "No service requests found",
						description: searchQuery
							? "Try adjusting your search query"
							: filterStatus
								? `No ${filterStatus} requests found`
								: "No service requests yet",
					}}
					pagination={{
						currentPage,
						hasMore,
						onPageChange: handlePageChange,
					}}
					rowClassName={(request) => (request.status === "new" ? "bg-primary/5" : "")}
					keyField="id"
				/>
			</div>

			{/* Service Request Detail Dialog */}
			<Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
				<DialogContent className="sm:max-w-2xl">
					<DialogHeader>
						<DialogTitle>Service Request</DialogTitle>
						<DialogDescription>
							Request from {selectedRequest?.name} ({selectedRequest?.email})
						</DialogDescription>
					</DialogHeader>

					{selectedRequest && (
						<div className="space-y-4">
							<div className="flex justify-between items-center">
								<div className="text-sm text-muted-foreground">
									<Calendar className="inline-block h-3.5 w-3.5 mr-1.5 -mt-0.5" />
									{formatDate(selectedRequest.createdAt)}
								</div>
								{getStatusBadge(selectedRequest.status)}
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="bg-muted/30 p-4 rounded-lg">
									<div className="font-medium mb-2">Service Details</div>
									<div className="space-y-2 text-sm">
										<div>
											<span className="text-muted-foreground">Service Type:</span>{" "}
											{getServiceTypeLabel(selectedRequest.serviceType)}
										</div>
										<div>
											<span className="text-muted-foreground">Budget:</span>{" "}
											{getBudgetLabel(selectedRequest.budget)}
										</div>
										<div>
											<span className="text-muted-foreground">Timeframe:</span>{" "}
											{getTimeframeLabel(selectedRequest.timeframe)}
										</div>
									</div>
								</div>

								<div className="bg-muted/30 p-4 rounded-lg">
									<div className="font-medium mb-2">Client Information</div>
									<div className="space-y-2 text-sm">
										<div>
											<span className="text-muted-foreground">Name:</span> {selectedRequest.name}
										</div>
										<div>
											<span className="text-muted-foreground">Email:</span>{" "}
											<a
												href={`mailto:${selectedRequest.email}`}
												className="text-primary hover:underline"
											>
												{selectedRequest.email}
											</a>
										</div>
										{selectedRequest.company && (
											<div>
												<span className="text-muted-foreground">Company:</span>{" "}
												{selectedRequest.company}
											</div>
										)}
									</div>
								</div>
							</div>

							<div>
								<h3 className="text-lg font-semibold mb-2">Project Details</h3>
								<Separator className="my-2" />
								<div className="whitespace-pre-wrap text-muted-foreground bg-muted/20 p-4 rounded-lg max-h-60 overflow-y-auto">
									{selectedRequest.projectDetails}
								</div>
							</div>
						</div>
					)}

					<DialogFooter className="flex-col sm:flex-row gap-2">
						<div className="flex gap-2 w-full sm:w-auto">
							<Button
								variant="outline"
								size="sm"
								onClick={() =>
									selectedRequest && handleUpdateStatus(selectedRequest.id, "in-progress")
								}
								disabled={selectedRequest?.status === "in-progress"}
								className="flex-1"
							>
								<Clock className="h-4 w-4 mr-2" />
								Mark In Progress
							</Button>

							<Button
								variant="outline"
								size="sm"
								onClick={() =>
									selectedRequest && handleUpdateStatus(selectedRequest.id, "completed")
								}
								disabled={selectedRequest?.status === "completed"}
								className="flex-1"
							>
								<CheckCircle className="h-4 w-4 mr-2" />
								Mark Completed
							</Button>

							<Button
								variant="outline"
								size="sm"
								onClick={() =>
									selectedRequest && handleUpdateStatus(selectedRequest.id, "cancelled")
								}
								disabled={selectedRequest?.status === "cancelled"}
								className="flex-1 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
							>
								<XCircle className="h-4 w-4 mr-2" />
								Cancel
							</Button>
						</div>

						<Button asChild className="w-full sm:w-auto">
							<a href={`mailto:${selectedRequest?.email}`}>
								<Mail className="h-4 w-4 mr-2" />
								Reply via Email
							</a>
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</CmsLayout>
	);
};

export default CmsServices;
