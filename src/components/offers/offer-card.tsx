
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Link } from "react-router";
import { TOffer } from "@/types/offers";

interface OfferCardProps {
	offer: TOffer;
	className?: string;
}

export function OfferCard({ offer, className }: OfferCardProps) {
	const { title, description, icon: Icon, price, forWho, extras, popular, color } = offer;
	
	const formatPrice = (price: number) => {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(price);
	};
	
	return (
		<Card className={cn(
			"overflow-hidden transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px]",
			popular && "border-primary/50 shadow-md",
			className
		)}>
			{popular && (
				<div className="bg-primary text-primary-foreground text-xs font-medium text-center py-1.5">
					MOST POPULAR
				</div>
			)}
			
			<CardHeader className={cn(
				"pb-4",
				color && `bg-gradient-to-br from-${color}-50 to-${color}-100 dark:from-${color}-950/20 dark:to-${color}-900/30`
			)}>
				{Icon && <Icon className={cn("h-8 w-8 mb-2", color && `text-${color}-500`)} />}
				<CardTitle className="text-xl">{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			
			<CardContent className="pt-6 space-y-4">
				<div className="text-3xl font-bold text-foreground/90">
					{formatPrice(price)}
				</div>
				
				<div className="space-y-1.5">
					<h4 className="text-sm font-medium text-muted-foreground">Who it's for:</h4>
					<p className="text-sm">{forWho}</p>
				</div>
				
				{extras && extras.length > 0 && (
					<div className="space-y-2 pt-2">
						<h4 className="text-sm font-medium text-muted-foreground">What's included:</h4>
						<ul className="space-y-1.5">
							{extras.map((extra, index) => (
								<li key={index} className="flex items-start gap-2 text-sm">
									<span className="text-primary text-lg leading-none">•</span>
									<span>{extra}</span>
								</li>
							))}
						</ul>
					</div>
				)}
			</CardContent>
			
			<CardFooter className="flex flex-col space-y-3 pt-2">
				<Button asChild className="w-full">
					<Link to="/contact?service=custom">Get Started</Link>
				</Button>
			</CardFooter>
		</Card>
	);
}
