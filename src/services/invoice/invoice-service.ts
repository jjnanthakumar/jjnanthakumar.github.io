import { BaseService } from "@/services/core/base-service";
import { Invoice, InvoiceFilters, InvoiceFormData, InvoiceLineItem } from "@/types/invoice";
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	orderBy,
	query,
	Timestamp,
	updateDoc,
	where,
} from "firebase/firestore";
import { z } from "zod";

const invoiceLineItemSchema = z.object({
	id: z.string(),
	category: z.string().min(1, "Category is required"),
	description: z.string().optional(),
	hours: z.number().min(0, "Hours must be positive"),
	rate: z.number().min(0, "Rate must be positive"),
	amount: z.number().min(0, "Amount must be positive"),
});

const invoiceFormSchema = z.object({
	invoiceNumber: z.string().min(1, "Invoice number is required"),
	clientName: z.string().min(1, "Client name is required"),
	clientEmail: z.string().email("Invalid email"),
	clientAddress: z.string().optional(),
	clientCity: z.string().optional(),
	clientState: z.string().optional(),
	clientZip: z.string().optional(),
	clientCountry: z.string().min(1, "Country is required"),
	freelancerName: z.string().min(1, "Your name is required"),
	freelancerBusinessName: z.string().optional(),
	freelancerEmail: z.string().email("Invalid email"),
	freelancerPhone: z.string().optional(),
	freelancerAddress: z.string().optional(),
	freelancerCity: z.string().optional(),
	freelancerState: z.string().optional(),
	freelancerZip: z.string().optional(),
	freelancerCountry: z.string().optional(),
	accountNumber: z.string().optional(),
	ifscCode: z.string().optional(),
	bankName: z.string().optional(),
	invoiceDate: z.date(),
	dueDate: z.date(),
	status: z.enum(["draft", "sent", "paid", "overdue", "cancelled"]),
	lineItems: z.array(invoiceLineItemSchema).min(1, "At least one line item is required"),
	discount: z.number().min(0, "Discount must be positive"),
	discountPercentage: z.number().min(0).max(100).optional().nullable(),
	tax: z.number().min(0).optional().nullable(),
	taxPercentage: z.number().min(0).max(100).optional().nullable(),
	notes: z.string().optional(),
	terms: z.string().optional(),
	currency: z.string().default("USD"),
});

export class InvoiceService extends BaseService {
	private readonly collectionName = "invoices";

	private calculateInvoiceAmounts(
		lineItems: InvoiceLineItem[],
		discount: number,
		tax: number = 0
	): { subtotal: number; total: number } {
		const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
		const afterDiscount = subtotal - discount;
		const total = afterDiscount + tax;
		return { subtotal, total };
	}

	private mapInvoiceFromFirestore(id: string, data: any): Invoice {
		return {
			id,
			invoiceNumber: data.invoiceNumber,
			clientName: data.clientName,
			clientEmail: data.clientEmail,
			clientAddress: data.clientAddress,
			clientCity: data.clientCity,
			clientState: data.clientState,
			clientZip: data.clientZip,
			clientCountry: data.clientCountry,
			freelancerName: data.freelancerName,
			freelancerBusinessName: data.freelancerBusinessName,
			freelancerEmail: data.freelancerEmail,
			freelancerPhone: data.freelancerPhone,
			freelancerAddress: data.freelancerAddress,
			freelancerCity: data.freelancerCity,
			freelancerState: data.freelancerState,
			freelancerZip: data.freelancerZip,
			freelancerCountry: data.freelancerCountry,
			accountNumber: data.accountNumber,
			ifscCode: data.ifscCode,
			bankName: data.bankName,
			invoiceDate: this.convertToDate(data, "invoiceDate") || new Date(),
			dueDate: this.convertToDate(data, "dueDate") || new Date(),
			status: data.status,
			lineItems: data.lineItems || [],
			subtotal: data.subtotal || 0,
			discount: data.discount || 0,
			discountPercentage: data.discountPercentage,
			tax: data.tax,
			taxPercentage: data.taxPercentage,
			total: data.total || 0,
			notes: data.notes,
			terms: data.terms,
			currency: data.currency || "USD",
			createdAt: this.convertToDate(data, "createdAt") || new Date(),
			updatedAt: this.convertToDate(data, "updatedAt") || new Date(),
			createdBy: data.createdBy || "",
		};
	}

	async generateInvoiceNumber(): Promise<string> {
		try {
			const now = new Date();
			const year = now.getFullYear();
			const month = String(now.getMonth() + 1).padStart(2, "0");
			const day = String(now.getDate()).padStart(2, "0");
			const hours = String(now.getHours()).padStart(2, "0");
			const minutes = String(now.getMinutes()).padStart(2, "0");
			const seconds = String(now.getSeconds()).padStart(2, "0");

			return `INV-${year}${month}${day}-${hours}${minutes}${seconds}`;
		} catch (error) {
			this.handleError(error, "Failed to generate invoice number");
		}
	}

