"use client";

import PowerfulCTACard from "@/components/cards/powerful-cta-card";
import { QuickContactCTA } from "@/components/cta/quick-contact-cta";
import { SEO } from "@/components/common/seo";
import { StatsSection } from "@/components/stats/stats-section";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Form,
	FormControl,
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
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import environment from "@/config/environment";
import { serviceTiers, expertiseAreas } from "@/data/tiers";
import { getCtaDataForPage } from "@/lib/get-cta-data-for-page";
import { cn } from "@/lib/utils";
import { serviceRequestService } from "@/services";
// import { getReCaptchaToken, validateCaptchaToken } from "@/services/recaptcha";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
	ArrowRight,
	Calendar,
	CalendarDays,
	CheckCircle,
	CheckCircle2,
	ChevronDown,
	Clock,
	Code,
	Database,
	Gauge,
	Lightbulb,
	MessageSquare,
	Users,
	Zap,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { z } from "zod";

// Testimonials
const testimonials = [
	{
		name: "Sarah Johnson",
		role: "Product Manager at TechCorp",
		content:
			"Working with Nanthakumar was a game-changer for our project. His attention to detail and technical expertise helped us launch our product ahead of schedule. I was particularly impressed with his ability to translate complex requirements into elegant solutions.",
		image: "/placeholder.svg?height=80&width=80",
		rating: 5,
	},
	{
		name: "Michael Chen",
		role: "Founder at StartupX",
		content:
			"Nanthakumar delivered exceptional work on our web application. His frontend skills are top-notch, and he was able to optimize our site performance beyond our expectations. Communication was clear and timely throughout the project.",
		image: "/placeholder.svg?height=80&width=80",
		rating: 5,
	}
];

// Process steps
const processSteps = [
	{
		number: "01",
		title: "Discovery Call",
		description:
			"We'll discuss your project requirements, timeline, and budget to ensure we're a good fit for each other.",
		icon: MessageSquare,
	},
	{
		number: "02",
		title: "Proposal & Agreement",
		description:
			"I'll provide a detailed proposal outlining scope, deliverables, timeline, and pricing for your project.",
		icon: CheckCircle,
	},
	{
		number: "03",
		title: "Development",
		description:
			"I'll work on your project with regular updates and check-ins to ensure we're on the right track.",
		icon: Code,
	},
	{
		number: "04",
		title: "Delivery & Support",
		description:
			"Once complete, I'll deliver the final product and provide support to ensure everything works perfectly.",
		icon: Zap,
	},
];

// FAQ items
const faqItems = [
	{
		question: "What is your typical turnaround time?",
		answer:
			"Turnaround time varies depending on project complexity. Small projects typically take 1-2 weeks, while larger projects may take 4-8 weeks or more. I'll provide a specific timeline during our consultation.",
	},
	{
		question: "Do you offer ongoing maintenance?",
		answer:
			"Yes, I offer maintenance packages to keep your project up-to-date and running smoothly. We can discuss maintenance options based on your specific needs.",
	},
	{
		question: "How do payments work?",
		answer:
			"For most projects, I require a 50% deposit to begin work, with the remaining 50% due upon completion. For larger projects, we can establish a milestone-based payment schedule.",
	},
	{
		question: "Can you work with my existing team?",
		answer:
			"I'm experienced in collaborating with existing teams and can adapt to your workflow and communication preferences.",
	},
	{
		question: "Do you sign NDAs?",
		answer:
			"Yes, I'm happy to sign a Non-Disclosure Agreement before discussing your project details to protect your confidential information.",
	},
	{
		question: "What if I'm not satisfied with the work?",
		answer:
			"Your satisfaction is my priority. I offer revision rounds as part of the project scope. If you're not satisfied, we'll work together to address your concerns until you're happy with the results.",
	},
];

// Availability slots
const availabilitySlots = [
	{
		month: "Jun",
		year: 2025,
		availability: "Limited Availability",
		status: "limited",
	},
	{
		month: "Jul",
		year: 2025,
		availability: "Available",
		status: "available",
	},
	{
		month: "Aug",
		year: 2025,
		availability: "Available",
		status: "available",
	},
];

