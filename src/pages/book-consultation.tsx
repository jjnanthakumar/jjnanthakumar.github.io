import { SEO } from "@/components/common/seo";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
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
import { SectionHeader } from "@/components/ui/section-header";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { consultationService } from "@/services/consultations";
import { TimeSlot } from "@/services/consultations/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { format } from "date-fns";
import {
	Building,
	CalendarClock,
	CalendarIcon,
	CheckCircle,
	Clock,
	Loader2,
	Mail,
	MessageSquare,
	Phone,
	User,
	Video,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

// Constants
const TOPICS = [
	"Website Development",
	"Web Application",
	"UI/UX Design",
	"Frontend Development",
	"Code Review",
	"Technical Consultation",
	"Project Planning",
	"Other",
];

const PLEASE_SELECT_DATE_FIRST = "Please select a date first.";
const CANNOT_BOOK_FOR_TODAY = "Cannot book consultations for today. Please select a future date.";
const BOOKING_CARD_ID = "booking-card";

// Form schema
const bookingSchema = z.object({
	name: z.string().min(2, { message: "Name is required" }),
	email: z.string().email({ message: "Invalid email address" }),
	phone: z.string().optional(),
	company: z.string().optional(),
	topic: z.string().min(1, { message: "Please select a topic" }),
	message: z.string().min(20, { message: "Message must be at least 20 characters" }),
	date: z.date({ required_error: "Please select a date" }),
	timeSlot: z.object(
		{
			startTime: z.string(),
			endTime: z.string(),
		},
		{ required_error: "Please select a time slot" },
	),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

const BookConsultationPage = () => {
	const navigate = useNavigate();
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
	const [isSelectedTodayDate, setIsSelectedTodayDate] = useState<boolean>(false);
	const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
	const [formStep, setFormStep] = useState(1);
	const [bookingComplete, setBookingComplete] = useState(false);
	const [timeSlotsLoading, setTimeSlotsLoading] = useState(false);

	// Initialize form
	const form = useForm<BookingFormValues>({
		resolver: zodResolver(bookingSchema),
		defaultValues: {
			name: "",
			email: "",
			phone: "",
			company: "",
			topic: "",
			message: "",
		},
	});

	// Load available time slots when a date is selected
	useEffect(() => {
		if (!selectedDate) return;

		const fetchTimeSlots = async () => {
			const today = new Date();
			today.setHours(0, 0, 0, 0);

			if (selectedDate && selectedDate.getTime() === today.getTime()) {
				toast.error(CANNOT_BOOK_FOR_TODAY);
				setIsSelectedTodayDate(true);
				return;
			}

			setTimeSlotsLoading(true);
			setIsSelectedTodayDate(false);
			try {
				// Format date as YYYY-MM-DD
				const formattedDate = format(selectedDate, "yyyy-MM-dd");
				const slots = await consultationService.getAvailableSlots(formattedDate);
				setAvailableSlots(slots);

				// Set the date in the form
				form.setValue("date", selectedDate);

				if (slots.length === 0) {
					toast.info("No available time slots for this date. Please select another date.");
				}
			} catch (error) {
				console.error("Error fetching time slots:", error);
				toast.error("Failed to load available time slots. Please try again.");
			} finally {
				setTimeSlotsLoading(false);
			}
		};

		fetchTimeSlots();
	}, [selectedDate, form]);

	// Function to handle time slot selection
	const handleTimeSlotSelect = (slot: TimeSlot) => {
		form.setValue("timeSlot", {
			startTime: slot.startTime,
			endTime: slot.endTime,
		});
		// Move to next step
		setFormStep(2);
	};

	const scrollToBookingCard = () => {
		const element = document.getElementById("booking-card");
		if (element) {
			const offset = 90; // Adjust this value based on your header height
			const elementPosition = element.getBoundingClientRect().top + window.scrollY;
			window.scrollTo({
				top: elementPosition - offset,
				behavior: "smooth",
			});
		}
	};

	const mutation = useMutation({
		mutationFn: (data: BookingFormValues) => {
			return consultationService.createBooking({
				name: data.name,
				email: data.email,
				phone: data.phone,
				company: data.company,
				date: format(data.date, "yyyy-MM-dd"),
				timeSlot: {
					startTime: data.timeSlot.startTime!,
					endTime: data.timeSlot.endTime!,
				},
				topic: data.topic,
				message: data.message,
			});
		},
		onSuccess: () => {
			setBookingComplete(true);
			toast.success("Your consultation has been booked successfully!");
		},
		onError: (error) => {
			console.error("Error booking consultation:", error);
			toast.error("Failed to book your consultation. Please try again.");
		},
	});

	const onSubmit = async (data: BookingFormValues) => {
		mutation.mutate(data);
	};

	// Success screen
	if (bookingComplete) {
		return (
			<>
				<SEO
					title="Booking Complete"
					description="Your consultation has been successfully booked."
				/>
				<div className="container px-4 py-12 md:py-20 max-w-6xl mx-auto">
					<Card className="max-w-lg mx-auto">
						<CardHeader className="text-center">
							<div className="mx-auto mb-4 bg-primary/10 w-16 h-16 flex items-center justify-center rounded-full">
								<CheckCircle className="h-8 w-8 text-primary" />
							</div>
							<CardTitle className="text-2xl">Booking Confirmed!</CardTitle>
							<CardDescription>Thank you for booking a consultation with me.</CardDescription>
						</CardHeader>
						<CardContent className="text-center">
							<p className="mb-6">
								I'll review your booking and send you a confirmation email shortly with the meeting
								details and any preparation instructions.
							</p>
							<p className="text-muted-foreground">
								Please check your email inbox (and spam folder) for updates.
							</p>
						</CardContent>
						<CardFooter className="flex justify-center">
							<Button onClick={() => navigate("/")}>Return to Home</Button>
						</CardFooter>
					</Card>
				</div>
			</>
		);
	}

	return (
		<>
			<SEO
				title="Book a Consultation"
				description="Book a one-on-one consultation to discuss your project requirements and how I can help you achieve your goals."
			/>

			<div className="container px-4 py-12 md:py-20 max-w-6xl mx-auto">
				<SectionHeader
					title="Book a Consultation"
					subtitle="Let's Discuss Your Project"
					description="Schedule a one-on-one consultation with me to discuss your project requirements, get expert advice, or simply explore how we might work together."
					align="center"
					className="mb-12"
				/>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
					{/* Info Panel */}
					<div className="lg:col-span-1">
						<Card>
							<CardHeader>
								<CardTitle>How It Works</CardTitle>
								<CardDescription>Simple process, valuable insights</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-start gap-3">
									<CalendarIcon className="h-5 w-5 text-primary mt-0.5" />
									<div>
										<p className="font-medium">Select a Date</p>
										<p className="text-sm text-muted-foreground">
											Choose from available dates on the calendar
										</p>
									</div>
								</div>

								<div className="flex items-start gap-3">
									<Clock className="h-5 w-5 text-primary mt-0.5" />
									<div>
										<p className="font-medium">Pick a Time Slot</p>
										<p className="text-sm text-muted-foreground">
											Select from available time slots
										</p>
									</div>
								</div>

								<div className="flex items-start gap-3">
									<User className="h-5 w-5 text-primary mt-0.5" />
									<div>
										<p className="font-medium">Share Your Details</p>
										<p className="text-sm text-muted-foreground">
											Fill in your information and consultation topic
										</p>
									</div>
								</div>

								<div className="flex items-start gap-3">
									<Video className="h-5 w-5 text-primary mt-0.5" />
									<div>
										<p className="font-medium">Join the Meeting</p>
										<p className="text-sm text-muted-foreground">
											You'll receive a confirmation email with meeting details
										</p>
									</div>
								</div>
							</CardContent>
							<CardFooter className="bg-primary/5 border-t border-border/50 flex flex-col items-start p-6">
								<h3 className="text-sm font-medium mb-2 flex items-center gap-2">
									<CalendarClock className="h-4 w-4" />
									Consultation Length
								</h3>
								<p className="text-sm text-muted-foreground">30 minutes, with time for questions</p>
							</CardFooter>
						</Card>
					</div>

					{/* Booking Form */}
					<div className="lg:col-span-2">
						<Card id={BOOKING_CARD_ID}>
							<CardHeader className="px-4 md:px-6 pb-2 md:pb-0">
								<CardTitle>{formStep === 1 ? "Select Date & Time" : "Your Information"}</CardTitle>
								<CardDescription>
									{formStep === 1
										? "First, choose a suitable date and time for your consultation"
										: "Now, tell me a bit about yourself and your project"}
								</CardDescription>
							</CardHeader>

							<CardContent className="p-4 md:p-6">
								<Form {...form}>
									<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
										{formStep === 1 ? (
											<>
												{/* Step 1: Date & Time Selection */}
												<div className="flex flex-col md:flex-row space-y-4">
													<div className="mb-0 md:mb-4">
														<FormLabel>Select a Date</FormLabel>
														<Calendar
															mode="single"
															selected={selectedDate}
															onSelect={setSelectedDate}
															disabled={(date) => {
																// Disable past dates, weekends, or other excluded dates
																const now = new Date();
																now.setHours(0, 0, 0, 0);
																return date < now || date.getDay() === 0 || date.getDay() === 6;
															}}
															className="rounded-md border mt-2"
														/>
													</div>

													<div className="w-full px-0 md:px-4 md:!mt-0">
														<FormLabel>Select a Time Slot</FormLabel>
														{selectedDate && !isSelectedTodayDate ? (
															<>
																{timeSlotsLoading ? (
																	<div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
																		{Array.from({ length: 6 }).map((_, i) => (
																			<Skeleton key={i} className="h-[42px] w-full rounded-md" />
																		))}
																	</div>
																) : null}
																{availableSlots.length > 0 ? (
																	<div
																		className={clsx(
																			"grid grid-cols-1 md:grid-cols-2 gap-2 mt-2",
																			timeSlotsLoading && "hidden",
																		)}
																	>
																		{availableSlots.map((slot) => (
																			<Button
																				key={slot.id}
																				type="button"
																				variant="outline"
																				className="flex items-center justify-start h-auto py-3"
																				onClick={() => {
																					handleTimeSlotSelect(slot);
																					scrollToBookingCard();
																				}}
																			>
																				<Clock className="h-3 w-3 mr-2" />
																				{slot.startTime} - {slot.endTime}
																			</Button>
																		))}
																	</div>
																) : (
																	<p
																		className={clsx(
																			"text-muted-foreground text-sm mt-2",
																			timeSlotsLoading && "hidden",
																		)}
																	>
																		No available slots for this date. Please select another date.
																	</p>
																)}
															</>
														) : (
															<p className="text-muted-foreground text-sm mt-2">
																{isSelectedTodayDate
																	? CANNOT_BOOK_FOR_TODAY
																	: PLEASE_SELECT_DATE_FIRST}
															</p>
														)}
													</div>
												</div>
											</>
										) : (
											<>
												{/* Step 2: Personal Details Form */}
												<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
													<FormField
														control={form.control}
														name="name"
														render={({ field }) => (
															<FormItem>
																<FormLabel>Name</FormLabel>
																<FormControl>
																	<div className="relative">
																		<Input placeholder="John Doe" {...field} />
																		<User className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
																	</div>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>

													<FormField
														control={form.control}
														name="email"
														render={({ field }) => (
															<FormItem>
																<FormLabel>Email</FormLabel>
																<FormControl>
																	<div className="relative">
																		<Input placeholder="john@example.com" {...field} />
																		<Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
																	</div>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>

													<FormField
														control={form.control}
														name="phone"
														render={({ field }) => (
															<FormItem>
																<FormLabel>Phone (Optional)</FormLabel>
																<FormControl>
																	<div className="relative">
																		<Input placeholder="+62 812 3456 7890" {...field} />
																		<Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
																	</div>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>

													<FormField
														control={form.control}
														name="company"
														render={({ field }) => (
															<FormItem>
																<FormLabel>Company (Optional)</FormLabel>
																<FormControl>
																	<div className="relative">
																		<Input placeholder="Your Company" {...field} />
																		<Building className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
																	</div>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
												</div>

												<FormField
													control={form.control}
													name="topic"
													render={({ field }) => (
														<FormItem>
															<FormLabel>Consultation Topic</FormLabel>
															<Select onValueChange={field.onChange} defaultValue={field.value}>
																<FormControl>
																	<SelectTrigger>
																		<SelectValue placeholder="Select a topic" />
																	</SelectTrigger>
																</FormControl>
																<SelectContent>
																	<SelectGroup>
																		{TOPICS.map((topic) => (
																			<SelectItem key={topic} value={topic}>
																				{topic}
																			</SelectItem>
																		))}
																	</SelectGroup>
																</SelectContent>
															</Select>
															<FormMessage />
														</FormItem>
													)}
												/>

												<FormField
													control={form.control}
													name="message"
													render={({ field }) => (
														<FormItem>
															<FormLabel>Message</FormLabel>
															<FormDescription>
																Briefly describe what you'd like to discuss during the consultation
															</FormDescription>
															<FormControl>
																<div className="relative">
																	<Textarea
																		placeholder="I'd like to discuss a potential e-commerce project..."
																		className="min-h-[120px]"
																		{...field}
																	/>
																	<MessageSquare className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
																</div>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>

												<div className="bg-muted/30 p-4 rounded-lg border flex items-start gap-3">
													<CalendarClock className="h-5 w-5 text-primary mt-0.5" />
													<div>
														<p className="font-medium text-sm">Your selected time slot</p>
														<p className="text-muted-foreground text-sm">
															{selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy")} at{" "}
															{form.getValues().timeSlot?.startTime} -{" "}
															{form.getValues().timeSlot?.endTime}
														</p>
														<Button
															type="button"
															variant="link"
															className="p-0 h-auto text-primary mt-1"
															onClick={() => {
																setFormStep(1);
																scrollToBookingCard();
															}}
														>
															Change time slot
														</Button>
													</div>
												</div>

												<Button type="submit" className="w-full" disabled={mutation.isPending}>
													{mutation.isPending ? (
														<span className="flex items-center">
															<Loader2 className="mr-2 h-4 w-4 animate-spin" />
															Booking...
														</span>
													) : (
														"Book Consultation"
													)}
												</Button>
											</>
										)}
									</form>
								</Form>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</>
	);
};

export default BookConsultationPage;
