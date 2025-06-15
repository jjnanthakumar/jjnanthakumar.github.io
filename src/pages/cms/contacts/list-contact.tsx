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
import { contactService } from "@/services";
import { Contact } from "@/services/contacts/types";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import type { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import {
	Archive,
	Calendar,
	CheckCircle,
	Eye,
	Filter,
	Inbox,
	Mail,
	RefreshCw,
	Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const CmsContacts = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
	const [hasMore, setHasMore] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [filterStatus, setFilterStatus] = useState<string>("");
	const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
	const [isDetailOpen, setIsDetailOpen] = useState(false);
	const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
	const { withLoading } = useLoadingState();

	const { data, isLoading, refetch, isRefetching } = useQuery({
		queryKey: ["contacts", currentPage, filterStatus],
		queryFn: () =>
			contactService.getContacts(
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
				const filtered = data.contacts.filter(
					(contact) =>
						contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
						contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
						contact.subject.toLowerCase().includes(searchQuery.toLowerCase()),
				);
				setFilteredContacts(filtered);
			} else {
				setFilteredContacts(data.contacts);
			}
		}
	}, [data, searchQuery]);

	const handleViewContact = async (id: string) => {
		try {
			// Start loading state
			const contact = await withLoading(
				async () => {
					const result = await contactService.getById(id);
					return result;
				},
				{ loadingText: "Loading contact details..." },
			);

			if (contact) {
				setSelectedContact(contact);
				setIsDetailOpen(true);

				// Mark as read if it's new
				if (contact.status === "new") {
					await contactService.updateStatus(id, "read");
					refetch();
				}
			}
		} catch (error) {
			console.error("Error fetching contact details:", error);
			toast.error("Failed to load contact details");
		}
	};

	const handleUpdateStatus = async (
		id: string,
		status: "new" | "read" | "replied" | "archived",
	) => {
		try {
			await contactService.updateStatus(id, status);
			toast.success(`Contact marked as ${status}`);
			refetch();
			if (selectedContact?.id === id) {
				setSelectedContact({ ...selectedContact, status });
			}
		} catch (error) {
			console.error("Error updating contact status:", error);
			toast.error("Failed to update contact status");
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
			case "read":
				return <Badge variant="secondary">Read</Badge>;
			case "replied":
				return (
					<Badge variant="default" className="bg-green-500">
						Replied
					</Badge>
				);
			case "archived":
				return <Badge variant="outline">Archived</Badge>;
			default:
				return <Badge variant="outline">{status}</Badge>;
		}
	};

	const formatDate = (date: Date) => {
		return format(date, "dd MMM yyyy HH:mm");
	};

	// Define columns for the DataTable
	const columns: ColumnDef<Contact>[] = [
		{
			header: "Name",
			cell: (contact) => (
				<div className="flex items-start gap-2">
					<Mail
						className={`h-4 w-4 mt-1 ${
							contact.status === "new" ? "text-primary" : "text-muted-foreground"
						}`}
					/>
					<div>
						<div>{contact.name}</div>
						<div className="text-sm text-muted-foreground">{contact.email}</div>
					</div>
				</div>
			),
			className: "w-[250px]",
		},
		{
			header: "Subject",
			cell: (contact) => <div className="max-w-xs truncate">{contact.subject}</div>,
		},
		{
			header: "Date",
			cell: (contact) => (
				<div className="flex items-center text-muted-foreground text-sm">
					<Calendar className="h-3.5 w-3.5 mr-1.5" />
					{formatDate(contact.createdAt)}
				</div>
			),
			className: "hidden md:table-cell",
		},
		{
			header: "Status",
			cell: (contact) => getStatusBadge(contact.status),
			className: "hidden md:table-cell",
		},
		{
			header: "Actions",
			cell: (contact) => (
				<div className="flex justify-end gap-2">
					<Button
						variant="ghost"
						size="sm"
						onClick={() => handleViewContact(contact.id)}
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
						<h1 className="text-2xl font-bold tracking-tight">Contact Messages</h1>
						<p className="text-muted-foreground">Manage and respond to contact form submissions</p>
					</div>

					<div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
						<form onSubmit={handleSearch} className="relative w-full sm:w-auto">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search contacts..."
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
								<SelectItem value="all">All Messages</SelectItem>
								<SelectItem value="new">New</SelectItem>
								<SelectItem value="read">Read</SelectItem>
								<SelectItem value="replied">Replied</SelectItem>
								<SelectItem value="archived">Archived</SelectItem>
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
					data={filteredContacts}
					isLoading={isLoading}
					loadingRows={5}
					emptyState={{
						icon: <Inbox className="h-8 w-8 mb-2" />,
						title: "No contacts found",
						description: searchQuery
							? "Try adjusting your search query"
							: filterStatus
								? `No ${filterStatus} messages found`
								: "No contact messages yet",
					}}
					pagination={{
						currentPage,
						hasMore,
						onPageChange: handlePageChange,
					}}
					rowClassName={(contact) => (contact.status === "new" ? "bg-primary/5" : "")}
					keyField="id"
				/>
			</div>

			{/* Contact Detail Dialog */}
			<Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
				<DialogContent className="sm:max-w-2xl">
					<DialogHeader>
						<DialogTitle>Contact Message</DialogTitle>
						<DialogDescription>
							Message from {selectedContact?.name} ({selectedContact?.email})
						</DialogDescription>
					</DialogHeader>

					{selectedContact && (
						<div className="space-y-4">
							<div className="flex justify-between items-center">
								<div className="text-sm text-muted-foreground">
									<Calendar className="inline-block h-3.5 w-3.5 mr-1.5 -mt-0.5" />
									{formatDate(selectedContact.createdAt)}
								</div>
								{getStatusBadge(selectedContact.status)}
							</div>

							<div>
								<h3 className="text-lg font-semibold">{selectedContact.subject}</h3>
								<Separator className="my-3" />
								<div className="whitespace-pre-wrap text-muted-foreground">
									{selectedContact.message}
								</div>
							</div>

							<div className="bg-muted/30 p-4 rounded-lg">
								<div className="font-medium mb-1">Contact Information</div>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
									<div>
										<span className="text-muted-foreground">Name:</span> {selectedContact.name}
									</div>
									<div>
										<span className="text-muted-foreground">Email:</span>{" "}
										<a
											href={`mailto:${selectedContact.email}`}
											className="text-primary hover:underline"
										>
											{selectedContact.email}
										</a>
									</div>
								</div>
							</div>
						</div>
					)}

					<DialogFooter className="flex-col sm:flex-row gap-2">
						<div className="flex gap-2 w-full sm:w-auto">
							<Button
								variant="outline"
								size="sm"
								onClick={() => selectedContact && handleUpdateStatus(selectedContact.id, "read")}
								disabled={selectedContact?.status === "read"}
								className="flex-1"
							>
								<Eye className="h-4 w-4 mr-2" />
								Mark as Read
							</Button>

							<Button
								variant="outline"
								size="sm"
								onClick={() => selectedContact && handleUpdateStatus(selectedContact.id, "replied")}
								disabled={selectedContact?.status === "replied"}
								className="flex-1"
							>
								<CheckCircle className="h-4 w-4 mr-2" />
								Mark as Replied
							</Button>

							<Button
								variant="outline"
								size="sm"
								onClick={() =>
									selectedContact && handleUpdateStatus(selectedContact.id, "archived")
								}
								disabled={selectedContact?.status === "archived"}
								className="flex-1"
							>
								<Archive className="h-4 w-4 mr-2" />
								Archive
							</Button>
						</div>

						<Button asChild className="w-full sm:w-auto">
							<a href={`mailto:${selectedContact?.email}`}>
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

export default CmsContacts;
