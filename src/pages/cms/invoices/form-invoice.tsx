import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";
import { invoiceService } from "@/services/invoice/invoice-service";
import { InvoiceFormData } from "@/types/invoice";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

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

const lineItemSchema = z.object({
	id: z.string(),
	category: z.string().min(1, "Category is required"),
	description: z.string().optional(),
	hours: z.coerce.number().min(0, "Hours must be positive"),
	rate: z.coerce.number().min(0, "Rate must be positive"),
	amount: z.number(),
});

const formSchema = z.object({
	invoiceNumber: z.string().min(1, "Invoice number is required"),
	clientName: z.string().min(1, "Client name is required"),
	clientEmail: z.string().email("Invalid email"),
	clientAddress: z.string(),
	clientCity: z.string(),
	clientState: z.string(),
	clientZip: z.string(),
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
	status: z.enum(["draft", "sent", "paid", "overdue", "cancelled"] as const),
	lineItems: z.array(lineItemSchema).min(1, "At least one line item is required"),
	discount: z.coerce.number().min(0, "Discount must be positive"),
	discountPercentage: z.coerce.number().min(0).max(100).optional(),
	tax: z.coerce.number().min(0).optional(),
	taxPercentage: z.coerce.number().min(0).max(100).optional(),
	notes: z.string().optional(),
	terms: z.string().optional(),
	currency: z.string().default("USD"),
});

type FormValues = z.infer<typeof formSchema>;

