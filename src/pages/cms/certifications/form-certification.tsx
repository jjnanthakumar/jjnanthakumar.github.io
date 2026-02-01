import { CmsLayout } from "@/components/layout/cms-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/auth-context";
import { queryClient } from "@/lib/query-client";
import { certificationService, TCertificationResponse } from "@/services";
import { zodResolver } from "@hookform/resolvers/zod";
import { Timestamp } from "firebase/firestore";
import {
	Award,
	Calendar,
	Check,
	ExternalLink,
	ImageIcon,
	Loader2,
	Save,
	Shield,
	Tag,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

const certificationSchema = z.object({
	title: z.string().min(5, { message: "Title must be at least 5 characters" }),
	issuer: z.string().min(2, { message: "Issuer must be at least 2 characters" }),
	issuerLogo: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
	issueDate: z.string().min(1, { message: "Issue date is required" }),
	expiryDate: z.string().optional().or(z.literal("")),
	credentialId: z.string().optional().or(z.literal("")),
	credentialUrl: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
	thumbnailUrl: z.string().url({ message: "Please enter a valid badge URL" }),
	description: z.string().min(20, { message: "Description must be at least 20 characters" }),
	skills: z.string(),
	isEnterprise: z.boolean().default(false),
	isPublished: z.boolean().default(false),
	order: z.string().regex(/^\d+$/, { message: "Order must be a number" }).default("0"),
});

type CertificationFormValues = z.infer<typeof certificationSchema>;

const FormCertification = () => {
	const { user } = useAuth();
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const isEditMode = Boolean(id);

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isLoading, setIsLoading] = useState(isEditMode);
	const [currentCertification, setCurrentCertification] = useState<TCertificationResponse | null>(null);

	const form = useForm<CertificationFormValues>({
		resolver: zodResolver(certificationSchema),
		defaultValues: {
			title: "",
			issuer: "",
			issuerLogo: "",
			issueDate: "",
			expiryDate: "",
			credentialId: "",
			credentialUrl: "",
			thumbnailUrl: "",
			description: "",
			skills: "",
			isEnterprise: false,
			isPublished: false,
			order: "0",
		},
	});

	useEffect(() => {
		const fetchCertification = async () => {
			if (id) {
				setIsLoading(true);
				try {
					const certification = await certificationService.getById(id);
					if (certification) {
						setCurrentCertification(certification);
						form.reset({
							title: certification.title,
							issuer: certification.issuer,
							issuerLogo: certification.issuerLogo || "",
							issueDate: certification.issueDate
								? new Date(certification.issueDate).toISOString().split("T")[0]
								: "",
							expiryDate: certification.expiryDate
								? new Date(certification.expiryDate).toISOString().split("T")[0]
								: "",
							credentialId: certification.credentialId || "",
							credentialUrl: certification.credentialUrl || "",
							thumbnailUrl: certification.thumbnailUrl,
							description: certification.description,
							skills: certification.skills?.join(", ") || "",
						isEnterprise: Boolean(certification.isEnterprise),
							isPublished: Boolean(certification.isPublished),
							order: String(certification.order || 0),
						});
					} else {
						toast.error("Certification not found");
						navigate("/cms/certifications");
					}
				} catch (error) {
					console.error("Error fetching certification:", error);
					toast.error("Failed to load certification");
				} finally {
					setIsLoading(false);
				}
			}
		};

		fetchCertification();
	}, [id, form, navigate]);

	if (!user) {
		return <Navigate to="/auth" />;
	}

	const onSubmit = async (data: CertificationFormValues) => {
		setIsSubmitting(true);
		try {
			const skillsList = data.skills
				.split(",")
				.map((skill) => skill.trim())
				.filter((skill) => skill.length > 0);

			const issueDate = data.issueDate ? Timestamp.fromDate(new Date(data.issueDate)) : null;
			const expiryDate = data.expiryDate ? Timestamp.fromDate(new Date(data.expiryDate)) : null;

			if (isEditMode && id) {
				await certificationService.update(id, {
					title: data.title,
					issuer: data.issuer,
					issuerLogo: data.issuerLogo || "",
					issueDate,
					expiryDate: expiryDate || undefined,
					credentialId: data.credentialId || undefined,
					credentialUrl: data.credentialUrl || undefined,
					thumbnailUrl: data.thumbnailUrl,
					description: data.description,
					skills: skillsList,
				isEnterprise: data.isEnterprise,
					isPublished: data.isPublished,
					order: parseInt(data.order) || 0,
				});

				toast.success("Certification updated successfully!");
			} else {
				await certificationService.create({
					title: data.title,
					issuer: data.issuer,
					issuerLogo: data.issuerLogo || "",
					issueDate,
					expiryDate: expiryDate || undefined,
					credentialId: data.credentialId || undefined,
					credentialUrl: data.credentialUrl || undefined,
					thumbnailUrl: data.thumbnailUrl,
					description: data.description,
					skills: skillsList,
					isEnterprise: data.isEnterprise,
					isPublished: data.isPublished,
					order: parseInt(data.order) || 0,
					createdAt: Timestamp.now(),
					updatedAt: Timestamp.now(),
				});

				toast.success("Certification created successfully!");
			}

			queryClient.invalidateQueries({ queryKey: ["certifications"] });
			navigate("/cms/certifications");
		} catch (error) {
			console.error("Error saving certification:", error);
			toast.error("Failed to save certification. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isLoading) {
		return (
			<CmsLayout>
				<div className="flex items-center justify-center min-h-[60vh]">
					<Loader2 className="h-8 w-8 animate-spin text-primary" />
				</div>
			</CmsLayout>
		);
	}

	return (
		<CmsLayout>
			<div className="container max-w-5xl mx-auto px-4 py-8">
				<div className="mb-8">
					<h1 className="text-3xl font-bold mb-2">
						{isEditMode ? "Edit Certification" : "Add New Certification"}
					</h1>
					<p className="text-muted-foreground">
						{isEditMode
							? "Update certification details"
							: "Add a new professional certification or credential"}
					</p>
				</div>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						{/* Basic Information */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Award className="h-5 w-5" />
									Basic Information
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<FormField
									control={form.control}
									name="title"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Certification Title *</FormLabel>
											<FormControl>
												<Input
													placeholder="e.g., Microsoft Certified: Azure Fundamentals"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="issuer"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Issuer *</FormLabel>
												<FormControl>
													<Input placeholder="e.g., Microsoft" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="issuerLogo"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Issuer Logo URL</FormLabel>
												<FormControl>
													<Input
														placeholder="https://example.com/logo.svg"
														{...field}
													/>
												</FormControl>
												<FormDescription>Small logo of the issuing organization</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<FormField
									control={form.control}
									name="description"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Description *</FormLabel>
											<FormControl>
												<Textarea
													placeholder="Brief description of what this certification demonstrates..."
													className="min-h-24"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</CardContent>
						</Card>

						{/* Dates and Credentials */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Calendar className="h-5 w-5" />
									Dates & Credentials
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="issueDate"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Issue Date *</FormLabel>
												<FormControl>
													<Input type="date" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="expiryDate"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Expiry Date (Optional)</FormLabel>
												<FormControl>
													<Input type="date" {...field} />
												</FormControl>
												<FormDescription>Leave empty if no expiration</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="credentialId"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Credential ID (Optional)</FormLabel>
												<FormControl>
													<Input placeholder="e.g., AZ-900-12345678" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="credentialUrl"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Credential URL (Optional)</FormLabel>
												<FormControl>
													<Input placeholder="https://..." {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</CardContent>
						</Card>

						{/* Badge & Skills */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<ImageIcon className="h-5 w-5" />
									Badge & Skills
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<FormField
									control={form.control}
									name="thumbnailUrl"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Badge Image URL *</FormLabel>
											<FormControl>
												<Input
													placeholder="https://images.credly.com/..."
													{...field}
												/>
											</FormControl>
											<FormDescription>
												Full URL to the certification badge (use Credly for Microsoft certs)
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>

								{form.watch("thumbnailUrl") && (
									<div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/30">
										<img
											src={form.watch("thumbnailUrl")}
											alt="Badge preview"
											className="w-20 h-20 object-contain rounded-lg"
										/>
										<div className="text-sm text-muted-foreground">
											Badge preview
										</div>
									</div>
								)}

								<FormField
									control={form.control}
									name="skills"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Skills (Comma-separated)</FormLabel>
											<FormControl>
												<Input
													placeholder="e.g., Azure, Cloud Computing, DevOps"
													{...field}
												/>
											</FormControl>
											<FormDescription>
												Enter skills separated by commas
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							</CardContent>
						</Card>

						{/* Settings */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Shield className="h-5 w-5" />
									Settings
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<FormField
									control={form.control}
									name="order"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Display Order</FormLabel>
											<FormControl>
												<Input
													type="number"
													placeholder="0"
													{...field}
												/>
											</FormControl>
											<FormDescription>
												Lower numbers appear first (0 = highest priority)
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="isEnterprise"
									render={({ field }) => (
										<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
											<div className="space-y-0.5">
												<FormLabel className="text-base">Enterprise Certification</FormLabel>
												<FormDescription>
													Mark as a Enterprise certification (shows special badge)
												</FormDescription>
											</div>
											<FormControl>
												<Switch
													checked={field.value}
													onCheckedChange={field.onChange}
												/>
											</FormControl>
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="isPublished"
									render={({ field }) => (
										<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
											<div className="space-y-0.5">
												<FormLabel className="text-base">Publish</FormLabel>
												<FormDescription>
													Make this certification visible on the public page
												</FormDescription>
											</div>
											<FormControl>
												<Switch
													checked={field.value}
													onCheckedChange={field.onChange}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
							</CardContent>
							<CardFooter className="flex gap-4">
								<Button
									type="submit"
									disabled={isSubmitting}
									className="flex-1"
								>
									{isSubmitting ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											{isEditMode ? "Updating..." : "Creating..."}
										</>
									) : (
										<>
											<Save className="mr-2 h-4 w-4" />
											{isEditMode ? "Update Certification" : "Create Certification"}
										</>
									)}
								</Button>
								<Button
									type="button"
									variant="outline"
									onClick={() => navigate("/cms/certifications")}
									disabled={isSubmitting}
								>
									Cancel
								</Button>
							</CardFooter>
						</Card>
					</form>
				</Form>
			</div>
		</CmsLayout>
	);
};

export default FormCertification;
