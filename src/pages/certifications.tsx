import { SEO } from "@/components/common/seo";
import { CertificationCard } from "@/components/cards/certification-card";
import { SectionHeader } from "@/components/ui/section-header";
import { certificationService } from "@/services";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Award, Filter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const CertificationsPage = () => {
	const [filter, setFilter] = useState<"all" | "enterprise" | "other">("enterprise");

	// Fetch all certifications from Firebase
	const { data: certifications = [], isLoading } = useQuery({
		queryKey: ["certifications"],
		queryFn: () => certificationService.getAll(),
	});

	// Get unique issuers
	const issuers = Array.from(new Set(certifications.map((cert) => cert.issuer)));

	// Filter certifications
	const filteredCertifications = certifications.filter((cert) => {
		if (filter === "all") return true;
		if (filter === "enterprise") return cert.isEnterprise;
		if (filter === "other") return !cert.isEnterprise;
		return true;
	});

	// Count statistics
	const stats = {
		total: certifications.length,
		enterprise: certifications.filter((c) => c.isEnterprise).length,
		active: certifications.filter(
			(c) => !c.expiryDate || c.expiryDate >= new Date(),
		).length,
	};

	return (
		<>
			<SEO
				title="Certifications"
				description="Professional certifications and credentials showcasing expertise in cloud computing, software development, and modern technologies."
			/>

			<div className="container px-4 py-12 md:py-20 max-w-7xl mx-auto">
				<SectionHeader
					title="Professional Certifications"
					subtitle="Credentials & Badges"
					description="A collection of my professional certifications demonstrating expertise in cloud platforms, software development, and modern technologies. Each certification represents rigorous training and validated knowledge."
					align="center"
					className="mb-8"
				/>

				{isLoading ? (
					<div className="space-y-8">
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
							{[1, 2, 3].map((i) => (
								<Skeleton key={i} className="h-32 rounded-lg" />
							))}
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{[1, 2, 3, 4, 5, 6].map((i) => (
								<Skeleton key={i} className="h-96 rounded-lg" />
							))}
						</div>
					</div>
				) : (
					<>
						{/* Statistics */}
						{/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-10 max-w-xl mx-auto">
							<div className="bg-card border rounded-lg p-6 text-center">
								<div className="text-3xl font-bold text-primary mb-2">{stats.total}</div>
								<div className="text-sm text-muted-foreground">Total Certifications</div>
							</div>
							<div className="bg-card border rounded-lg p-6 text-center">
								<div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
									{stats.enterprise}
								</div>
								<div className="text-sm text-muted-foreground">Enterprise Certified</div>
							</div>
						</div> */}

						{/* Filters */}
						<div className="flex flex-wrap items-center justify-center gap-3 mb-10">
							<div className="flex items-center gap-2 text-sm text-muted-foreground">
								<Filter className="w-4 h-4" />
								<span>Filter:</span>
							</div>
							<Button
								variant={filter === "enterprise" ? "default" : "outline"}
								size="sm"
								onClick={() => setFilter("enterprise")}
								className={filter === "enterprise" ? "bg-blue-600 hover:bg-blue-700" : ""}
							>
								Enterprise ({stats.enterprise})
							</Button>
							<Button
								variant={filter === "other" ? "default" : "outline"}
								size="sm"
								onClick={() => setFilter("other")}
							>
								Other ({certifications.length - stats.enterprise})
							</Button>
							<Button
								variant={filter === "all" ? "default" : "outline"}
								size="sm"
								onClick={() => setFilter("all")}
							>
								All ({certifications.length})
							</Button>
						</div>

						{/* Certifications Grid */}
						{filteredCertifications.length > 0 ? (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{filteredCertifications.map((certification) => (
									<CertificationCard key={certification.id} certification={certification} />
								))}
							</div>
						) : (
							<div className="text-center py-12">
								<Award className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
								<p className="text-muted-foreground">No certifications found for this filter.</p>
							</div>
						)}

						{/* Additional Info */}
						<div className="mt-16 bg-muted/30 border rounded-lg p-8 text-center max-w-3xl mx-auto">
							<h3 className="text-xl font-semibold mb-3">Continuous Learning</h3>
							<p className="text-muted-foreground mb-4">
								I'm committed to continuous professional development and staying current with the
								latest technologies and best practices. These certifications represent my dedication to
								excellence and ongoing learning in the tech industry.
							</p>
							{issuers.length > 0 && (
								<div className="flex flex-wrap justify-center gap-2">
									{issuers.map((issuer) => (
										<Badge key={issuer} variant="secondary">
											{issuer}
										</Badge>
									))}
								</div>
							)}
						</div>
					</>
				)}
			</div>
		</>
	);
};

export default CertificationsPage;
