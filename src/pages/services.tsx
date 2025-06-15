"use client";

import PowerfulCTACard from "@/components/cards/powerful-cta-card";
import { SEO } from "@/components/common/seo";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import environment from "@/config/environment";
import { getCtaDataForPage } from "@/lib/get-cta-data-for-page";
import { cn } from "@/lib/utils";
import { serviceRequestService } from "@/services";
import { getReCaptchaToken, validateCaptchaToken } from "@/services/recaptcha";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
	ArrowRight,
	CheckCircle,
	CheckCircle2,
	Code,
	Database,
	Gauge,
	Lightbulb,
	Users,
	Zap,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { z } from "zod";

const services = [
	{
		id: "frontend",
		title: "Frontend Development",
		description:
			"Modern, high-performance web applications using React, Vue, and Angular with clean, maintainable code and best practices.",
		icon: Code,
		price: "$15/hour",
		features: [
			"Responsive design for all devices",
			"Cross-browser compatibility",
			"Performance optimization",
			"Accessibility compliance",
			"Modern UI frameworks",
		],
	},
	{
		id: "ui-ux",
		title: "UI/UX Implementation",
		description:
			"Pixel-perfect user interfaces from Figma and design mockups with attention to detail, consistency, and usability.",
		icon: Lightbulb,
		price: "$10/hour",
		features: [
			"Figma to code conversion",
			"Design system implementation",
			"Interactive prototypes",
			"User-centered design",
			"Usability testing",
		],
	},
	{
		id: "performance",
		title: "Performance Optimization",
		description:
			"Optimize websites to load faster using code splitting, lazy loading, caching strategies, and minimizing render-blocking resources.",
		icon: Gauge,
		price: "$10/hour",
		features: [
			"Core Web Vitals improvement",
			"Lighthouse score optimization",
			"Bundle size reduction",
			"Image optimization",
			"Server-side rendering",
		],
	},
	{
		id: "api",
		title: "API Integration",
		description:
			"Seamless integration of frontend applications with backend systems using RESTful APIs and Firebase.",
		icon: Database,
		price: "$10/hour",
		features: [
			"RESTful API integration",
			"GraphQL implementation",
			"Real-time data synchronization",
			"Authentication & authorization",
			"Error handling & retry logic",
		],
	},
	{
		id: "animation",
		title: "Web Animation",
		description:
			"Engaging animations using Framer Motion and CSS, from micro-interactions to complex page transitions.",
		icon: Zap,
		price: "$10/hour",
		features: [
			"Smooth page transitions",
			"Micro-interactions",
			"SVG animations",
			"3D effects",
			"Performance-optimized animations",
		],
	},
	{
		id: "leadership",
		title: "Technical Leadership",
		description:
			"Leading development teams, conducting code reviews, and ensuring efficient collaboration with coding standards.",
		icon: Users,
		price: "$25/hour",
		features: [
			"Code review & mentoring",
			"Architecture planning",
			"Best practices implementation",
			"Team workflow optimization",
			"Technical documentation",
		],
	},
];

const timeframes = [
	{ id: "asap", label: "As soon as possible" },
	{ id: "1-2-weeks", label: "Within 1-2 weeks" },
	{ id: "1-month", label: "Within a month" },
	{ id: "flexible", label: "Flexible / Not urgent" },
];

const budgetRanges = [
	{ id: "under-1000", label: "Under $1,000" },
	{ id: "1000-5000", label: "$ 1,000 - $ 5,000" },
	{ id: "5000-10000", label: "$ 5,000 - $ 10,000" },
	{ id: "10000-plus", label: "$ 10,000+" },
	{ id: "hourly", label: "Hourly rate" },
];

const serviceFormSchema = z.object({
	name: z.string().min(1, "Name is required"),
	email: z.string().min(1, "Email is required").email("Invalid email address"),
	company: z.string().optional(),
	serviceType: z.string().min(1, "Please select a service type"),
	budget: z.string().min(1, "Please select a budget range"),
	timeframe: z.string().min(1, "Please select a timeframe"),
	projectDetails: z.string().min(20, "Project details must be at least 20 characters"),
	termsAccepted: z.boolean().refine((val) => val === true, {
		message: "You must accept the terms and conditions",
	}),
});

type ServiceFormValues = z.infer<typeof serviceFormSchema>;

