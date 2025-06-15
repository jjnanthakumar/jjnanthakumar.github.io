import { CmsLayout } from "@/components/layout/cms-layout";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { queryClient } from "@/lib/query-client";
import { AvailabilitySettings } from "@/services";
import { consultationService } from "@/services/consultations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
	CalendarIcon,
	ChevronLeft,
	Clock,
	HelpCircle,
	Loader2,
	Plus,
	Save,
	Trash2,
	X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

// Weekday options for checkboxes
const WEEKDAYS = [
	{ value: 0, label: "Sunday" },
	{ value: 1, label: "Monday" },
	{ value: 2, label: "Tuesday" },
	{ value: 3, label: "Wednesday" },
	{ value: 4, label: "Thursday" },
	{ value: 5, label: "Friday" },
	{ value: 6, label: "Saturday" },
];

// Form schema
const availabilitySchema = z.object({
	weekdays: z.array(z.number()).min(1, { message: "Select at least one day" }),
	timeSlots: z
		.array(
			z.object({
				startTime: z
					.string()
					.regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
				endTime: z
					.string()
					.regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
			}),
		)
		.min(1, { message: "Add at least one time slot" }),
	consultationDuration: z
		.number()
		.min(15, { message: "Minimum duration is 15 minutes" })
		.max(240, { message: "Maximum duration is 4 hours" }),
	bufferTime: z
		.number()
		.min(0, { message: "Buffer time must be 0 or greater" })
		.max(60, { message: "Maximum buffer time is 60 minutes" }),
	maxDaysInAdvance: z
		.number()
		.min(1, { message: "Minimum is 1 day" })
		.max(90, { message: "Maximum is 90 days" }),
	excludedDates: z.array(z.date()).optional(),
});

type AvailabilityFormValues = z.infer<typeof availabilitySchema>;