const InvoiceForm = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { user } = useAuth();
	const [isLoading, setIsLoading] = useState(false);
	const [isLoadingData, setIsLoadingData] = useState(!!id);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			invoiceNumber: "",
			clientName: "",
			clientEmail: "",
			clientAddress: "",
			clientCity: "",
			clientState: "",
			clientZip: "",
			clientCountry: "United States",
			freelancerName: "Nanthakumar J J",
			freelancerBusinessName: "Nanthakumar Freelance",
			freelancerEmail: "jjnanthakumr477@gmail.com",
			freelancerPhone: "+918695255075",
			freelancerAddress: "",
			freelancerCity: "",
			freelancerState: "",
			freelancerZip: "",
			freelancerCountry: "India",
			accountNumber: "",
			ifscCode: "",
			bankName: "",
			invoiceDate: new Date(),
			dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
			status: "draft",
			lineItems: [
				{
					id: crypto.randomUUID(),
					category: "",
					description: "",
					hours: 0,
					rate: 0,
					amount: 0,
				},
			],
			discount: 0,
			discountPercentage: 0,
			tax: 0,
			taxPercentage: 0,
			notes: "It was great doing business with you. Please make the payment by the due date.",
			terms: "Payment is due within 10 days. Late payments may incur additional fees. Please include the invoice number with your payment.",
			currency: "USD",
		},
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "lineItems",
	});

	useEffect(() => {
		const loadInvoice = async () => {
			if (!id) {
				try {
					const invoiceNumber = await invoiceService.generateInvoiceNumber();
					form.setValue("invoiceNumber", invoiceNumber);
				} catch (error) {
					toast.error("Failed to generate invoice number");
				}
				return;
			}

			setIsLoadingData(true);
			try {
				const invoice = await invoiceService.getInvoiceById(id);
				if (invoice) {
					form.reset({
						invoiceNumber: invoice.invoiceNumber,
						clientName: invoice.clientName,
						clientEmail: invoice.clientEmail,
						clientAddress: invoice.clientAddress,
						clientCity: invoice.clientCity,
						clientState: invoice.clientState,
						clientZip: invoice.clientZip,
						clientCountry: invoice.clientCountry,
						freelancerName: invoice.freelancerName,
						freelancerBusinessName: invoice.freelancerBusinessName,
						freelancerEmail: invoice.freelancerEmail,
						freelancerPhone: invoice.freelancerPhone,
						freelancerAddress: invoice.freelancerAddress,
						freelancerCity: invoice.freelancerCity,
						freelancerState: invoice.freelancerState,
						freelancerZip: invoice.freelancerZip,
						freelancerCountry: invoice.freelancerCountry,
						accountNumber: invoice.accountNumber,
						ifscCode: invoice.ifscCode,
						bankName: invoice.bankName,
						invoiceDate: invoice.invoiceDate,
						dueDate: invoice.dueDate,
						status: invoice.status,
						lineItems: invoice.lineItems,
						discount: invoice.discount,
						discountPercentage: invoice.discountPercentage,
						tax: invoice.tax,
						taxPercentage: invoice.taxPercentage,
						notes: invoice.notes,
						terms: invoice.terms,
						currency: invoice.currency,
					});
				} else {
					toast.error("Invoice not found");
					navigate("/cms/invoices");
				}
			} catch (error) {
				toast.error("Failed to load invoice");
				navigate("/cms/invoices");
			} finally {
				setIsLoadingData(false);
			}
		};

		loadInvoice();
	}, [id, form, navigate]);

	const calculateLineItemAmount = (index: number) => {
		const hours = form.watch(`lineItems.${index}.hours`);
		const rate = form.watch(`lineItems.${index}.rate`);
		const amount = hours * rate;
		form.setValue(`lineItems.${index}.amount`, amount);
	};

	const calculateTotals = () => {
		const lineItems = form.watch("lineItems");
		const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
		return subtotal;
	};

	const onSubmit = async (data: FormValues) => {
		if (!user) {
			toast.error("You must be logged in to create an invoice");
			return;
		}

		setIsLoading(true);
		try {
			// Type assertion since the form data matches InvoiceFormData structure
			const invoiceData = {
				...data,
				discount: Number(data.discount),
				discountPercentage: data.discountPercentage ? Number(data.discountPercentage) : null,
				tax: data.tax ? Number(data.tax) : null,
				taxPercentage: data.taxPercentage ? Number(data.taxPercentage) : null,
			} as InvoiceFormData;

			if (id) {
				await invoiceService.updateInvoice(id, invoiceData);
				toast.success("Invoice updated successfully!");
			} else {
				await invoiceService.createInvoice(invoiceData, user.uid);
				toast.success("Invoice created successfully!");
			}

			navigate("/cms/invoices");
		} catch (error) {
			toast.error(id ? "Failed to update invoice" : "Failed to create invoice");
		} finally {
			setIsLoading(false);
		}
	};

	const addLineItem = () => {
		append({
			id: crypto.randomUUID(),
			category: "",
			description: "",
			hours: 0,
			rate: 0,
			amount: 0,
		});
	};

	if (isLoadingData) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Loader2 className="h-8 w-8 animate-spin" />
			</div>
		);
	}

	const subtotal = calculateTotals();
	const discount = Number(form.watch("discount")) || 0;
	const tax = Number(form.watch("tax")) || 0;
	const total = subtotal - discount + tax;

	return (
		<div className="container mx-auto py-6 space-y-6 max-w-6xl">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">{id ? "Edit Invoice" : "Create Invoice"}</h1>
					<p className="text-muted-foreground">
						{id ? "Update invoice details" : "Generate a new invoice for your client"}
					</p>
				</div>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					{/* Invoice Details */}
					<Card>
						<CardHeader>
							<CardTitle>Invoice Details</CardTitle>
							<CardDescription>Basic invoice information</CardDescription>
						</CardHeader>
						<CardContent className="grid gap-4 md:grid-cols-2">
							<FormField
								control={form.control}
								name="invoiceNumber"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Invoice Number</FormLabel>
										<FormControl>
											<Input placeholder="INV-001" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="status"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Status</FormLabel>
										<Select onValueChange={field.onChange} value={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select status" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="draft">Draft</SelectItem>
												<SelectItem value="sent">Sent</SelectItem>
												<SelectItem value="paid">Paid</SelectItem>
												<SelectItem value="overdue">Overdue</SelectItem>
												<SelectItem value="cancelled">Cancelled</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="invoiceDate"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>Invoice Date</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant={"outline"}
														className={cn(
															"w-full pl-3 text-left font-normal",
															!field.value && "text-muted-foreground"
														)}
													>
														{field.value ? (
															format(field.value, "PPP")
														) : (
															<span>Pick a date</span>
														)}
														<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0" align="start">
												<Calendar
													mode="single"
													selected={field.value}
													onSelect={field.onChange}
													disabled={(date) =>
														date > new Date() || date < new Date("1900-01-01")
													}
													initialFocus
												/>
											</PopoverContent>
										</Popover>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="dueDate"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>Due Date</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant={"outline"}
														className={cn(
															"w-full pl-3 text-left font-normal",
															!field.value && "text-muted-foreground"
														)}
													>
														{field.value ? (
															format(field.value, "PPP")
														) : (
															<span>Pick a date</span>
														)}
														<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0" align="start">
												<Calendar
													mode="single"
													selected={field.value}
													onSelect={field.onChange}
													disabled={(date) => date < new Date("1900-01-01")}
													initialFocus
												/>
											</PopoverContent>
										</Popover>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="currency"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Currency</FormLabel>
										<Select onValueChange={field.onChange} value={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select currency" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="USD">USD ($)</SelectItem>
												<SelectItem value="INR">INR (₹)</SelectItem>
												<SelectItem value="EUR">EUR (€)</SelectItem>
												<SelectItem value="GBP">GBP (£)</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</CardContent>
					</Card>

					{/* Client Information */}
					<Card>
						<CardHeader>
							<CardTitle>Client Information</CardTitle>
							<CardDescription>Bill to</CardDescription>
						</CardHeader>
						<CardContent className="grid gap-4 md:grid-cols-2">
							<FormField
								control={form.control}
								name="clientName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Client Name</FormLabel>
										<FormControl>
											<Input placeholder="John Doe" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="clientEmail"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input type="email" placeholder="client@example.com" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="clientAddress"
								render={({ field }) => (
									<FormItem className="md:col-span-2">
										<FormLabel>Address</FormLabel>
										<FormControl>
											<Input placeholder="123 Main St" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="clientCity"
								render={({ field }) => (
									<FormItem>
										<FormLabel>City</FormLabel>
										<FormControl>
											<Input placeholder="New York" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="clientState"
								render={({ field }) => (
									<FormItem>
										<FormLabel>State/Province</FormLabel>
										<FormControl>
											<Input placeholder="NY" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="clientZip"
								render={({ field }) => (
									<FormItem>
										<FormLabel>ZIP/Postal Code</FormLabel>
										<FormControl>
											<Input placeholder="10001" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="clientCountry"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Country</FormLabel>
										<FormControl>
											<Input placeholder="United States" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</CardContent>
					</Card>

					{/* Freelancer Information */}
					<Card>
						<CardHeader>
							<CardTitle>Your Information</CardTitle>
							<CardDescription>From (Your details)</CardDescription>
						</CardHeader>
						<CardContent className="grid gap-4 md:grid-cols-2">
							<FormField
								control={form.control}
								name="freelancerName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Your Name</FormLabel>
										<FormControl>
											<Input placeholder="Your Name" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="freelancerBusinessName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Business Name (Optional)</FormLabel>
										<FormControl>
											<Input placeholder="Your Business" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="freelancerEmail"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input type="email" placeholder="your@email.com" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="freelancerPhone"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Phone (Optional)</FormLabel>
										<FormControl>
											<Input placeholder="+1 234 567 8900" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="freelancerAddress"
								render={({ field }) => (
									<FormItem className="md:col-span-2">
										<FormLabel>Address (Optional)</FormLabel>
										<FormControl>
											<Input placeholder="Your address" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="freelancerCity"
								render={({ field }) => (
									<FormItem>
										<FormLabel>City (Optional)</FormLabel>
										<FormControl>
											<Input placeholder="Your city" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="freelancerState"
								render={({ field }) => (
									<FormItem>
										<FormLabel>State (Optional)</FormLabel>
										<FormControl>
											<Input placeholder="Your state" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="freelancerZip"
								render={({ field }) => (
									<FormItem>
										<FormLabel>ZIP (Optional)</FormLabel>
										<FormControl>
											<Input placeholder="12345" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="freelancerCountry"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Country (Optional)</FormLabel>
										<FormControl>
											<Input placeholder="Your country" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</CardContent>
					</Card>

					{/* Bank Details */}
					<Card>
						<CardHeader>
							<CardTitle>Bank Details</CardTitle>
							<CardDescription>Payment information (Optional)</CardDescription>
						</CardHeader>
						<CardContent className="grid gap-4 md:grid-cols-3">
							<FormField
								control={form.control}
								name="accountNumber"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Account Number</FormLabel>
										<FormControl>
											<Input placeholder="922010013998846" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="ifscCode"
								render={({ field }) => (
									<FormItem>
										<FormLabel>IFSC/SWIFT Code</FormLabel>
										<FormControl>
											<Input placeholder="UTIB0000423" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="bankName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Bank Name</FormLabel>
										<FormControl>
											<Input placeholder="Your Bank" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</CardContent>
					</Card>

					{/* Line Items */}
					<Card>
						<CardHeader>
							<CardTitle>Line Items</CardTitle>
							<CardDescription>Services and products</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							{fields.map((field, index) => (
								<div key={field.id} className="space-y-4 p-4 border rounded-lg">
									<div className="flex items-center justify-between">
										<h4 className="font-medium">Item {index + 1}</h4>
										{fields.length > 1 && (
											<Button
												type="button"
												variant="ghost"
												size="sm"
												onClick={() => remove(index)}
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										)}
									</div>

									<div className="grid gap-4 md:grid-cols-5">
										<FormField
											control={form.control}
											name={`lineItems.${index}.category`}
											render={({ field }) => (
												<FormItem>
													<FormLabel>Category/Service</FormLabel>
													<FormControl>
														<Input placeholder="Web Development" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name={`lineItems.${index}.description`}
											render={({ field }) => (
												<FormItem>
													<FormLabel>Description (Optional)</FormLabel>
													<FormControl>
														<Input placeholder="Description" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name={`lineItems.${index}.hours`}
											render={({ field }) => (
												<FormItem>
													<FormLabel>Hours</FormLabel>
													<FormControl>
														<Input
															type="number"
															step="0.01"
															placeholder="0"
															{...field}
															onChange={(e) => {
																field.onChange(e);
																calculateLineItemAmount(index);
															}}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name={`lineItems.${index}.rate`}
											render={({ field }) => (
												<FormItem>
													<FormLabel>Rate</FormLabel>
													<FormControl>
														<Input
															type="number"
															step="0.01"
															placeholder="0.00"
															{...field}
															onChange={(e) => {
																field.onChange(e);
																calculateLineItemAmount(index);
															}}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name={`lineItems.${index}.amount`}
											render={({ field }) => (
												<FormItem>
													<FormLabel>Amount</FormLabel>
													<FormControl>
														<Input
															type="number"
															step="0.01"
															placeholder="0.00"
															{...field}
															disabled
															className="bg-muted"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</div>
							))}

							<Button type="button" variant="outline" onClick={addLineItem} className="w-full">
								<Plus className="h-4 w-4 mr-2" />
								Add Line Item
							</Button>

							{/* Totals */}
							<div className="space-y-3 pt-4 border-t">
								<div className="flex justify-between text-sm">
									<span className="font-medium">Subtotal:</span>
									<span className="font-semibold">{getCurrencySymbol(form.watch("currency"))}{subtotal.toFixed(2)}</span>
								</div>

								<div className="grid gap-4 md:grid-cols-2">
									<FormField
										control={form.control}
										name="discount"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Discount ({getCurrencySymbol(form.watch("currency"))})</FormLabel>
												<FormControl>
													<Input type="number" step="0.01" placeholder="0.00" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="tax"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Tax ({getCurrencySymbol(form.watch("currency"))})</FormLabel>
												<FormControl>
													<Input type="number" step="0.01" placeholder="0.00" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div className="flex justify-between text-lg font-bold pt-2 border-t">
									<span>Total:</span>
									<span className="text-primary">{getCurrencySymbol(form.watch("currency"))}{total.toFixed(2)}</span>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Additional Information */}
					<Card>
						<CardHeader>
							<CardTitle>Additional Information</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<FormField
								control={form.control}
								name="notes"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Notes</FormLabel>
										<FormControl>
											<Textarea
												placeholder="Thank you for your business..."
												className="resize-none"
												rows={3}
												{...field}
											/>
										</FormControl>
										<FormDescription>Optional notes to the client</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="terms"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Terms & Conditions</FormLabel>
										<FormControl>
											<Textarea
												placeholder="Payment terms..."
												className="resize-none"
												rows={3}
												{...field}
											/>
										</FormControl>
										<FormDescription>Payment terms and conditions</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
						</CardContent>
					</Card>

					<div className="flex justify-end gap-4">
						<Button
							type="button"
							variant="outline"
							onClick={() => navigate("/cms/invoices")}
							disabled={isLoading}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={isLoading}>
							{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							{id ? "Update Invoice" : "Create Invoice"}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
};

export default InvoiceForm;
