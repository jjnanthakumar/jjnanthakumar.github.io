export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled";

export interface InvoiceLineItem {
	id: string;
	category: string;
	description?: string;
	hours: number;
	rate: number;
	amount: number;
}

export interface Invoice {
	id: string;
	invoiceNumber: string;
	
	// Client Information
	clientName: string;
	clientEmail: string;
	clientAddress: string;
	clientCity: string;
	clientState: string;
	clientZip: string;
	clientCountry: string;
	
	// Freelancer Information (Your Info)
	freelancerName: string;
	freelancerBusinessName?: string;
	freelancerEmail: string;
	freelancerPhone?: string;
	freelancerAddress?: string;
	freelancerCity?: string;
	freelancerState?: string;
	freelancerZip?: string;
	freelancerCountry?: string;
	
	// Bank Details
	accountNumber?: string;
	ifscCode?: string;
	bankName?: string;
	
	// Invoice Details
	invoiceDate: Date;
	dueDate: Date;
	status: InvoiceStatus;
	
	// Line Items
	lineItems: InvoiceLineItem[];
	
	// Calculations
	subtotal: number;
	discount: number;
	discountPercentage?: number;
	tax?: number;
	taxPercentage?: number;
	total: number;
	
	// Additional Info
	notes?: string;
	terms?: string;
	currency: string;
	
	// Metadata
	createdAt: Date;
	updatedAt: Date;
	createdBy: string;
}

export interface InvoiceFormData {
	invoiceNumber: string;
	
	// Client Information
	clientName: string;
	clientEmail: string;
	clientAddress: string;
	clientCity: string;
	clientState: string;
	clientZip: string;
	clientCountry: string;
	
	// Freelancer Information
	freelancerName: string;
	freelancerBusinessName?: string;
	freelancerEmail: string;
	freelancerPhone?: string;
	freelancerAddress?: string;
	freelancerCity?: string;
	freelancerState?: string;
	freelancerZip?: string;
	freelancerCountry?: string;
	
	// Bank Details
	accountNumber?: string;
	ifscCode?: string;
	bankName?: string;
	
	// Invoice Details
	invoiceDate: Date;
	dueDate: Date;
	status: InvoiceStatus;
	
	// Line Items
	lineItems: InvoiceLineItem[];
	
	// Calculations
	discount: number;
	discountPercentage?: number;
	tax?: number;
	taxPercentage?: number;
	
	// Additional Info
	notes?: string;
	terms?: string;
	currency: string;
}

export interface InvoiceFilters {
	clientName?: string;
	status?: InvoiceStatus;
	startDate?: Date;
	endDate?: Date;
	searchTerm?: string;
}
