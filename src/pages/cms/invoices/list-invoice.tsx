import { InvoicePDF } from "@/components/invoice/invoice-pdf";
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
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { invoiceService } from "@/services/invoice/invoice-service";
import { Invoice, InvoiceStatus } from "@/types/invoice";
import { pdf } from "@react-pdf/renderer";
import { format } from "date-fns";
import {
	Download,
	Edit,
	FileText,
	Filter,
	Loader2,
	Plus,
	Search,
	Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

const InvoiceList = () => {
	const navigate = useNavigate();
	const [invoices, setInvoices] = useState<Invoice[]>([]);
	const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [generatingPDF, setGeneratingPDF] = useState<string | null>(null);

	// Filter states
	const [searchTerm, setSearchTerm] = useState("");
	const [clientFilter, setClientFilter] = useState<string>("all");
	const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "all">("all");
	const [clients, setClients] = useState<string[]>([]);

	useEffect(() => {
		loadInvoices();
		loadClients();
	}, []);

	useEffect(() => {
		applyFilters();
	}, [invoices, searchTerm, clientFilter, statusFilter]);

	const loadInvoices = async () => {
		setIsLoading(true);
		try {
			const data = await invoiceService.getAllInvoices();
			setInvoices(data);
		} catch (error) {
			toast.error("Failed to load invoices");
		} finally {
			setIsLoading(false);
		}
	};

	const loadClients = async () => {
		try {
			const clientList = await invoiceService.getUniqueClients();
			setClients(clientList);
		} catch (error) {
			console.error("Failed to load clients");
		}
	};

	const applyFilters = () => {
		let filtered = [...invoices];

		// Search filter
		if (searchTerm) {
			const searchLower = searchTerm.toLowerCase();
			filtered = filtered.filter(
				(invoice) =>
					invoice.clientName.toLowerCase().includes(searchLower) ||
					invoice.invoiceNumber.toLowerCase().includes(searchLower) ||
					invoice.clientEmail.toLowerCase().includes(searchLower)
			);
		}

		// Client filter
		if (clientFilter !== "all") {
			filtered = filtered.filter((invoice) => invoice.clientName === clientFilter);
		}

		// Status filter
		if (statusFilter !== "all") {
			filtered = filtered.filter((invoice) => invoice.status === statusFilter);
		}

		setFilteredInvoices(filtered);
	};

	const handleDelete = async () => {
		if (!invoiceToDelete) return;

		setIsDeleting(true);
		try {
			await invoiceService.deleteInvoice(invoiceToDelete);
			toast.success("Invoice deleted successfully");
			loadInvoices();
			setDeleteDialogOpen(false);
			setInvoiceToDelete(null);
		} catch (error) {
			toast.error("Failed to delete invoice");
		} finally {
			setIsDeleting(false);
		}
	};

	const handleGeneratePDF = async (invoice: Invoice) => {
		setGeneratingPDF(invoice.id);
		try {
			// Generate PDF using react-pdf
			const blob = await pdf(<InvoicePDF invoice={invoice} />).toBlob();
			
			// Create download link
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = `Invoice-${invoice.invoiceNumber}.pdf`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);

			toast.success("PDF generated successfully!");

			// Play success sound
			const audio = new Audio(
				"data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjWO1fPTgjMGHm7A7+OZSA0PVqzn77BdGAg+lt7vwmIYBi6H0fPZijoFIHO/7+GSSQwOUKrm8bRgFwk7ktzyymk6BylvvO3mnEsLElqs6O+zXxYIMY/X8tJ6LQUnaLnu4pVLCxFYqOTxu2gaBjSL1PLZhzYHHWq77OahUQ0PWKvl771hGAU3j9XxzXsxBSBruOzknUoLElGm4/G4aB8HOovV8daFLwUjab3q4pdPDRNWquXvulmBCxRkre7kq14VCTeLxez0kz4IJnK84/KOQw8VZ7Tv45dXKQ8ue9Tt46tXDhFksPHsrGQcCTeX0/TRhTgIJGq34tqSRQsRW6vm8LRgFws7k9buxXIoBSlux+rdkUgLE1+z5/CsYx0KOZDa78NuIggybsLr3JhODRNfsuXwqWkaBzmO1fPRejUGKWy57eKZTQwQWKjl7bVlHgo1j9XxzHgzByVquu7hlUsOFVer5fCAQw0XXLbp5qVSCw5Wo+Pws2QXCDmP1/DPeTEFKGi37OKaUQsQV6rm8bRhFQo1j9XyzXoxBx9suO7dmU4PElWn5O+5YRwHNo/V8c5+MwckaLvt4JhSCxBWqOTws2UdCTaN1PHRgC0GJGm87eKaUQwSWqnl77hjHAc3j9XxzXoyBR1suOzglU4PElSn5O+3ZBsIOZDX8dJ8LwUjaLvs4ptRDBJXqOXvuGUcCDaP1vHNfDIGI2m77N6ZUQ0RV6fm77dkGwc5j9bx0X8vBSJpvOzimlAME1em5O+3ZBwHN5DW8c1+MQYjabjt3plQDBJXp+TvtmUbCDeP1fHNei4FImm87N+YTg0SV6fl77dlGwg4j9XxzH4xBSJpvO3emE4NEFan5O+2Zhv+zYBFAgAAAQAAAAAAAAABAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="
			);
			audio.play().catch(() => {
				// Fallback if audio fails
				console.log("Could not play notification sound");
			});
		} catch (error) {
			toast.error("Failed to generate PDF");
			console.error(error);
		} finally {
			setGeneratingPDF(null);
		}
	};

	const getStatusColor = (status: InvoiceStatus) => {
		switch (status) {
			case "draft":
				return "bg-gray-500";
			case "sent":
				return "bg-blue-500";
			case "paid":
				return "bg-green-500";
			case "overdue":
				return "bg-red-500";
			case "cancelled":
				return "bg-orange-500";
			default:
				return "bg-gray-500";
		}
	};

	const getCurrencySymbol = (currency: string) => {
		switch (currency) {
			case "USD":
				return "$";
			case "INR":
				return "₹";
			case "EUR":
				return "€";
			case "GBP":
				return "£";
			default:
				return "$";
		}
	};

	const totalRevenue = filteredInvoices
		.filter((inv) => inv.status === "paid")
		.reduce((sum, inv) => sum + inv.total, 0);

	const pendingAmount = filteredInvoices
		.filter((inv) => inv.status === "sent" || inv.status === "overdue")
		.reduce((sum, inv) => sum + inv.total, 0);

	const draftCount = filteredInvoices.filter((inv) => inv.status === "draft").length;

	return (
		<div className="container mx-auto py-6 space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">Invoices</h1>
					<p className="text-muted-foreground">Manage your invoices and track payments</p>
				</div>
				<Button asChild>
					<Link to="/cms/invoices/form">
						<Plus className="h-4 w-4 mr-2" />
						Create Invoice
					</Link>
				</Button>
			</div>

			{/* Stats Cards */}
			<div className="grid gap-4 md:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
						<FileText className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{filteredInvoices.length}</div>
						<p className="text-xs text-muted-foreground">{draftCount} drafts</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Paid Revenue</CardTitle>
						<FileText className="h-4 w-4 text-green-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-green-600">${totalRevenue.toFixed(2)}</div>
						<p className="text-xs text-muted-foreground">From paid invoices</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
						<FileText className="h-4 w-4 text-orange-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-orange-600">${pendingAmount.toFixed(2)}</div>
						<p className="text-xs text-muted-foreground">Awaiting payment</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Clients</CardTitle>
						<FileText className="h-4 w-4 text-blue-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-blue-600">{clients.length}</div>
						<p className="text-xs text-muted-foreground">Unique clients</p>
					</CardContent>
				</Card>
			</div>

			{/* Filters */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Filter className="h-5 w-5" />
						Filters
					</CardTitle>
					<CardDescription>Filter and search invoices by client, status, or search term</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 md:grid-cols-3">
						<div className="relative">
							<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search by client, invoice #, email..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-8"
							/>
						</div>

						<Select value={clientFilter} onValueChange={setClientFilter}>
							<SelectTrigger>
								<SelectValue placeholder="Filter by client" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Clients</SelectItem>
								{clients.map((client) => (
									<SelectItem key={client} value={client}>
										{client}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
							<SelectTrigger>
								<SelectValue placeholder="Filter by status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Status</SelectItem>
								<SelectItem value="draft">Draft</SelectItem>
								<SelectItem value="sent">Sent</SelectItem>
								<SelectItem value="paid">Paid</SelectItem>
								<SelectItem value="overdue">Overdue</SelectItem>
								<SelectItem value="cancelled">Cancelled</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			{/* Invoice List */}
			<Card>
				<CardHeader>
					<CardTitle>Invoice List</CardTitle>
					<CardDescription>
						{filteredInvoices.length} invoice{filteredInvoices.length !== 1 ? "s" : ""} found
					</CardDescription>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className="flex items-center justify-center py-8">
							<Loader2 className="h-8 w-8 animate-spin" />
						</div>
					) : filteredInvoices.length === 0 ? (
						<div className="text-center py-12">
							<FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
							<h3 className="text-lg font-semibold mb-2">No invoices found</h3>
							<p className="text-muted-foreground mb-4">
								{invoices.length === 0
									? "Create your first invoice to get started."
									: "Try adjusting your filters to see more results."}
							</p>
							{invoices.length === 0 && (
								<Button asChild>
									<Link to="/cms/invoices/form">
										<Plus className="h-4 w-4 mr-2" />
										Create Your First Invoice
									</Link>
								</Button>
							)}
						</div>
					) : (
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Invoice #</TableHead>
										<TableHead>Client</TableHead>
										<TableHead>Date</TableHead>
										<TableHead>Due Date</TableHead>
										<TableHead>Amount</TableHead>
										<TableHead>Status</TableHead>
										<TableHead className="text-right">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredInvoices.map((invoice) => (
										<TableRow key={invoice.id}>
											<TableCell className="font-medium">
												{invoice.invoiceNumber}
											</TableCell>
											<TableCell>
												<div>
													<div className="font-medium">{invoice.clientName}</div>
													<div className="text-sm text-muted-foreground">
														{invoice.clientEmail}
													</div>
												</div>
											</TableCell>
											<TableCell>
												{format(invoice.invoiceDate, "MMM dd, yyyy")}
											</TableCell>
											<TableCell>
												{format(invoice.dueDate, "MMM dd, yyyy")}
											</TableCell>
											<TableCell>
												<span className="font-semibold">
													{getCurrencySymbol(invoice.currency)}
													{invoice.total.toFixed(2)}
												</span>
											</TableCell>
											<TableCell>
												<Badge className={getStatusColor(invoice.status)}>
													{invoice.status}
												</Badge>
											</TableCell>
											<TableCell className="text-right">
												<div className="flex items-center justify-end gap-2">
													<Button
														variant="ghost"
														size="sm"
														onClick={() => handleGeneratePDF(invoice)}
														disabled={generatingPDF === invoice.id}
														title="Download PDF"
													>
														{generatingPDF === invoice.id ? (
															<Loader2 className="h-4 w-4 animate-spin" />
														) : (
															<Download className="h-4 w-4" />
														)}
													</Button>
													<Button
														variant="ghost"
														size="sm"
														asChild
														title="Edit invoice"
													>
														<Link to={`/cms/invoices/form/${invoice.id}`}>
															<Edit className="h-4 w-4" />
														</Link>
													</Button>
													<Button
														variant="ghost"
														size="sm"
														onClick={() => {
															setInvoiceToDelete(invoice.id);
															setDeleteDialogOpen(true);
														}}
														title="Delete invoice"
													>
														<Trash2 className="h-4 w-4 text-destructive" />
													</Button>
												</div>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Delete Confirmation Dialog */}
			<Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete Invoice</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete this invoice? This action cannot be undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setDeleteDialogOpen(false)}
							disabled={isDeleting}
						>
							Cancel
						</Button>
						<Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
							{isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							Delete
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default InvoiceList;