// Form schema
const hireFormSchema = z.object({
	name: z.string().min(1, { message: "Name is required" }),
	email: z.string().min(1, { message: "Email is required" }).email("Invalid email address"),
	company: z.string().optional(),
	websiteUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
	serviceType: z.string().min(1, { message: "Please select a service type" }),
	budget: z.string().min(1, { message: "Please select a budget range" }),
	timeframe: z.string().min(1, { message: "Please select a timeframe" }),
	projectDetails: z.string().min(20, { message: "Project details must be at least 20 characters" }),
	termsAccepted: z.boolean().refine((val) => val === true, {
		message: "You must accept the terms and conditions",
	}),
});

type HireFormValues = z.infer<typeof hireFormSchema>;

const timeframes = [
	{ id: "asap", label: "As soon as possible" },
	{ id: "1-2-weeks", label: "Within 1-2 weeks" },
	{ id: "1-month", label: "Within a month" },
	{ id: "flexible", label: "Flexible / Not urgent" },
];

const budgetRanges = [
	{ id: "under-1000", label: "Under $1,000" },
	{ id: "1000-3000", label: "$1,000 - $3,000" },
	{ id: "3000-5000", label: "$3,000 - $5,000" },
	{ id: "5000-10000", label: "$5,000 - $10,000" },
	{ id: "above-10000", label: "Above $10,000" },
];

