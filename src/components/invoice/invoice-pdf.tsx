import { Invoice } from "@/types/invoice";
import {
	Document,
	Font,
	Page,
	StyleSheet,
	Text,
	View,
} from "@react-pdf/renderer";
import { format } from "date-fns";

// Register fonts if needed (optional, uses default if not registered)
// Font.register({
//   family: 'Roboto',
//   src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf',
// });

const styles = StyleSheet.create({
	page: {
		padding: 40,
		fontSize: 10,
		fontFamily: "Helvetica",
		backgroundColor: "#ffffff",
	},
	header: {
		marginBottom: 30,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
	},
	headerLeft: {
		flex: 1,
	},
	headerRight: {
		alignItems: "flex-end",
	},
	invoiceTitle: {
		fontSize: 32,
		fontWeight: "bold",
		color: "#2d3748",
		marginBottom: 5,
	},
	invoiceNumber: {
		fontSize: 14,
		color: "#718096",
		marginBottom: 15,
	},
	logo: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#2563eb",
		marginBottom: 5,
	},
	companyName: {
		fontSize: 14,
		fontWeight: "bold",
		color: "#1a202c",
		marginBottom: 3,
	},
	text: {
		fontSize: 10,
		color: "#4a5568",
		marginBottom: 2,
	},
	smallText: {
		fontSize: 9,
		color: "#718096",
		marginBottom: 2,
	},
	section: {
		marginBottom: 25,
	},
	sectionTitle: {
		fontSize: 11,
		fontWeight: "bold",
		color: "#1a202c",
		marginBottom: 8,
		textTransform: "uppercase",
		letterSpacing: 0.5,
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 20,
	},
	column: {
		flex: 1,
	},
	table: {
		marginBottom: 20,
	},
	tableHeader: {
		flexDirection: "row",
		backgroundColor: "#f7fafc",
		borderBottomWidth: 2,
		borderBottomColor: "#2563eb",
		paddingVertical: 8,
		paddingHorizontal: 10,
	},
	tableRow: {
		flexDirection: "row",
		borderBottomWidth: 1,
		borderBottomColor: "#e2e8f0",
		paddingVertical: 10,
		paddingHorizontal: 10,
	},
	tableRowAlt: {
		flexDirection: "row",
		backgroundColor: "#f9fafb",
		borderBottomWidth: 1,
		borderBottomColor: "#e2e8f0",
		paddingVertical: 10,
		paddingHorizontal: 10,
	},
	tableCol: {
		flex: 1,
	},
	tableColNarrow: {
		width: 60,
		textAlign: "right",
	},
	tableColWide: {
		flex: 2,
	},
	tableHeaderText: {
		fontSize: 10,
		fontWeight: "bold",
		color: "#1a202c",
	},
	tableCellText: {
		fontSize: 9,
		color: "#4a5568",
	},
	totalsSection: {
		marginTop: 20,
		marginLeft: "auto",
		width: 250,
	},
	totalRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 5,
		borderBottomWidth: 1,
		borderBottomColor: "#e2e8f0",
	},
	totalRowFinal: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 8,
		marginTop: 5,
		backgroundColor: "#f7fafc",
		borderWidth: 2,
		borderColor: "#2563eb",
		paddingHorizontal: 10,
	},
	totalLabel: {
		fontSize: 10,
		color: "#4a5568",
	},
	totalLabelFinal: {
		fontSize: 12,
		fontWeight: "bold",
		color: "#1a202c",
	},
	totalValue: {
		fontSize: 10,
		color: "#1a202c",
		fontWeight: "bold",
	},
	totalValueFinal: {
		fontSize: 14,
		fontWeight: "bold",
		color: "#2563eb",
	},
	notesSection: {
		marginTop: 30,
		padding: 15,
		backgroundColor: "#f7fafc",
		borderLeftWidth: 4,
		borderLeftColor: "#2563eb",
	},
	notesTitle: {
		fontSize: 11,
		fontWeight: "bold",
		color: "#1a202c",
		marginBottom: 5,
	},
	notesText: {
		fontSize: 9,
		color: "#4a5568",
		lineHeight: 1.5,
	},
	footer: {
		marginTop: 30,
		paddingTop: 15,
		borderTopWidth: 1,
		borderTopColor: "#e2e8f0",
		textAlign: "center",
	},
	statusBadge: {
		paddingHorizontal: 12,
		paddingVertical: 4,
		borderRadius: 4,
		alignSelf: "flex-start",
		marginBottom: 10,
	},
	statusText: {
		fontSize: 10,
		fontWeight: "bold",
		textTransform: "uppercase",
	},
});