	async createInvoice(data: InvoiceFormData, userId: string): Promise<string> {
		try {
			// Validate input
			const validatedData = this.validateInput(data, invoiceFormSchema);

			// Calculate amounts
			const { subtotal, total } = this.calculateInvoiceAmounts(
				validatedData.lineItems as InvoiceLineItem[],
				validatedData.discount,
				validatedData.tax || 0
			);

			// Prepare invoice data
			const invoiceData = {
				...validatedData,
				subtotal,
				total,
				invoiceDate: Timestamp.fromDate(validatedData.invoiceDate),
				dueDate: Timestamp.fromDate(validatedData.dueDate),
				createdAt: Timestamp.now(),
				updatedAt: Timestamp.now(),
				createdBy: userId,
			};

			const docRef = await addDoc(collection(this.db, this.collectionName), invoiceData);
			return docRef.id;
		} catch (error) {
			this.handleError(error, "Failed to create invoice");
		}
	}

	async updateInvoice(id: string, data: InvoiceFormData): Promise<void> {
		try {
			// Validate input
			const validatedData = this.validateInput(data, invoiceFormSchema);

			// Calculate amounts
			const { subtotal, total } = this.calculateInvoiceAmounts(
				validatedData.lineItems as InvoiceLineItem[],
				validatedData.discount,
				validatedData.tax || 0
			);

			// Prepare update data
			const updateData = {
				...validatedData,
				subtotal,
				total,
				invoiceDate: Timestamp.fromDate(validatedData.invoiceDate),
				dueDate: Timestamp.fromDate(validatedData.dueDate),
				updatedAt: Timestamp.now(),
			};

			const docRef = doc(this.db, this.collectionName, id);
			await updateDoc(docRef, updateData);
		} catch (error) {
			this.handleError(error, "Failed to update invoice");
		}
	}

	async getInvoiceById(id: string): Promise<Invoice | null> {
		try {
			const docRef = doc(this.db, this.collectionName, id);
			const docSnap = await getDoc(docRef);

			if (!docSnap.exists()) {
				return null;
			}

			return this.mapInvoiceFromFirestore(docSnap.id, docSnap.data());
		} catch (error) {
			this.handleError(error, "Failed to get invoice");
		}
	}

	async getAllInvoices(filters?: InvoiceFilters): Promise<Invoice[]> {
		try {
			const invoicesRef = collection(this.db, this.collectionName);
			let q = query(invoicesRef, orderBy("createdAt", "desc"));

			// Apply filters
			if (filters?.status) {
				q = query(q, where("status", "==", filters.status));
			}

			if (filters?.clientName) {
				q = query(q, where("clientName", "==", filters.clientName));
			}

			if (filters?.startDate) {
				q = query(q, where("invoiceDate", ">=", Timestamp.fromDate(filters.startDate)));
			}

			if (filters?.endDate) {
				q = query(q, where("invoiceDate", "<=", Timestamp.fromDate(filters.endDate)));
			}

			const snapshot = await getDocs(q);

			let invoices = snapshot.docs.map((doc) =>
				this.mapInvoiceFromFirestore(doc.id, doc.data())
			);

			// Apply search term filter (client-side)
			if (filters?.searchTerm) {
				const searchLower = filters.searchTerm.toLowerCase();
				invoices = invoices.filter(
					(invoice) =>
						invoice.clientName.toLowerCase().includes(searchLower) ||
						invoice.invoiceNumber.toLowerCase().includes(searchLower) ||
						invoice.clientEmail.toLowerCase().includes(searchLower)
				);
			}

			return invoices;
		} catch (error) {
			this.handleError(error, "Failed to get invoices");
		}
	}

	async getUniqueClients(): Promise<string[]> {
		try {
			const invoicesRef = collection(this.db, this.collectionName);
			const snapshot = await getDocs(invoicesRef);

			const clients = new Set<string>();
			snapshot.docs.forEach((doc) => {
				const data = doc.data();
				if (data.clientName) {
					clients.add(data.clientName);
				}
			});

			return Array.from(clients).sort();
		} catch (error) {
			this.handleError(error, "Failed to get unique clients");
		}
	}

	async deleteInvoice(id: string): Promise<void> {
		try {
			const docRef = doc(this.db, this.collectionName, id);
			await deleteDoc(docRef);
		} catch (error) {
			this.handleError(error, "Failed to delete invoice");
		}
	}

	async updateInvoiceStatus(id: string, status: Invoice["status"]): Promise<void> {
		try {
			const docRef = doc(this.db, this.collectionName, id);
			await updateDoc(docRef, {
				status,
				updatedAt: Timestamp.now(),
			});
		} catch (error) {
			this.handleError(error, "Failed to update invoice status");
		}
	}
}

export const invoiceService = new InvoiceService();