const HireMePage = () => {
	const ctaData = getCtaDataForPage("hire-me");
	const [selectedService, setSelectedService] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState("services");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<HireFormValues>({
		resolver: zodResolver(hireFormSchema),
		defaultValues: {
			name: "",
			email: "",
			company: "",
			websiteUrl: "",
			serviceType: "",
			budget: "",
			timeframe: "",
			projectDetails: "",
			termsAccepted: false,
		},
	});

	const mutation = useMutation({
		mutationFn: (data: HireFormValues) => {
			return serviceRequestService.submit({
				name: data.name,
				email: data.email,
				company: data.company || undefined,
				websiteUrl: data.websiteUrl || undefined,
				serviceType: data.serviceType,
				budget: data.budget,
				timeframe: data.timeframe,
				projectDetails: data.projectDetails,
			});
		},
		onSuccess: () => {
			toast({
				title: "Request submitted!",
				description: "Thanks for your interest. I'll get back to you soon.",
			});
			form.reset();
		},
		onError: () => {
			toast({
				title: "Error",
				description: "Failed to send your request. Please try again.",
				variant: "destructive",
			});
		},
		onSettled: () => {
			setIsSubmitting(false);
		},
	});

	const onSubmit = async (data: HireFormValues) => {
		setIsSubmitting(true);

		// if (environment.app.envProd) {
		// 	// Validate reCAPTCHA token
		// 	const token = await getReCaptchaToken();
		// 	const validateCaptcha = await validateCaptchaToken(token);

		// 	if (validateCaptcha.success) {
		// 		mutation.mutate(data);
		// 	} else {
		// 		toast({
		// 			title: "Error",
		// 			description: "Failed to verify reCAPTCHA. Please try again.",
		// 			variant: "destructive",
		// 		});
		// 		setIsSubmitting(false);
		// 	}
		// } else {
		mutation.mutate(data);
		// }
	};

	const handleServiceSelect = (serviceId: string) => {
		setSelectedService(serviceId);
		form.setValue("serviceType", serviceId);

		// Scroll to the contact form
		const contactForm = document.getElementById("contact-form");
		if (contactForm) {
			contactForm.scrollIntoView({ behavior: "smooth" });
		}
	};

	return (
		<div className="space-y-24">
			<SEO
				title="Hire Me"
				description="Looking for a skilled Architect/developer? Let's collaborate on your next project. Offering expertise in React, Python and Cloud solutions."
				type="website"
			/>

			{/* Hero Section */}
			<section className="relative overflow-hidden py-12 md:py-20">
				<div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
				<div className="container px-4 max-w-6xl mx-auto">
					<div className="flex flex-col items-center text-center max-w-3xl mx-auto">
						<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium mb-6 animate-fade-in">
							<Calendar size={16} className="shrink-0" />
							CURRENTLY ACCEPTING NEW PROJECTS
						</div>

						<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight leading-tight animate-fade-in">
							Let's Build Something <span className="text-primary">Amazing</span> Together
						</h1>

						<p className="text-lg text-muted-foreground mb-8 leading-relaxed animate-fade-in">
							I'm a Technical Architect and Python developer specializing in creating high-performance, scalable, cloud native, and user-friendly web
							applications. Whether you need a new website, a complex web application, or help with
							an existing project, I'm here to bring your vision to life.
						</p>

						<div className="flex flex-wrap gap-4 justify-center animate-fade-in">
							<Button
								size="lg"
								className="rounded-full px-8 group"
								onClick={() => {
									const contactForm = document.getElementById("contact-form");
									if (contactForm) {
										contactForm.scrollIntoView({ behavior: "smooth" });
									}
								}}
							>
								Get Started
								<ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
							</Button>

							<Button
								variant="outline"
								size="lg"
								className="rounded-full px-8 group"
								onClick={() => {
									const servicesSection = document.getElementById("services-section");
									if (servicesSection) {
										servicesSection.scrollIntoView({ behavior: "smooth" });
									}
								}}
							>
								View Services
								<ChevronDown className="ml-2 transition-transform" />
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<section className="container px-4 max-w-6xl mx-auto">
				<StatsSection />
			</section>

			{/* Availability Section */}
			<section className="py-12 bg-muted/30">
				<div className="container px-4 max-w-6xl mx-auto">
					<div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-background border border-border/40 rounded-3xl p-8 shadow-lg">
						<div className="md:w-1/2">
							<h2 className="text-2xl font-bold mb-2">Current Availability</h2>
							<p className="text-muted-foreground mb-6">
								Here's my availability for upcoming projects. Book a consultation to secure your
								spot.
							</p>

							{/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
								{availabilitySlots.map((slot) => (
									<div
										key={`${slot.month}-${slot.year}`}
										className="text-center p-4 border border-border/40 rounded-xl bg-background"
									>
										<p className="font-medium">
											{slot.month} {slot.year}
										</p>
										<Badge
											variant={
												slot.status === "available"
													? "default"
													: slot.status === "limited"
														? "secondary"
														: "outline"
											}
											className="mt-2"
										>
											{slot.availability}
										</Badge>
									</div>
								))}
							</div> */}
						</div>

						<div className="md:w-1/2 flex flex-col items-center md:items-end">
							<div className="flex items-center gap-2 mb-4">
								<Clock size={20} className="text-primary" />
								<span className="font-medium">Timezone: UTC+05:30 (IST)</span>
							</div>

							<Button size="lg" className="rounded-full px-8 w-full md:w-auto" asChild>
								<Link to="/book-consultation" rel="noopener noreferrer">
									<CalendarDays size={18} />
									Schedule a Consultation
								</Link>
							</Button>

							<p className="text-sm text-muted-foreground mt-3">
								Free 30-minute discovery call to discuss your project
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Services & Pricing Section */}
			<section id="services-section" className="py-24 relative overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 pointer-events-none"></div>
				<div className="container px-4 max-w-6xl mx-auto">
					<SectionHeader
						title="Services & Pricing"
						subtitle="How I Can Help"
						description="Choose the service package that best fits your project needs and budget."
						className="text-center mb-16"
					/>

					<Tabs defaultValue="services" className="w-full" onValueChange={setActiveTab}>
						<TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
							<TabsTrigger
								value="services"
								className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
							>
								Service Packages
							</TabsTrigger>
							<TabsTrigger
								value="expertise"
								className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
							>
								Areas of Expertise
							</TabsTrigger>
						</TabsList>

						<TabsContent value="services" className="space-y-8 animate-fade-in">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
								{serviceTiers.map((tier) => (
									<Card
										key={tier.id}
										className={cn(
											"border border-border/40 transition-all duration-300 overflow-hidden relative",
											selectedService === tier.id
												? "ring-2 ring-primary border-transparent shadow-lg"
												: "hover:border-primary/30 hover:shadow-md",
										)}
									>
										{tier.popular && (
											<div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 text-xs font-medium">
												Most Popular
											</div>
										)}

										<CardHeader className="pb-4">
											<CardTitle className="text-xl">{tier.name}</CardTitle>
											<div className="mt-2">
												<span className="text-3xl font-bold">{tier.price}</span>
											</div>
											<CardDescription className="mt-2">{tier.description}</CardDescription>
										</CardHeader>

										<CardContent className="pb-4">
											<ul className="space-y-2">
												{tier.features.map((feature, index) => (
													<li key={index} className="flex items-start text-sm">
														<CheckCircle
															size={16}
															className="mr-2 mt-0.5 text-primary flex-shrink-0"
														/>
														{feature}
													</li>
												))}
											</ul>
										</CardContent>

										<CardFooter>
											<Button
												variant={selectedService === tier.id ? "default" : "outline"}
												className="w-full rounded-xl"
												onClick={() => handleServiceSelect(tier.id)}
											>
												{tier.cta}
											</Button>
										</CardFooter>
									</Card>
								))}
							</div>

							<div className="text-center mt-8 text-muted-foreground">
								<p>
									Need a custom solution?{" "}
									<Button
										variant="link"
										className="p-0 h-auto"
										onClick={() => {
											const contactForm = document.getElementById("contact-form");
											if (contactForm) {
												contactForm.scrollIntoView({ behavior: "smooth" });
											}
										}}
									>
										Contact me
									</Button>{" "}
									for a personalized quote.
								</p>
							</div>
						</TabsContent>

						<TabsContent value="expertise" className="animate-fade-in">
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
								{expertiseAreas.map((service, index) => {
									const Icon = service.icon;
									return (
										<div
											key={index}
											className={cn(
												"group bg-background border border-border/50 rounded-xl p-8",
												"hover:border-primary/30 dark:hover:border-primary/70 hover:shadow-lg transition-all duration-300",
												"flex flex-col h-full",
											)}
											style={{ animationDelay: service.delay }}
										>
											<div className="p-4 bg-primary/10 rounded-xl text-primary mb-6 w-fit group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
												<Icon size={24} />
											</div>
											<h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">
												{service.title}
											</h3>
											<p className="text-muted-foreground leading-relaxed flex-grow">
												{service.description}
											</p>
										</div>
									);
								})}
							</div>
						</TabsContent>
					</Tabs>
				</div>
			</section>

			{/* Process Section */}
			<section className="py-24 bg-muted/30">
				<div className="container px-4 max-w-6xl mx-auto">
					<SectionHeader
						title="My Process"
						subtitle="How We'll Work Together"
						description="A simple, effective process to ensure your project is completed successfully."
						className="text-center mb-16"
					/>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						{processSteps.map((step, index) => {
							const Icon = step.icon;
							return (
								<div key={index} className="relative group">
									{/* Connector line */}
									{index < processSteps.length - 1 && (
										<div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-border z-0">
											<div
												className="absolute top-0 left-0 h-full bg-primary"
												style={{ width: "0%", transition: "width 1s ease" }}
											></div>
										</div>
									)}

									<div className="bg-background border border-border/40 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 relative overflow-hidden h-full z-10">
										<div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-bl-2xl flex items-center justify-center font-bold text-primary">
											{step.number}
										</div>

										<div className="p-4 bg-primary/10 rounded-xl text-primary mb-6 w-fit group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
											<Icon size={24} />
										</div>

										<h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">
											{step.title}
										</h3>

										<p className="text-muted-foreground">{step.description}</p>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</section>

			{/* Testimonials Section */}
			{/* <section className="py-24 relative overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
				<div className="container px-4 max-w-6xl mx-auto">
					<SectionHeader
						title="Client Testimonials"
						subtitle="What People Say"
						description="Don't just take my word for it. Here's what clients have to say about working with me."
						className="text-center mb-16"
					/>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{testimonials.map((testimonial, index) => (
							<div
								key={index}
								className="bg-background border border-border/40 rounded-xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full"
							>
								<div className="flex items-center gap-4 mb-6">
									<img
										src={testimonial.image || "/placeholder.svg"}
										alt={testimonial.name}
										className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
									/>
									<div>
										<h3 className="font-bold">{testimonial.name}</h3>
										<p className="text-sm text-muted-foreground">{testimonial.role}</p>
									</div>
								</div>

								<div className="flex mb-4">
									{Array.from({ length: 5 }).map((_, i) => (
										<Star
											key={i}
											size={16}
											className={
												i < testimonial.rating ? "text-yellow-500 fill-yellow-500" : "text-muted"
											}
										/>
									))}
								</div>

								<p className="text-muted-foreground italic flex-grow">"{testimonial.content}"</p>
							</div>
						))}
					</div>
				</div>
			</section> */}

			{/* FAQ Section */}
			<section className="py-24 bg-muted/30">
				<div className="container px-4 max-w-6xl mx-auto">
					<SectionHeader
						title="Frequently Asked Questions"
						subtitle="FAQs"
						description="Find answers to common questions about my services and process."
						className="text-center mb-16"
					/>

					<div className="max-w-3xl mx-auto">
						<Accordion type="single" collapsible className="w-full">
							{faqItems.map((item, index) => (
								<AccordionItem
									key={index}
									value={`item-${index}`}
									className="border-b border-border/40"
								>
									<AccordionTrigger className="text-left font-medium py-4 hover:text-primary transition-colors">
										{item.question}
									</AccordionTrigger>
									<AccordionContent className="text-muted-foreground pb-4">
										{item.answer}
									</AccordionContent>
								</AccordionItem>
							))}
						</Accordion>

						<div className="mt-12 text-center">
							<p className="text-muted-foreground mb-4">Still have questions?</p>
							<Button
								variant="outline"
								size="lg"
								className="rounded-full px-8"
								onClick={() => {
									const contactForm = document.getElementById("contact-form");
									if (contactForm) {
										contactForm.scrollIntoView({ behavior: "smooth" });
									}
								}}
							>
								Contact Me
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* Contact Form Section */}
			<section id="contact-form" className="py-24 relative overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
				<div className="container px-4 max-w-6xl mx-auto">
					<SectionHeader
						title="Let's Get Started"
						subtitle="Contact Me"
						description="Fill out the form below to discuss your project. I'll get back to you within 24 hours."
						className="text-center mb-16"
					/>

					<div className="bg-background border border-border/40 rounded-3xl p-8 md:p-12 shadow-lg relative overflow-hidden max-w-4xl mx-auto">
						<div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-background pointer-events-none"></div>

						<div className="relative">
							<Form {...form}>
								<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<FormField
											control={form.control}
											name="name"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-foreground/80 font-medium">
														Name <span className="text-primary">*</span>
													</FormLabel>
													<FormControl>
														<Input
															placeholder="Your name"
															className="rounded-xl border-border/50 focus-visible:ring-primary/30 bg-background/80 backdrop-blur-sm"
															{...field}
														/>
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
													<FormLabel className="text-foreground/80 font-medium">
														Email <span className="text-primary">*</span>
													</FormLabel>
													<FormControl>
														<Input
															placeholder="Your email"
															type="email"
															className="rounded-xl border-border/50 focus-visible:ring-primary/30 bg-background/80 backdrop-blur-sm"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									<FormField
										control={form.control}
										name="company"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-foreground/80 font-medium">
													Company (Optional)
												</FormLabel>
												<FormControl>
													<Input
														placeholder="Your company name"
														className="rounded-xl border-border/50 focus-visible:ring-primary/30 bg-background/80 backdrop-blur-sm"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="websiteUrl"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-foreground/80 font-medium">
													Website URL (Optional)
												</FormLabel>
												<FormControl>
													<Input
														placeholder="https://yourwebsite.com"
														type="url"
														className="rounded-xl border-border/50 focus-visible:ring-primary/30 bg-background/80 backdrop-blur-sm"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
										<FormField
											control={form.control}
											name="serviceType"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-foreground/80 font-medium">
														Service Type <span className="text-primary">*</span>
													</FormLabel>
													<Select
														onValueChange={field.onChange}
														defaultValue={field.value}
														value={field.value}
													>
														<FormControl>
															<SelectTrigger className="rounded-xl border-border/50 focus-visible:ring-primary/30 bg-background/80 backdrop-blur-sm">
																<SelectValue placeholder="Select a service" />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															<SelectItem value="basic">Basic Package</SelectItem>
															<SelectItem value="professional">Professional Package</SelectItem>
															<SelectItem value="enterprise">Enterprise Package</SelectItem>
															<SelectItem value="custom">Custom Project</SelectItem>
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="budget"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-foreground/80 font-medium">
														Budget <span className="text-primary">*</span>
													</FormLabel>
													<Select onValueChange={field.onChange} defaultValue={field.value}>
														<FormControl>
															<SelectTrigger className="rounded-xl border-border/50 focus-visible:ring-primary/30 bg-background/80 backdrop-blur-sm">
																<SelectValue placeholder="Select budget range" />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{budgetRanges.map((range) => (
																<SelectItem key={range.id} value={range.id}>
																	{range.label}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="timeframe"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-foreground/80 font-medium">
														Timeframe <span className="text-primary">*</span>
													</FormLabel>
													<Select onValueChange={field.onChange} defaultValue={field.value}>
														<FormControl>
															<SelectTrigger className="rounded-xl border-border/50 focus-visible:ring-primary/30 bg-background/80 backdrop-blur-sm">
																<SelectValue placeholder="Select timeframe" />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{timeframes.map((timeframe) => (
																<SelectItem key={timeframe.id} value={timeframe.id}>
																	{timeframe.label}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									<FormField
										control={form.control}
										name="projectDetails"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-foreground/80 font-medium">
													Project Details <span className="text-primary">*</span>
												</FormLabel>
												<FormControl>
													<Textarea
														placeholder="Describe your project, requirements, and any specific details that would help me understand your needs better."
														rows={6}
														className="rounded-xl border-border/50 focus-visible:ring-primary/30 resize-none bg-background/80 backdrop-blur-sm"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="termsAccepted"
										render={({ field }) => (
											<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 bg-muted/30">
												<FormControl>
													<Checkbox checked={field.value} onCheckedChange={field.onChange} />
												</FormControl>
												<div className="space-y-1 leading-none">
													<FormLabel className="text-sm">
														I agree to the{" "}
														<Link to="/terms-of-service" className="text-primary hover:underline">
															terms of service
														</Link>{" "}
														and{" "}
														<Link to="/privacy-policy" className="text-primary hover:underline">
															privacy policy
														</Link>
														.
													</FormLabel>
													<FormMessage />
												</div>
											</FormItem>
										)}
									/>

									<Button
										type="submit"
										size="lg"
										className={cn(
											"w-full md:w-auto px-8 rounded-full transition-all duration-300",
											"bg-primary hover:bg-primary/90 text-primary-foreground",
											"group overflow-hidden relative",
										)}
										disabled={mutation.isPending || isSubmitting}
									>
										{mutation.isPending || isSubmitting ? (
											<span className="flex items-center">
												<svg
													className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
												>
													<circle
														className="opacity-25"
														cx="12"
														cy="12"
														r="10"
														stroke="currentColor"
														strokeWidth="4"
													></circle>
													<path
														className="opacity-75"
														fill="currentColor"
														d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
													></path>
												</svg>
												Submitting...
											</span>
										) : (
											<>
												<span className="flex items-center gap-2 group-hover:-translate-x-2 transition-transform duration-300">
													Submit Request
													<ArrowRight className="w-4 h-4 group-hover:translate-x-4 transition-transform duration-300" />
												</span>
												<span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-primary">
													<CheckCircle2 className="w-5 h-5 mr-2" />
													Ready to Submit
												</span>
											</>
										)}
									</Button>
								</form>
							</Form>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-16 !mt-6">
				<div className="container px-4 max-w-6xl mx-auto">
					<PowerfulCTACard {...ctaData} />
				</div>
			</section>

			{/* Quick Contact CTA */}
			<QuickContactCTA />
		</div>
	);
};

export default HireMePage;