const getStatusColor = (status: string) => {
	switch (status) {
		case "paid":
			return { backgroundColor: "#d1fae5", color: "#065f46" };
		case "sent":
			return { backgroundColor: "#dbeafe", color: "#1e40af" };
		case "overdue":
			return { backgroundColor: "#fee2e2", color: "#991b1b" };
		case "cancelled":
			return { backgroundColor: "#fed7aa", color: "#9a3412" };
		default:
			return { backgroundColor: "#f3f4f6", color: "#374151" };
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

interface InvoicePDFProps {
	invoice: Invoice;
}

export const InvoicePDF = ({ invoice }: InvoicePDFProps) => {
	const currencySymbol = getCurrencySymbol(invoice.currency);
	const statusStyle = getStatusColor(invoice.status);

	return (
		<Document>
			<Page size="A4" style={styles.page}>
				{/* Header */}
				<View style={styles.header}>
					<View style={styles.headerLeft}>
						<Text style={styles.logo}>
							{invoice.freelancerBusinessName || invoice.freelancerName}
						</Text>
						<Text style={styles.text}>{invoice.freelancerEmail}</Text>
						{invoice.freelancerPhone && (
							<Text style={styles.text}>{invoice.freelancerPhone}</Text>
						)}
						{invoice.freelancerAddress && (
							<Text style={styles.smallText}>{invoice.freelancerAddress}</Text>
						)}
						{(invoice.freelancerCity || invoice.freelancerState || invoice.freelancerZip) && (
							<Text style={styles.smallText}>
								{[invoice.freelancerCity, invoice.freelancerState, invoice.freelancerZip]
									.filter(Boolean)
									.join(", ")}
							</Text>
						)}
						{invoice.freelancerCountry && (
							<Text style={styles.smallText}>{invoice.freelancerCountry}</Text>
						)}
					</View>
					<View style={styles.headerRight}>
						<Text style={styles.invoiceTitle}>Invoice</Text>
						<Text style={styles.invoiceNumber}>#{invoice.invoiceNumber}</Text>
						<View style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor }]}>
							<Text style={[styles.statusText, { color: statusStyle.color }]}>
								{invoice.status}
							</Text>
						</View>
					</View>
				</View>

				{/* Invoice Details & Client Info */}
				<View style={styles.row}>
					<View style={styles.column}>
						<Text style={styles.sectionTitle}>Bill To</Text>
						<Text style={styles.companyName}>{invoice.clientName}</Text>
						<Text style={styles.text}>{invoice.clientEmail}</Text>
						<Text style={styles.smallText}>{invoice.clientAddress}</Text>
						<Text style={styles.smallText}>
							{invoice.clientCity}, {invoice.clientState} {invoice.clientZip}
						</Text>
						<Text style={styles.smallText}>{invoice.clientCountry}</Text>
					</View>
					<View style={styles.column}>
						<View style={{ marginBottom: 10 }}>
							<Text style={styles.text}>
								<Text style={{ fontWeight: "bold" }}>Invoice Date: </Text>
								{format(invoice.invoiceDate, "MMM dd, yyyy")}
							</Text>
							<Text style={styles.text}>
								<Text style={{ fontWeight: "bold" }}>Due Date: </Text>
								{format(invoice.dueDate, "MMM dd, yyyy")}
							</Text>
						</View>
						{(invoice.accountNumber || invoice.ifscCode || invoice.bankName) && (
							<View>
								<Text style={styles.sectionTitle}>Payment Details</Text>
								{invoice.accountNumber && (
									<Text style={styles.smallText}>
										Account: {invoice.accountNumber}
									</Text>
								)}
								{invoice.ifscCode && (
									<Text style={styles.smallText}>
										IFSC/SWIFT: {invoice.ifscCode}
									</Text>
								)}
								{invoice.bankName && (
									<Text style={styles.smallText}>
										Bank: {invoice.bankName}
									</Text>
								)}
							</View>
						)}
					</View>
				</View>

				{/* Line Items Table */}
				<View style={styles.table}>
					<View style={styles.tableHeader}>
						<View style={styles.tableColWide}>
							<Text style={styles.tableHeaderText}>Category/Service</Text>
						</View>
						<View style={styles.tableCol}>
							<Text style={styles.tableHeaderText}>Description</Text>
						</View>
						<View style={styles.tableColNarrow}>
							<Text style={[styles.tableHeaderText, { textAlign: "right" }]}>Hours</Text>
						</View>
						<View style={styles.tableColNarrow}>
							<Text style={[styles.tableHeaderText, { textAlign: "right" }]}>Rate</Text>
						</View>
						<View style={styles.tableColNarrow}>
							<Text style={[styles.tableHeaderText, { textAlign: "right" }]}>Amount</Text>
						</View>
					</View>

					{invoice.lineItems.map((item, index) => (
						<View
							key={item.id}
							style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}
						>
							<View style={styles.tableColWide}>
								<Text style={styles.tableCellText}>{item.category}</Text>
							</View>
							<View style={styles.tableCol}>
								<Text style={styles.tableCellText}>{item.description || "-"}</Text>
							</View>
							<View style={styles.tableColNarrow}>
								<Text style={[styles.tableCellText, { textAlign: "right" }]}>
									{item.hours.toFixed(2)}
								</Text>
							</View>
							<View style={styles.tableColNarrow}>
								<Text style={[styles.tableCellText, { textAlign: "right" }]}>
									{currencySymbol}
									{item.rate.toFixed(2)}
								</Text>
							</View>
							<View style={styles.tableColNarrow}>
								<Text style={[styles.tableCellText, { textAlign: "right" }]}>
									{currencySymbol}
									{item.amount.toFixed(2)}
								</Text>
							</View>
						</View>
					))}
				</View>

				{/* Totals */}
				<View style={styles.totalsSection}>
					<View style={styles.totalRow}>
						<Text style={styles.totalLabel}>Subtotal</Text>
						<Text style={styles.totalValue}>
							{currencySymbol}
							{invoice.subtotal.toFixed(2)}
						</Text>
					</View>

					{invoice.discount > 0 && (
						<View style={styles.totalRow}>
							<Text style={styles.totalLabel}>
								Discount
								{invoice.discountPercentage && ` (${invoice.discountPercentage}%)`}
							</Text>
							<Text style={styles.totalValue}>
								-{currencySymbol}
								{invoice.discount.toFixed(2)}
							</Text>
						</View>
					)}

					{invoice.tax && invoice.tax > 0 && (
						<View style={styles.totalRow}>
							<Text style={styles.totalLabel}>
								Tax
								{invoice.taxPercentage && ` (${invoice.taxPercentage}%)`}
							</Text>
							<Text style={styles.totalValue}>
								{currencySymbol}
								{invoice.tax.toFixed(2)}
							</Text>
						</View>
					)}

					<View style={styles.totalRowFinal}>
						<Text style={styles.totalLabelFinal}>Total</Text>
						<Text style={styles.totalValueFinal}>
							{currencySymbol}
							{invoice.total.toFixed(2)} {invoice.currency}
						</Text>
					</View>
				</View>

				{/* Notes */}
				{invoice.notes && (
					<View style={styles.notesSection}>
						<Text style={styles.notesTitle}>Notes</Text>
						<Text style={styles.notesText}>{invoice.notes}</Text>
					</View>
				)}

				{/* Terms */}
				{invoice.terms && (
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Terms & Conditions</Text>
						<Text style={styles.notesText}>{invoice.terms}</Text>
					</View>
				)}

				{/* Footer */}
				<View style={styles.footer}>
					<Text style={styles.smallText}>
						Thank you for your business!
					</Text>
					<Text style={styles.smallText}>
						For any questions, please contact {invoice.freelancerEmail}
					</Text>
				</View>
			</Page>
		</Document>
	);
};
