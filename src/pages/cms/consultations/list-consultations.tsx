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
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLoadingState } from "@/hooks/use-loading-state";
import { queryClient } from "@/lib/query-client";
import { consultationService } from "@/services/consultations";
import { BookingStatus, ConsultationBooking } from "@/services/consultations/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
	ArrowUpDown,
	Calendar as CalendarIcon,
	Check,
	ChevronLeft,
	ChevronRight,
	Eye,
	Filter,
	MoreHorizontal,
	RefreshCw,
	Trash2,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const statusColors: Record<BookingStatus, string> = {
	pending: "bg-yellow-500/10 text-yellow-600 border-yellow-200",
	confirmed: "bg-green-500/10 text-green-600 border-green-200",
	cancelled: "bg-red-500/10 text-red-600 border-red-200",
	completed: "bg-blue-500/10 text-blue-600 border-blue-200",
};

const statuses: Array<{ value: BookingStatus; label: string }> = [
	{ value: "pending", label: "Pending" },
	{ value: "confirmed", label: "Confirmed" },
	{ value: "cancelled", label: "Cancelled" },
	{ value: "completed", label: "Completed" },
];

const ListConsultationsPage = () => {
	const navigate = useNavigate();
	const { withLoading } = useLoadingState();
	const [filterStatus, setFilterStatus] = useState<BookingStatus | "all">("all");
	const [selectedBooking, setSelectedBooking] = useState<ConsultationBooking | null>(null);
	const [showStatusDialog, setShowStatusDialog] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [currentView, setCurrentView] = useState<"list" | "calendar">("list");
	const [isCalendarOpen, setIsCalendarOpen] = useState(false);
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
	const [isDetailOpen, setIsDetailOpen] = useState(false);

	// Query for fetching bookings
	const {
		data: bookings = [],
		isLoading,
		refetch: fetchBookings,
	} = useQuery({
		queryKey: ["consultations", filterStatus],
		queryFn: () =>
			consultationService
				.getBookings(1, null, filterStatus !== "all" ? filterStatus : undefined)
				.then((result) => result.bookings),
	});

	// Query for calendar view bookings
	const { data: dateBookings = {} } = useQuery({
		queryKey: ["consultationsCalendar"],
		queryFn: async () => {
			const today = new Date();
			const formattedDate = format(today, "yyyy-MM-dd");
			const dayBookings = await consultationService.getBookingsByDate(formattedDate);
			return { [formattedDate]: dayBookings };
		},
		enabled: currentView === "calendar",
	});

	// Mutation for updating booking status
	const statusMutation = useMutation({
		mutationFn: ({ bookingId, newStatus }: { bookingId: string; newStatus: BookingStatus }) =>
			withLoading(() => consultationService.updateBookingStatus(bookingId, newStatus), {
				loadingText: "Loading update booking status...",
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["consultations"] });
			toast.success("Booking status updated successfully");
			setShowStatusDialog(false);
		},
		onError: (error) => {
			console.error("Error updating booking status:", error);
			toast.error("Failed to update booking status");
		},
	});

	// Mutation for generating time slots
	const generateSlotsMutation = useMutation({
		mutationFn: () =>
			withLoading(() => consultationService.generateTimeSlotsForNextDays(), {
				loadingText: "Loading generate time slots...",
			}),
		onSuccess: () => {
			toast.success("Time slots generated successfully");
			queryClient.invalidateQueries({ queryKey: ["consultations"] });
		},
		onError: (error) => {
			console.error("Error generating time slots:", error);
			toast.error("Failed to generate time slots");
		},
	});

	// Handler for status change
	const handleStatusChange = (bookingId: string, newStatus: BookingStatus) => {
		statusMutation.mutate({ bookingId, newStatus });
	};

	// Handler for generating time slots
	const handleGenerateTimeSlots = () => {
		generateSlotsMutation.mutate();
	};

	return (
		<CmsLayout>
			<div className="space-y-6">
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
					<div>
						<h1 className="text-2xl font-bold tracking-tight">Consultation Bookings</h1>
						<p className="text-muted-foreground">View and manage your consultation bookings</p>
					</div>

					<div className="flex items-center gap-2 self-end sm:self-auto">
						<Button
							variant="outline"
							size="sm"
							onClick={() => navigate("/cms/consultations/settings")}
						>
							<Filter className="h-4 w-4 mr-2" />
							Availability Settings
						</Button>

						<Button size="sm" onClick={handleGenerateTimeSlots}>
							<RefreshCw className="h-4 w-4 mr-2" />
							Generate Time Slots
						</Button>
					</div>
				</div>

				<Tabs value={currentView} onValueChange={(v) => setCurrentView(v as "list" | "calendar")}>
					<div className="flex items-center justify-between">
						<TabsList>
							<TabsTrigger value="list">List View</TabsTrigger>
							<TabsTrigger value="calendar">Calendar View</TabsTrigger>
						</TabsList>

						<div className="flex items-center gap-2">
							{currentView === "list" && (
								<Select
									value={filterStatus}
									onValueChange={(value) => setFilterStatus(value as BookingStatus | "all")}
								>
									<SelectTrigger className="w-[180px]">
										<SelectValue placeholder="Filter by status" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All Statuses</SelectItem>
										{statuses.map((status) => (
											<SelectItem key={status.value} value={status.value}>
												{status.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}

							{currentView === "calendar" && (
								<Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
									<PopoverTrigger asChild>
										<Button
											variant="outline"
											className="w-[240px] justify-start text-left font-normal"
										>
											<CalendarIcon className="mr-2 h-4 w-4" />
											{selectedDate ? format(selectedDate, "PP") : "Pick a date"}
										</Button>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0" align="end">
										<Calendar
											mode="single"
											selected={selectedDate}
											onSelect={(date) => {
												setSelectedDate(date);
												setIsCalendarOpen(false);
												// In a real app, you'd fetch bookings for this date
											}}
										/>
									</PopoverContent>
								</Popover>
							)}

							<Button size="sm" variant="outline" onClick={() => fetchBookings()}>
								<RefreshCw className="h-4 w-4" />
							</Button>
						</div>
					</div>

					<TabsContent value="list" className="space-y-4">
						<DataTable
							columns={[
								{
									header: "Name",
									cell: (booking) => (
										<div>
											<div className="font-medium">{booking.name}</div>
											<div className="text-sm text-muted-foreground">{booking.email}</div>
										</div>
									),
								},
								{
									header: "Date & Time",
									cell: (booking) => (
										<div>
											<div>{format(new Date(booking.date), "MMM d, yyyy")}</div>
											<div className="text-sm text-muted-foreground">
												{booking.timeSlot.startTime} - {booking.timeSlot.endTime}
											</div>
										</div>
									),
								},
								{
									header: "Topic",
									cell: (booking) => booking.topic,
								},
								{
									header: "Status",
									cell: (booking) => (
										<Badge variant="outline" className={statusColors[booking.status]}>
											{booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
										</Badge>
									),
								},
								{
									header: "Actions",
									cell: (booking) => (
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" size="icon" className="h-8 w-8">
													<MoreHorizontal className="h-4 w-4" />
													<span className="sr-only">Open menu</span>
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem
													onClick={() => {
														setSelectedBooking(booking);
														setShowStatusDialog(true);
													}}
												>
													<ArrowUpDown className="h-4 w-4 mr-2" />
													Update Status
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() => {
														setSelectedBooking(booking);
														setIsDetailOpen(true);
													}}
												>
													<Eye className="h-4 w-4 mr-2" />
													View Details
												</DropdownMenuItem>
												{booking.status === "pending" && (
													<DropdownMenuItem
														onClick={() => handleStatusChange(booking.id, "confirmed")}
													>
														<Check className="h-4 w-4 mr-2" />
														Confirm Booking
													</DropdownMenuItem>
												)}
												<DropdownMenuSeparator />
												<DropdownMenuItem
													className="text-red-600"
													onClick={() => {
														setSelectedBooking(booking);
														setShowDeleteDialog(true);
													}}
												>
													<Trash2 className="h-4 w-4 mr-2" />
													Cancel Booking
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									),
									className: "text-right",
								},
							]}
							data={bookings}
							isLoading={isLoading}
							keyField="id"
							emptyState={{
								icon: <CalendarIcon className="h-8 w-8 mb-2" />,
								title: "No bookings found",
								description:
									filterStatus !== "all"
										? "Try changing the filter"
										: "No consultation bookings yet",
							}}
						/>
					</TabsContent>

					<TabsContent value="calendar" className="space-y-4">
						<Card>
							<CardHeader>
								<div className="flex justify-between items-center">
									<CardTitle>Calendar View</CardTitle>
									<div className="flex items-center gap-2">
										<Button variant="outline" size="sm">
											<ChevronLeft className="h-4 w-4" />
										</Button>
										<span className="text-sm font-medium">
											{format(selectedDate || new Date(), "MMMM yyyy")}
										</span>
										<Button variant="outline" size="sm">
											<ChevronRight className="h-4 w-4" />
										</Button>
									</div>
								</div>
								<CardDescription>
									View your consultation bookings in a calendar format
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="text-center p-12 text-muted-foreground">
									<p>Calendar view is under development.</p>
									<p className="text-sm">Please use the list view for now.</p>
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>

				{/* Status Update Dialog */}
				{selectedBooking && (
					<Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Update Booking Status</DialogTitle>
								<DialogDescription>
									Change the status of the consultation booking for {selectedBooking.name}.
								</DialogDescription>
							</DialogHeader>

							<div className="grid gap-4 py-4">
								<div className="space-y-2">
									<p className="text-sm font-medium">Current Status</p>
									<Badge variant="outline" className={statusColors[selectedBooking.status]}>
										{selectedBooking.status.charAt(0).toUpperCase() +
											selectedBooking.status.slice(1)}
									</Badge>
								</div>

								<div className="space-y-2">
									<p className="text-sm font-medium">Select New Status</p>
									<div className="grid grid-cols-2 gap-2">
										{statuses.map((status) => (
											<Button
												key={status.value}
												variant="outline"
												className={`justify-start ${statusColors[status.value]} border-2 ${
													selectedBooking.status === status.value ? "ring-2 ring-primary/25" : ""
												}`}
												onClick={() => handleStatusChange(selectedBooking.id, status.value)}
											>
												{status.label}
											</Button>
										))}
									</div>
								</div>
							</div>

							<DialogFooter>
								<Button variant="outline" onClick={() => setShowStatusDialog(false)}>
									Cancel
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				)}

				{/* Cancel Booking Confirmation */}
				{selectedBooking && (
					<AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Cancel Booking</AlertDialogTitle>
								<AlertDialogDescription>
									Are you sure you want to cancel this booking? This action cannot be undone.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>No, keep booking</AlertDialogCancel>
								<AlertDialogAction
									className="bg-red-600 hover:bg-red-700"
									onClick={() => {
										handleStatusChange(selectedBooking.id, "cancelled");
										setShowDeleteDialog(false);
									}}
								>
									Yes, cancel booking
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				)}

				{/* Consultation Detail Dialog */}
				<Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
					<DialogContent className="sm:max-w-2xl">
						<DialogHeader>
							<DialogTitle>Consultation Booking Details</DialogTitle>
							<DialogDescription>
								Booking from {selectedBooking?.name} ({selectedBooking?.email})
							</DialogDescription>
						</DialogHeader>

						{selectedBooking && (
							<div className="space-y-4">
								<div className="flex justify-between items-center">
									<div className="text-sm text-muted-foreground">
										<CalendarIcon className="inline-block h-3.5 w-3.5 mr-1.5 -mt-0.5" />
										{format(new Date(selectedBooking.date), "PPP")}
									</div>
									<Badge variant="outline" className={statusColors[selectedBooking.status]}>
										{selectedBooking.status.charAt(0).toUpperCase() +
											selectedBooking.status.slice(1)}
									</Badge>
								</div>

								<div>
									<h3 className="text-lg font-semibold">Consultation Details</h3>
									<Separator className="my-3" />
									<div className="space-y-2">
										<div>
											<span className="text-muted-foreground">Time Slot:</span>{" "}
											{selectedBooking.timeSlot.startTime} - {selectedBooking.timeSlot.endTime}
										</div>
										<div>
											<span className="text-muted-foreground">Topic:</span> {selectedBooking.topic}
										</div>
									</div>
								</div>

								<div className="bg-muted dark:bg-muted/30 p-4 rounded-lg">
									<div className="font-medium mb-1">Additional Information</div>
									<div className="grid grid-cols-1 gap-2 text-sm">
										<div>
											<span className="text-muted-foreground">Name:</span> {selectedBooking.name}
										</div>
										<div>
											<span className="text-muted-foreground">Email:</span>{" "}
											<a
												href={`mailto:${selectedBooking.email}`}
												className="text-primary hover:underline"
											>
												{selectedBooking.email}
											</a>
										</div>
										{selectedBooking.message && (
											<div className="flex flex-col">
												<span className="text-muted-foreground block mb-1">Message:</span>
												<div className="whitespace-pre-wrap text-sm">{selectedBooking.message}</div>
											</div>
										)}
									</div>
								</div>
							</div>
						)}
					</DialogContent>
				</Dialog>
			</div>
		</CmsLayout>
	);
};

export default ListConsultationsPage;
