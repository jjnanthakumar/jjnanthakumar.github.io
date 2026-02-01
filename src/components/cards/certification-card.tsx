import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ExternalLink, Calendar, Award, ShieldCheck } from "lucide-react";
import { TCertificationResponse } from "@/types/certifications";

interface CertificationCardProps {
	certification: TCertificationResponse;
	className?: string;
}

export function CertificationCard({ certification, className }: CertificationCardProps) {
	const {
		title,
		issuer,
		issuerLogo,
		issueDate,
		expiryDate,
		credentialId,
		credentialUrl,
		thumbnailUrl,
		description,
		skills,
		isEnterprise,
	} = certification;

	const formatDate = (date: Date | null) => {
		if (!date) return "";
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
		});
	};

	const isExpired = expiryDate && expiryDate < new Date();
	const isExpiringSoon =
		expiryDate &&
		!isExpired &&
		expiryDate.getTime() - new Date().getTime() < 90 * 24 * 60 * 60 * 1000; // 90 days

	return (
		<Card
			className={cn(
				"overflow-hidden transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px] flex flex-col",
			isEnterprise && "border-primary/30",
				className,
			)}
		>
			<CardHeader className="pb-4">
				<div className="flex items-start gap-4">
					{/* Badge/Thumbnail */}
					<div className="relative flex-shrink-0">
						<img
							src={thumbnailUrl}
							alt={`${title} badge`}
							className="w-20 h-20 object-contain rounded-lg"
						/>
						{isEnterprise && (
							<div className="absolute -top-1 -right-1 bg-blue-600 rounded-full p-1">
								<ShieldCheck className="w-4 h-4 text-white" />
							</div>
						)}
					</div>

					{/* Title and Issuer */}
					<div className="flex-1 min-w-0">
						<CardTitle className="text-lg mb-1 leading-tight">{title}</CardTitle>
						<CardDescription className="flex items-center gap-2">
							{issuerLogo && (
								<img
									src={issuerLogo}
									alt={issuer}
									className="w-4 h-4 object-contain"
								/>
							)}
							{!issuerLogo && <Award className="w-3 h-3" />}
							<span>{issuer}</span>
						</CardDescription>
					</div>
				</div>
			</CardHeader>

			<CardContent className="pt-0 space-y-3 flex-1">
				<p className="text-sm text-muted-foreground line-clamp-2">{description}</p>

				{/* Date Information */}
				<div className="grid grid-cols-2 gap-2 text-sm">
					<div className="flex items-center gap-1 text-muted-foreground">
						<Calendar className="w-4 h-4 flex-shrink-0" />
						<span className="truncate">Issued: {formatDate(issueDate)}</span>
					</div>
					{expiryDate && (
						<div className="flex items-center gap-1 justify-end">
							<Calendar className="w-4 h-4 flex-shrink-0" />
							<span
								className={cn(
									"truncate",
									isExpired && "text-destructive",
									isExpiringSoon && "text-orange-500",
									!isExpired && !isExpiringSoon && "text-muted-foreground",
								)}
							>
								Expires: {formatDate(expiryDate)}
							</span>
						</div>
					)}
					{!expiryDate && (
						<div className="flex items-center justify-end gap-1 text-green-600 dark:text-green-500">
							<ShieldCheck className="w-4 h-4 flex-shrink-0" />
							<span className="font-medium truncate">No Expiration</span>
						</div>
					)}
				</div>
				{expiryDate && (isExpired || isExpiringSoon) && (
					<div className="text-xs text-center">
						<Badge variant={isExpired ? "destructive" : "secondary"} className="text-xs">
							{isExpired ? "Expired" : "Expiring Soon"}
						</Badge>
					</div>
				)}

				{/* Credential ID */}
				{credentialId && (
					<div className="text-sm">
						<span className="text-muted-foreground">Credential ID: </span>
						<code className="text-xs bg-muted px-2 py-1 rounded break-all">{credentialId}</code>
					</div>
				)}

				{/* Skills */}
				{skills && skills.length > 0 && (
					<div className="flex flex-wrap gap-2 pt-2">
						{skills.map((skill, index) => (
							<Badge key={index} variant="secondary" className="text-xs">
								{skill}
							</Badge>
						))}
					</div>
				)}
			</CardContent>

			<CardFooter className="pt-2">
				{credentialUrl && (
					<Button asChild variant="outline" className="w-full">
						<a href={credentialUrl} target="_blank" rel="noopener noreferrer">
							<ExternalLink className="w-4 h-4 mr-2" />
							View Credential
						</a>
					</Button>
				)}
			</CardFooter>
		</Card>
	);
}
