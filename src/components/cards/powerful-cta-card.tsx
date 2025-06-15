import { cn } from "@/lib/utils";
import { ArrowRight, Code, Sparkles, Zap } from "lucide-react";
import { Link } from "react-router";
import { Button } from "../ui/button";

interface PowerfulCTACardProps {
	className?: string;
	title?: string;
	description?: string;
	primaryButtonText?: string;
	primaryButtonLink?: string;
	primaryButtonScrollTo?: string; // ID of the element to scroll to
	secondaryButtonText?: string;
	secondaryButtonLink?: string;
	badge?: string;
	responseTime?: string;
}

const PowerfulCTACard = ({
	className,
	title = "Transform your ideas into exceptional digital experiences",
	description = "Let's craft something amazing together. Whether you need a custom website, a complex web application, or help with an existing project, I'm here to help you achieve your goals.",
	primaryButtonText = "Hire Me Now",
	primaryButtonLink = "/hire-me",
	secondaryButtonText = "Schedule a Free Consultation",
	secondaryButtonLink = "/book-consultation",
	badge = "Ready to collaborate?",
	responseTime = "Within 24 hours",
	primaryButtonScrollTo = undefined,
}: PowerfulCTACardProps) => {
	const scrollToElement = () => {
		const offset = 50;
		const element = document.getElementById(primaryButtonScrollTo);
		if (element) {
			const elementPosition = element.getBoundingClientRect().top + window.scrollY;
			window.scrollTo({
				top: elementPosition - offset,
				behavior: "smooth",
			});
		}
	};

	return (
		<div className={cn("relative overflow-hidden rounded-3xl shadow-xl", className)}>
			{/* Background gradient */}
			<div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary to-secondary z-0"></div>

			{/* Decorative shapes */}
			<div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 mix-blend-soft-light">
				<div className="absolute -top-1/2 -left-1/2 w-full h-full rounded-full bg-white/30 blur-3xl"></div>
				<div className="absolute -bottom-1/4 -right-1/4 w-full h-full rounded-full bg-white/30 blur-3xl"></div>
			</div>

			{/* Decorative icons */}
			<div className="absolute top-10 right-10 text-white/10 transform rotate-12">
				<Code size={140} strokeWidth={1} />
			</div>
			<div className="absolute bottom-10 left-10 text-white/10 transform -rotate-12">
				<Zap size={120} strokeWidth={1} />
			</div>

			<div className="relative z-10 p-10 md:p-16 flex flex-col md:flex-row items-center gap-10 md:gap-16">
				<div className="w-full">
					<div className="inline-block px-4 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-semibold mb-6">
						{badge}
					</div>
					<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
						{title.includes("ideas") ? (
							<>
								{title.split("ideas")[0]}
								<span className="underline decoration-4 decoration-white/40">ideas</span>
								{title.split("ideas")[1]}
							</>
						) : (
							title
						)}
					</h2>
					<p className="text-white/90 text-lg mb-8 max-w-xl">{description}</p>

					<div className="flex flex-wrap gap-4">
						<Button
							asChild={!primaryButtonScrollTo}
							size="lg"
							className="bg-white text-primary hover:bg-white/90 rounded-full px-8 group"
							onClick={primaryButtonScrollTo ? () => scrollToElement() : undefined}
						>
							{primaryButtonScrollTo ? (
								<div className="flex items-center">
									<Sparkles size={18} className="mr-2" />
									{primaryButtonText}
								</div>
							) : (
								<Link to={primaryButtonLink}>
									<Sparkles size={18} className="mr-2" />
									{primaryButtonText}
								</Link>
							)}
						</Button>
						<Button
							asChild
							variant="outline"
							size="lg"
							className="text-white border-white/40 hover:bg-white/20 rounded-full px-8 bg-muted/5 group"
						>
							<Link to={secondaryButtonLink}>
								{secondaryButtonText}
								<ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
							</Link>
						</Button>
					</div>

					{responseTime && (
						<div className="mt-8 flex items-center space-x-2 text-white/80">
							<span className="text-sm">Typical response time:</span>
							<span className="font-medium text-white text-sm">{responseTime}</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default PowerfulCTACard;