const ConsultationSettingsPage = () => {
	const navigate = useNavigate();
	const [selectedDates, setSelectedDates] = useState<Date[]>([]);
	const [isCalendarOpen, setIsCalendarOpen] = useState(false);

	// Initialize form
	const form = useForm<AvailabilityFormValues>({
		resolver: zodResolver(availabilitySchema),
		defaultValues: {
			weekdays: [1, 2, 3, 4, 5], // Monday to Friday by default
			timeSlots: [
				{ startTime: "09:00", endTime: "12:00" },
				{ startTime: "13:00", endTime: "17:00" },
			],
			consultationDuration: 60,
			bufferTime: 15,
			maxDaysInAdvance: 30,
			excludedDates: [],
		},
	});

	// Query for fetching settings
	const { data: settings, error: settingsError } = useQuery<AvailabilitySettings>({
		queryKey: ["consultationSettings"],
		queryFn: () => consultationService.getAvailabilitySettings(),
	});

	useEffect(() => {
		if (settings) {
			// Parse excluded dates from strings to Date objects
			const excludedDates = settings.excludedDates.map((dateStr) => new Date(dateStr));

			form.reset({
				...settings,
				excludedDates,
			});
			setSelectedDates(excludedDates);
		}
	}, [form, settings]);

	useEffect(() => {
		if (settingsError) {
			console.error("Error fetching availability settings:", settingsError);
			toast.error("Failed to load availability settings");
		}
	}, [settingsError]);

	// Mutation for updating settings
	const updateSettingsMutation = useMutation({
		mutationFn: (data: AvailabilityFormValues) => {
			// Convert excluded dates to string format
			const excludedDatesStr = data.excludedDates?.map((date) => format(date, "yyyy-MM-dd")) || [];

			return consultationService.updateAvailabilitySettings({
				weekdays: data.weekdays,
				timeSlots: data.timeSlots.map((slot) => ({
					startTime: slot.startTime!,
					endTime: slot.endTime!,
				})),
				consultationDuration: data.consultationDuration,
				bufferTime: data.bufferTime,
				maxDaysInAdvance: data.maxDaysInAdvance,
				excludedDates: excludedDatesStr,
			});
		},
		onSuccess: () => {
			toast.success("Availability settings updated successfully");
			// Invalidate and refetch settings
			queryClient.invalidateQueries({ queryKey: ["consultationSettings"] });
		},
		onError: (error) => {
			console.error("Error updating availability settings:", error);
			toast.error("Failed to update availability settings");
		},
	});

	// Handle form submission
	const onSubmit = (data: AvailabilityFormValues) => {
		updateSettingsMutation.mutate(data);
	};

	// Add new time slot
	const addTimeSlot = () => {
		const currentSlots = form.getValues("timeSlots");
		form.setValue("timeSlots", [...currentSlots, { startTime: "09:00", endTime: "17:00" }]);
	};

	// Remove time slot
	const removeTimeSlot = (index: number) => {
		const currentSlots = form.getValues("timeSlots");
		form.setValue(
			"timeSlots",
			currentSlots.filter((_, i) => i !== index),
		);
	};

	// Handle weekday toggle
	const toggleWeekday = (day: number) => {
		const currentDays = form.getValues("weekdays");
		if (currentDays.includes(day)) {
			form.setValue(
				"weekdays",
				currentDays.filter((d) => d !== day),
			);
		} else {
			form.setValue("weekdays", [...currentDays, day]);
		}
	};

	// Handle excluded date selection
	const handleDateSelect = (date: Date) => {
		setSelectedDates((prev) => {
			const dateStr = format(date, "yyyy-MM-dd");
			const exists = prev.some((d) => format(d, "yyyy-MM-dd") === dateStr);

			let newDates;
			if (exists) {
				newDates = prev.filter((d) => format(d, "yyyy-MM-dd") !== dateStr);
			} else {
				newDates = [...prev, date];
			}

			form.setValue("excludedDates", newDates);
			return newDates;
		});
	};

	return (
		<CmsLayout>
			<div className="space-y-6">
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
					<div>
						<h1 className="text-2xl font-bold tracking-tight">Availability Settings</h1>
						<p className="text-muted-foreground">
							Configure your consultation availability and schedule
						</p>
					</div>

					<div className="flex items-center gap-2 self-end sm:self-auto">
						<Button variant="outline" size="sm" onClick={() => navigate("/cms/consultations")}>
							<ChevronLeft className="h-4 w-4 mr-2" />
							Back to Bookings
						</Button>
					</div>
				</div>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>General Settings</CardTitle>
								<CardDescription>
									Configure your consultation duration, buffer time, and booking window
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
									<FormField
										control={form.control}
										name="consultationDuration"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Consultation Duration
													<TooltipProvider>
														<Tooltip>
															<TooltipTrigger asChild>
																<HelpCircle className="h-4 w-4 ml-1 inline-block text-muted-foreground" />
															</TooltipTrigger>
															<TooltipContent>
																<p className="w-[200px] text-xs">
																	The length of each consultation session in minutes
																</p>
															</TooltipContent>
														</Tooltip>
													</TooltipProvider>
												</FormLabel>
												<FormControl>
													<div className="flex items-center gap-2">
														<Input
															type="number"
															min={15}
															max={240}
															{...field}
															onChange={(e) => field.onChange(parseInt(e.target.value))}
															className="w-24"
														/>
														<span className="text-muted-foreground">minutes</span>
													</div>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="bufferTime"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Buffer Time
													<TooltipProvider>
														<Tooltip>
															<TooltipTrigger asChild>
																<HelpCircle className="h-4 w-4 ml-1 inline-block text-muted-foreground" />
															</TooltipTrigger>
															<TooltipContent>
																<p className="w-[200px] text-xs">
																	Extra time between consultations for breaks or preparation
																</p>
															</TooltipContent>
														</Tooltip>
													</TooltipProvider>
												</FormLabel>
												<FormControl>
													<div className="flex items-center gap-2">
														<Input
															type="number"
															min={0}
															max={60}
															{...field}
															onChange={(e) => field.onChange(parseInt(e.target.value))}
															className="w-24"
														/>
														<span className="text-muted-foreground">minutes</span>
													</div>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="maxDaysInAdvance"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Booking Window
													<TooltipProvider>
														<Tooltip>
															<TooltipTrigger asChild>
																<HelpCircle className="h-4 w-4 ml-1 inline-block text-muted-foreground" />
															</TooltipTrigger>
															<TooltipContent>
																<p className="w-[200px] text-xs">
																	How many days in advance clients can book consultations
																</p>
															</TooltipContent>
														</Tooltip>
													</TooltipProvider>
												</FormLabel>
												<FormControl>
													<div className="flex items-center gap-2">
														<Input
															type="number"
															min={1}
															max={90}
															{...field}
															onChange={(e) => field.onChange(parseInt(e.target.value))}
															className="w-24"
														/>
														<span className="text-muted-foreground">days</span>
													</div>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Available Days & Times</CardTitle>
								<CardDescription>
									Set your regular weekly availability for consultations
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<FormField
									control={form.control}
									name="weekdays"
									render={() => (
										<FormItem>
											<FormLabel>Available Days</FormLabel>
											<FormDescription>
												Select the days of the week when you're available for consultations
											</FormDescription>
											<div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
												{WEEKDAYS.map((day) => (
													<div
														key={day.value}
														onClick={() => toggleWeekday(day.value)}
														className={`
                              cursor-pointer rounded-md px-3 py-2 text-sm
                              border-2 transition-colors
                              ${
																form.getValues("weekdays").includes(day.value)
																	? "border-primary bg-primary/10"
																	: "border-muted-foreground/20 bg-transparent"
															}
                            `}
													>
														{day.label}
													</div>
												))}
											</div>
											<FormMessage />
										</FormItem>
									)}
								/>

								<Separator />

								<FormField
									control={form.control}
									name="timeSlots"
									render={() => (
										<FormItem>
											<div className="flex items-center justify-between">
												<FormLabel>Time Slots</FormLabel>
												<Button
													type="button"
													variant="outline"
													size="sm"
													onClick={addTimeSlot}
													className="h-8"
												>
													<Plus className="h-4 w-4 mr-1" />
													Add Slot
												</Button>
											</div>
											<FormDescription>
												Define time ranges when you're available on your selected days
											</FormDescription>

											<div className="space-y-3 mt-3">
												{form.getValues("timeSlots").map((slot, index) => (
													<div key={index} className="flex items-start gap-2">
														<div className="flex-1 grid grid-cols-2 gap-2">
															<div className="space-y-1">
																<span className="text-xs text-muted-foreground">Start Time</span>
																<div className="relative">
																	<Clock className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
																	<Input
																		placeholder="09:00"
																		value={slot.startTime}
																		onChange={(e) => {
																			const newSlots = [...form.getValues("timeSlots")];
																			newSlots[index].startTime = e.target.value;
																			form.setValue("timeSlots", newSlots);
																		}}
																		className="pl-9"
																	/>
																</div>
															</div>
															<div className="space-y-1">
																<span className="text-xs text-muted-foreground">End Time</span>
																<div className="relative">
																	<Clock className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
																	<Input
																		placeholder="17:00"
																		value={slot.endTime}
																		onChange={(e) => {
																			const newSlots = [...form.getValues("timeSlots")];
																			newSlots[index].endTime = e.target.value;
																			form.setValue("timeSlots", newSlots);
																		}}
																		className="pl-9"
																	/>
																</div>
															</div>
														</div>
														<Button
															type="button"
															variant="ghost"
															size="sm"
															onClick={() => removeTimeSlot(index)}
															className="mt-6"
															disabled={form.getValues("timeSlots").length <= 1}
														>
															<Trash2 className="h-4 w-4 text-muted-foreground" />
														</Button>
													</div>
												))}
											</div>
											<FormMessage />
										</FormItem>
									)}
								/>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Unavailable Dates</CardTitle>
								<CardDescription>
									Block specific dates when you're not available for consultations
								</CardDescription>
							</CardHeader>
							<CardContent>
								<FormField
									control={form.control}
									name="excludedDates"
									render={() => (
										<FormItem>
											<div className="flex flex-col md:flex-row gap-6">
												<div className="flex-1">
													<FormLabel>Select Dates to Exclude</FormLabel>
													<FormDescription>
														Click on dates to toggle their availability
													</FormDescription>

													<Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
														<PopoverTrigger asChild>
															<Button
																variant="outline"
																className="w-full justify-start text-left mt-2"
															>
																<CalendarIcon className="mr-2 h-4 w-4" />
																Select unavailable dates
															</Button>
														</PopoverTrigger>
														<PopoverContent className="w-auto p-0" align="start">
															<Calendar
																mode="multiple"
																selected={selectedDates}
																onSelect={(dates) => {
																	setSelectedDates(dates || []);
																	form.setValue("excludedDates", dates || []);
																}}
																className="rounded-md border"
															/>
														</PopoverContent>
													</Popover>
												</div>

												<div className="flex-1">
													<FormLabel>Currently Excluded Dates</FormLabel>
													<div className="min-h-24 mt-2 p-4 rounded-lg border border-input bg-background">
														{selectedDates.length === 0 ? (
															<p className="text-sm text-muted-foreground">
																No dates have been excluded
															</p>
														) : (
															<div className="flex flex-wrap gap-2">
																{selectedDates.map((date, i) => (
																	<Badge
																		key={i}
																		variant="secondary"
																		className="flex items-center gap-1 py-1.5"
																	>
																		{format(date, "MMM d, yyyy")}
																		<X
																			className="h-3 w-3 cursor-pointer"
																			onClick={() => handleDateSelect(date)}
																		/>
																	</Badge>
																))}
															</div>
														)}
													</div>
												</div>
											</div>
										</FormItem>
									)}
								/>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Advanced Settings</CardTitle>
								<CardDescription>
									Additional configuration options for consultations
								</CardDescription>
							</CardHeader>
							<CardContent>
								<Accordion type="single" collapsible className="w-full">
									<AccordionItem value="timezone">
										<AccordionTrigger>Timezone Settings</AccordionTrigger>
										<AccordionContent>
											<p className="text-muted-foreground text-sm mb-2">
												All times are currently displayed in your local timezone. Clients will see
												times converted to their local timezone.
											</p>
											<p className="text-muted-foreground text-sm">
												Your current local timezone:{" "}
												<span className="font-medium text-foreground">
													{Intl.DateTimeFormat().resolvedOptions().timeZone}
												</span>
											</p>
										</AccordionContent>
									</AccordionItem>

									<AccordionItem value="notifications">
										<AccordionTrigger>Email Notifications</AccordionTrigger>
										<AccordionContent>
											<p className="text-muted-foreground text-sm mb-4">
												Email notification settings will be available in a future update.
											</p>
										</AccordionContent>
									</AccordionItem>
								</Accordion>
							</CardContent>
							<CardFooter className="flex justify-end border-t pt-6">
								<Button type="submit" disabled={updateSettingsMutation.isPending}>
									{updateSettingsMutation.isPending ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Saving...
										</>
									) : (
										<>
											<Save className="mr-2 h-4 w-4" />
											Save Settings
										</>
									)}
								</Button>
							</CardFooter>
						</Card>
					</form>
				</Form>
			</div>
		</CmsLayout>
	);
};

export default ConsultationSettingsPage;
