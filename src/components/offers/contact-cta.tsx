
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, Calendar, CalendarDays, MessageCircleIcon, Sparkles, Zap } from "lucide-react";
import { Link } from "react-router";

interface ContactCTAProps {
	className?: string;
	variant?: "default" | "gradient" | "subtle";
	title?: string;
	description?: string;
	primaryButtonText?: string;
	primaryButtonLink?: string;
	secondaryButtonText?: string;
	secondaryButtonLink?: string;
}

export function ContactCTA({
	className,
	variant = "default",
	title = "Need a custom solution tailored to your needs?",
	description = "Don't see exactly what you need? I can create a tailored solution based on your specific requirements. Let's discuss your project and find the best approach together.",
	primaryButtonText = "Book a Free Consultation",
	primaryButtonLink = "/book-consultation",
	secondaryButtonText = "Contact Me",
	secondaryButtonLink = "/contact",
}: ContactCTAProps) {
	return (
		<div
			className={cn(
				"w-full max-w-5xl mx-auto px-8 py-12 rounded-2xl relative overflow-hidden",
				variant === "default" &&
					"bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 border border-primary/20",
				variant === "gradient" &&
					"bg-gradient-to-br from-primary via-primary/80 to-secondary text-white",
				variant === "subtle" && "bg-muted/50 border border-border/60",
				className,
			)}
		>
			{/* Decorative elements */}
			{variant === "gradient" && (
				<>
					<div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-black/20 mix-blend-overlay"></div>
					<div className="absolute top-0 right-0 w-full h-full overflow-hidden opacity-20 mix-blend-soft-light">
						<div className="absolute -top-1/2 -left-1/2 w-full h-full rounded-full bg-white/30 blur-3xl"></div>
						<div className="absolute -bottom-1/4 -right-1/4 w-full h-full rounded-full bg-white/30 blur-3xl"></div>
					</div>
					<div className="absolute -right-10 top-10 opacity-10 pointer-events-none">
						<Zap size={120} strokeWidth={1} />
					</div>
				</>
			)}

			<div className="relative z-10 text-center space-y-6">
				{variant === "gradient" ? (
					<div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white font-medium mb-2">
						<Sparkles size={16} className="text-white" />
						LIMITED AVAILABILITY
					</div>
				) : (
					<div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-medium mb-2">
						<Calendar size={16} />
						TAKING NEW PROJECTS
					</div>
				)}

				<h2
					className={cn("text-2xl md:text-3xl font-bold", variant === "gradient" && "text-white")}
				>
					{title}
				</h2>

				<p
					className={cn(
						"max-w-2xl mx-auto",
						variant === "gradient" ? "text-white/90" : "text-muted-foreground",
					)}
				>
					{description}
				</p>

				<div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
					<Button
						asChild
						size="lg"
						className={cn(
							"gap-2 rounded-full px-8 group",
							variant === "gradient" && "bg-white text-primary hover:bg-white/90",
						)}
					>
						<Link to={primaryButtonLink}>
							<CalendarDays size={18} />
							{primaryButtonText}
						</Link>
					</Button>

					<Button
						asChild
						size="lg"
						variant={variant === "gradient" ? "outline" : "secondary"}
						className={cn(
							"gap-2 rounded-full px-8 group bg-muted/5",
							variant === "gradient" && "text-white border-white/40 hover:bg-white/10",
						)}
					>
						<Link to={secondaryButtonLink}>
							<MessageCircleIcon size={18} />
							{secondaryButtonText}
							<ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
						</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
