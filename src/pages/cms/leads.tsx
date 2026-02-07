import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { serviceRequestService } from "@/services";
import type { ServiceRequest } from "@/services/service-requests/types";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Eye, Flame, Mail, Sparkles, TrendingUp } from "lucide-react";
import { useState } from "react";

export default function LeadsPage() {
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [priorityFilter, setPriorityFilter] = useState<"all" | "hot" | "warm" | "cold">("all");

	const { data, isLoading, error } = useQuery({
		queryKey: ["service-requests", statusFilter],
		queryFn: async () => {
			const result = await serviceRequestService.getRequests(1, null, statusFilter);
			return result?.requests || [];
		},
	});

	const filteredLeads =
		priorityFilter === "all"
			? data
			: data?.filter((lead) => lead.priority === priorityFilter);

	const hotLeads = data?.filter((lead) => lead.priority === "hot") || [];
	const warmLeads = data?.filter((lead) => lead.priority === "warm") || [];
	const coldLeads = data?.filter((lead) => lead.priority === "cold") || [];

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case "hot":
				return "bg-red-500";
			case "warm":
				return "bg-orange-500";
			case "cold":
				return "bg-blue-500";
			default:
				return "bg-gray-500";
		}
	};

	const getPriorityIcon = (priority: string) => {
		switch (priority) {
			case "hot":
				return <Flame className="w-4 h-4" />;
			case "warm":
				return <TrendingUp className="w-4 h-4" />;
			case "cold":
				return <Mail className="w-4 h-4" />;
			default:
				return null;
		}
	};

	const formatDate = (date: Date) => {
		return new Date(date).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-96">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
					<p className="text-muted-foreground">Loading leads...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center h-96">
				<div className="text-center">
					<p className="text-red-500">Error loading leads</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Service Requests</h1>
					<p className="text-muted-foreground">
						Manage and prioritize your incoming service requests
					</p>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid gap-4 md:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Leads</CardTitle>
						<Sparkles className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{data?.length || 0}</div>
						<p className="text-xs text-muted-foreground">All time requests</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Hot Leads</CardTitle>
						<Flame className="h-4 w-4 text-red-500" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-red-500">{hotLeads.length}</div>
						<p className="text-xs text-muted-foreground">High priority</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Warm Leads</CardTitle>
						<TrendingUp className="h-4 w-4 text-orange-500" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-orange-500">{warmLeads.length}</div>
						<p className="text-xs text-muted-foreground">Medium priority</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Cold Leads</CardTitle>
						<Mail className="h-4 w-4 text-blue-500" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-blue-500">{coldLeads.length}</div>
						<p className="text-xs text-muted-foreground">Standard priority</p>
					</CardContent>
				</Card>
			</div>

			{/* Filters */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle>All Service Requests</CardTitle>
							<CardDescription>View and manage your leads with scoring</CardDescription>
						</div>
						<div className="flex gap-2">
							<Select value={statusFilter} onValueChange={setStatusFilter}>
								<SelectTrigger className="w-[180px]">
									<SelectValue placeholder="Filter by status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Status</SelectItem>
									<SelectItem value="new">New</SelectItem>
									<SelectItem value="in-progress">In Progress</SelectItem>
									<SelectItem value="completed">Completed</SelectItem>
									<SelectItem value="cancelled">Cancelled</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<Tabs value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as any)}>
						<TabsList>
							<TabsTrigger value="all">All ({data?.length || 0})</TabsTrigger>
							<TabsTrigger value="hot" className="text-red-500">
								🔥 Hot ({hotLeads.length})
							</TabsTrigger>
							<TabsTrigger value="warm" className="text-orange-500">
								⚡ Warm ({warmLeads.length})
							</TabsTrigger>
							<TabsTrigger value="cold" className="text-blue-500">
								📧 Cold ({coldLeads.length})
							</TabsTrigger>
						</TabsList>

						<TabsContent value={priorityFilter} className="mt-6">
							<div className="rounded-md border">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Priority</TableHead>
											<TableHead>Name</TableHead>
											<TableHead>Company</TableHead>
											<TableHead>Service</TableHead>
											<TableHead>Budget</TableHead>
											<TableHead>Score</TableHead>
											<TableHead>Date</TableHead>
											<TableHead>Status</TableHead>
											<TableHead className="text-right">Actions</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{filteredLeads && filteredLeads.length > 0 ? (
											filteredLeads
												.sort((a, b) => b.leadScore - a.leadScore)
												.map((lead: ServiceRequest) => (
													<TableRow key={lead.id}>
														<TableCell>
															<div className="flex items-center gap-2">
																<div
																	className={`w-2 h-2 rounded-full ${getPriorityColor(lead.priority)}`}
																/>
																<Badge
																	variant={
																		lead.priority === "hot"
																			? "destructive"
																			: lead.priority === "warm"
																				? "default"
																				: "secondary"
																	}
																	className="flex items-center gap-1"
																>
																	{getPriorityIcon(lead.priority)}
																	{lead.priority.toUpperCase()}
																</Badge>
															</div>
														</TableCell>
														<TableCell className="font-medium">{lead.name}</TableCell>
														<TableCell>{lead.company || "-"}</TableCell>
														<TableCell className="capitalize">
															{lead.serviceType.replace("-", " ")}
														</TableCell>
														<TableCell>{lead.budget || "-"}</TableCell>
														<TableCell>
															<div className="flex items-center gap-2">
																<span className="font-bold text-lg">{lead.leadScore}</span>
																<span className="text-xs text-muted-foreground">/100</span>
															</div>
														</TableCell>
														<TableCell>
															<div className="flex items-center gap-1 text-sm text-muted-foreground">
																<Calendar className="w-3 h-3" />
																{formatDate(lead.createdAt)}
															</div>
														</TableCell>
														<TableCell>
															<Badge variant="outline" className="capitalize">
																{lead.status}
															</Badge>
														</TableCell>
														<TableCell className="text-right">
															<Button variant="ghost" size="sm">
																<Eye className="w-4 h-4" />
															</Button>
														</TableCell>
													</TableRow>
												))
										) : (
											<TableRow>
												<TableCell colSpan={9} className="text-center py-12">
													<div className="text-muted-foreground">
														<Mail className="w-12 h-12 mx-auto mb-4 opacity-20" />
														<p>No service requests found</p>
													</div>
												</TableCell>
											</TableRow>
										)}
									</TableBody>
								</Table>
							</div>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>

			{/* Recommendations Section */}
			{hotLeads.length > 0 && (
				<Card className="border-red-200 bg-red-50/50">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-red-700">
							<Flame className="w-5 h-5" />
							High Priority Actions Required
						</CardTitle>
						<CardDescription>
							You have {hotLeads.length} hot lead{hotLeads.length > 1 ? "s" : ""} requiring
							immediate attention
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ul className="space-y-2">
							{hotLeads.slice(0, 3).map((lead: ServiceRequest) => (
								<li key={lead.id} className="flex items-start gap-2">
									<span className="text-red-500">•</span>
									<div>
										<p className="font-medium">
											{lead.name} - Score: {lead.leadScore}/100
										</p>
										<p className="text-sm text-muted-foreground">
											{lead.recommendations[0] || "Respond within 1 hour"}
										</p>
									</div>
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