const Services = () => {
	const ctaData = getCtaDataForPage("services");
	const [selectedService, setSelectedService] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<ServiceFormValues>({
		resolver: zodResolver(serviceFormSchema),
		defaultValues: {
			name: "",
			email: "",
			company: "",
			serviceType: "",
			budget: "",
			timeframe: "",
			projectDetails: "",
			termsAccepted: false,
		},
	});

	const mutation = useMutation({
		mutationFn: (data: ServiceFormValues) => {
			return serviceRequestService.submit({
				name: data.name,
				email: data.email,
				company: data.company || undefined,
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

	const onSubmit = async (data: ServiceFormValues) => {
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
	};

	return (
		<div className="space-y-24">
			<SEO
				title="Services"
				description="Professional web development services including frontend development, UI/UX implementation, and performance optimization. Expert solutions for your digital needs"
				type="website"
			/>
			{/* Hero Section */}
			<section className="relative overflow-hidden py-12 md:py-20">
				<div className="container px-4 max-w-6xl mx-auto">
					<SectionHeader
						title="Professional Services"
						subtitle="What I Offer"
						description="I provide specialized frontend development services tailored to your project needs. Browse my service offerings below and request a custom quote."
						className="mb-16"
					/>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{services.map((service) => {
							const Icon = service.icon;
							return (
								<Card
									key={service.id}
									className={cn(
										"border border-border/40 transition-all duration-300 overflow-hidden",
										selectedService === service.id
											? "ring-2 ring-primary border-transparent shadow-lg"
											: "hover:border-primary/30 hover:shadow-md",
									)}
								>
									<CardHeader className="pb-4">
										<div className="p-3 bg-primary/10 rounded-xl text-primary mb-4 w-fit">
											<Icon size={24} />
										</div>
										<CardTitle className="text-xl">{service.title}</CardTitle>
										<CardDescription className="text-sm mt-2">
											{service.description}
										</CardDescription>
									</CardHeader>
									<CardContent className="pb-4">
										<div className="font-bold text-lg mb-4">{service.price}</div>
										<ul className="space-y-2">
											{service.features.map((feature, index) => (
												<li key={index} className="flex items-start text-sm text-muted-foreground">
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
											variant={selectedService === service.id ? "default" : "outline"}
											className="w-full rounded-xl"
											onClick={() => handleServiceSelect(service.id)}
										>
											{selectedService === service.id ? "Selected" : "Select Service"}
										</Button>
									</CardFooter>
								</Card>
							);
						})}
					</div>
				</div>
			</section>

			{/* Process Section */}
			<section className="py-16 relative overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 pointer-events-none"></div>
				<div className="container px-4 max-w-6xl mx-auto">
					<SectionHeader
						title="How It Works"
						subtitle="My Process"
						description="A simple, effective process to ensure your project is completed successfully."
						className="mb-16"
					/>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						{[
							{
								step: 1,
								title: "Request",
								description: "Submit your project details through the form above.",
								icon: <span className="text-2xl font-bold">1</span>,
							},
							{
								step: 2,
								title: "Consultation",
								description: "We'll discuss your needs and I'll provide a custom quote.",
								icon: <span className="text-2xl font-bold">2</span>,
							},
							{
								step: 3,
								title: "Development",
								description: "I'll work on your project with regular updates and feedback.",
								icon: <span className="text-2xl font-bold">3</span>,
							},
							{
								step: 4,
								title: "Delivery",
								description: "You'll receive the completed project with documentation and support.",
								icon: <span className="text-2xl font-bold">4</span>,
							},
						].map((step) => (
							<div
								key={step.step}
								className="bg-background border border-border/40 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 relative overflow-hidden"
							>
								<div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-bl-2xl flex items-center justify-center font-bold text-primary">
									{step.icon}
								</div>
								<h3 className="text-xl font-bold mb-4 mt-6">{step.title}</h3>
								<p className="text-muted-foreground">{step.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Request Form Section */}
			<section className="bg-gradient-to-b from-background to-muted/30">
				<div id="request-service-form" className="container px-4 py-16 max-w-6xl mx-auto">
					<SectionHeader
						title="Request a Service"
						subtitle="Work With Me"
						description="Fill out the form below to request a service. I'll review your project details and get back to you with a custom quote."
						className="mb-16"
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
															{services.map((service) => (
																<SelectItem key={service.id} value={service.id}>
																	{service.title}
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

			{/* FAQ Section */}
			<section className="py-16">
				<div className="container px-4 max-w-6xl mx-auto">
					<SectionHeader title="Frequently Asked Questions" subtitle="FAQs" className="mb-16" />

					<div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
						{[
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
						].map((faq, index) => (
							<div
								key={index}
								className="bg-background border border-border/40 rounded-xl p-6 hover:border-primary/30 hover:shadow-sm transition-all duration-300"
							>
								<h3 className="text-lg font-bold mb-2">{faq.question}</h3>
								<p className="text-muted-foreground">{faq.answer}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Enhanced CTA Section */}
			<section className="pb-16">
				<div className="container px-4 max-w-6xl mx-auto">
					<PowerfulCTACard {...ctaData} />
				</div>
			</section>
		</div>
	);
};

export default Services;
