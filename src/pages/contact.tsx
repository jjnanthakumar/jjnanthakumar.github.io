"use client";

import { SEO } from "@/components/common/seo";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import environment from "@/config/environment";
import { cn } from "@/lib/utils";
import { ContactForm, contactService } from "@/services";
// import { getReCaptchaToken, validateCaptchaToken } from "@/services/recaptcha";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
	ArrowRight,
	CheckCircle2,
	Clock,
	Github,
	Linkedin,
	Mail,
	MapPin,
	Phone,
	Twitter,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const contactDetails = [
	{
		icon: Mail,
		title: "Email",
		content: "jjnanthakumar477@gmail.com",
		link: "mailto:jjnanthakumar477@gmail.com",
	},
	{
		icon: Phone,
		title: "Phone or WhatsApp",
		content: "+91 8695255075",
		link: "tel:+918695255075",
	},
	{
		icon: MapPin,
		title: "Location",
		content: "Chennai, TamilNadu, India",
	},
	{
		icon: Clock,
		title: "Time Zone",
		content: "IST, UTC+05:30",
	},
];

const socialLinks = [
	{ icon: Github, url: "https://github.com/jjnanthakumar", label: "GitHub" },
	{ icon: Twitter, url: "https://x.com/jjnanthakumar", label: "Twitter" },
	{
		icon: Linkedin,
		url: "https://linkedin.com/in/jjnanthakumar",
		label: "LinkedIn",
	},
];

const contactFormSchema = z.object({
	name: z.string().min(1, "Name is required"),
	email: z.string().min(1, "Email is required").email("Invalid email address"),
	subject: z.string().min(1, "Subject is required"),
	message: z.string().min(20, "Message must be at least 20 characters"),
});

const Contact = () => {
	const form = useForm<z.infer<typeof contactFormSchema>>({
		resolver: zodResolver(contactFormSchema),
		defaultValues: {
			name: "",
			email: "",
			subject: "",
			message: "",
		},
	});

	const mutation = useMutation({
		mutationFn: (data: ContactForm) => contactService.submit({ ...data }),
		onSuccess: () => {
			toast({
				title: "Message sent!",
				description: "Thanks for reaching out. I'll get back to you soon.",
			});
			form.reset();
		},
		onError: () => {
			toast({
				title: "Error",
				description: "Failed to send your message. Please try again.",
				variant: "destructive",
			});
		},
		onSettled: () => {
			setIsSubmitting(false);
		},
		retry: false,
	});

	const [isSubmitting, setIsSubmitting] = useState(false);

	const onSubmit = async (data: z.infer<typeof contactFormSchema>) => {
		setIsSubmitting(true);
		mutation.mutate(data as ContactForm);
	};

	return (
		<section className="py-16 bg-gradient-to-b from-background to-muted/30">
			<SEO
				title="Contact"
				description="Get in touch with Nanthakumar, a frontend software engineer specializing in React, Vue, and modern web technologies. Contact me for inquiries, projects, or just to say hello."
				type="website"
			/>

			<div className="container px-4 max-w-6xl mx-auto">
				<SectionHeader
					title="Get In Touch"
					subtitle="Contact Me"
					description="Have a question or want to work together? Feel free to reach out. I'm always here to help."
					className="text-center mb-16"
				/>

				<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
					{/* Contact Form */}
					<div className="lg:col-span-7 order-2 lg:order-1">
						<div className="bg-background border border-border/40 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
							<div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-background pointer-events-none"></div>

							<div className="relative">
								<h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
									<span className="inline-block w-8 h-1 bg-primary rounded-full"></span>
									Send Me a Message
								</h3>

								<p className="text-muted-foreground mb-10">
									Fill out the form, and I'll get back to you as soon as possible.
								</p>

								<Form {...form}>
									<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
																id="name"
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
																id="email"
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
											name="subject"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-foreground/80 font-medium">
														Subject <span className="text-primary">*</span>
													</FormLabel>
													<FormControl>
														<Input
															id="subject"
															placeholder="Subject of your message"
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
											name="message"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-foreground/80 font-medium">
														Message <span className="text-primary">*</span>
													</FormLabel>
													<FormControl>
														<Textarea
															id="message"
															placeholder="Your message"
															rows={6}
															className="rounded-xl border-border/50 focus-visible:ring-primary/30 resize-none bg-background/80 backdrop-blur-sm"
															{...field}
														/>
													</FormControl>
													<FormMessage />
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
													Sending...
												</span>
											) : (
												<>
													<span className="flex items-center gap-2 group-hover:-translate-x-2 transition-transform duration-300">
														Send Message
														<ArrowRight className="w-4 h-4 group-hover:translate-x-4 transition-transform duration-300" />
													</span>
													<span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-primary">
														<CheckCircle2 className="w-5 h-5 mr-2" />
														Ready to Send
													</span>
												</>
											)}
										</Button>
									</form>
								</Form>
							</div>
						</div>
					</div>

					{/* Contact Information */}
					<div className="lg:col-span-5 order-1 lg:order-2">
						<div className="bg-background border border-border/40 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 h-full relative overflow-hidden">
							<div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-background pointer-events-none"></div>

							<div className="relative">
								<h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
									<span className="inline-block w-8 h-1 bg-primary rounded-full"></span>
									Contact Information
								</h3>

								<div className="space-y-8">
									{contactDetails.map(({ icon: Icon, title, content, link }, index) => (
										<div key={index} className="flex items-start group">
											<div className="p-4 bg-primary/10 rounded-2xl text-primary mr-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
												<Icon size={24} />
											</div>
											<div>
												<h4 className="font-semibold text-lg mb-1">{title}</h4>
												{link ? (
													<a
														href={link}
														className="text-muted-foreground hover:text-primary transition-colors"
														rel="noopener noreferrer"
														target="_blank"
													>
														{content}
													</a>
												) : (
													<p className="text-muted-foreground">{content}</p>
												)}
											</div>
										</div>
									))}
								</div>

								<div className="mt-12 pt-8 border-t border-border/30">
									<h4 className="font-semibold text-lg mb-5">Connect with me</h4>
									<div className="flex space-x-4">
										{socialLinks.map(({ icon: Icon, url, label }, index) => (
											<a
												key={index}
												href={url}
												target="_blank"
												rel="noopener noreferrer"
												className="p-3 bg-background border border-border/50 rounded-xl text-muted-foreground hover:text-primary hover:border-primary/50 hover:shadow-md transition-all duration-300"
												aria-label={label}
											>
												<Icon size={20} />
												<span className="sr-only">{label}</span>
											</a>
										))}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Contact;
