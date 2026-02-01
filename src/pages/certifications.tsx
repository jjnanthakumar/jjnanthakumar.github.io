import { SEO } from "@/components/common/seo";
import { CertificationCard } from "@/components/cards/certification-card";
import { SectionHeader } from "@/components/ui/section-header";
import { certificationService } from "@/services";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Award, Filter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const CertificationsPage = () => {
	const [selectedSource, setSelectedSource] = useState<string | null>(null);
	const [enterpriseOnly, setEnterpriseOnly] = useState(true);

	// Fetch all certifications from Firebase
	const { data: certifications = [], isLoading } = useQuery({
		queryKey: ["certifications"],
		queryFn: () => certificationService.getAll(),
	});

	// Get unique issuers sorted
	const issuers = Array.from(new Set(certifications.map((cert) => cert.issuer))).sort();

	// Filter certifications based on source and enterprise toggle
	const filteredCertifications = certifications.filter((cert) => {
		if (selectedSource && cert.issuer !== selectedSource) return false;
		if (enterpriseOnly && !cert.isEnterprise) return false;
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
						{/* Statistics Cards */}
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
							<div className="bg-card border rounded-lg p-3 text-center">
								<div className="text-3xl font-bold text-primary mb-2">{stats.total}</div>
								<div className="text-sm text-muted-foreground">Total Certifications</div>
							</div>
							<div className="bg-card border rounded-lg p-3 text-center">
								<div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
									{stats.enterprise}
								</div>
								<div className="text-sm text-muted-foreground">Enterprise</div>
							</div>
							<div className="bg-card border rounded-lg p-3 text-center">
								<div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
									{certifications.length - stats.enterprise}
								</div>
								<div className="text-sm text-muted-foreground">Other</div>
							</div>
						</div>

						{/* Tag-based Filters */}
						<div className="flex flex-col items-center gap-4 mb-10">
							{/* Enterprise Toggle */}
							<div className="flex items-center gap-2">
								<Switch
									id="enterprise-toggle"
									checked={enterpriseOnly}
									onCheckedChange={setEnterpriseOnly}
								/>
								<label htmlFor="enterprise-toggle" className="text-sm font-medium cursor-pointer">
									Enterprise Only
								</label>
							</div>

							{/* Source Tags */}
							{issuers.length > 0 && (
								<div className="flex flex-wrap justify-center gap-2">
									<span className="text-sm text-muted-foreground flex items-center">
										<Filter className="w-6 h-4 mr-2" />
										Source:
									</span>
									{issuers.map((issuer) => (
										<Badge
											key={issuer}
											variant={selectedSource === issuer ? "default" : "outline"}
											className={`cursor-pointer transition-colors ${
												selectedSource === issuer
													? "bg-blue-600 hover:bg-blue-700"
													: "hover:bg-muted"
											}`}
											onClick={() =>
												setSelectedSource(selectedSource === issuer ? null : issuer)
											}
										>
											{issuer}
										</Badge>
									))}
								</div>
							)}
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
					</>
				)}
			</div>
		</>
	);
};

export default CertificationsPage;
