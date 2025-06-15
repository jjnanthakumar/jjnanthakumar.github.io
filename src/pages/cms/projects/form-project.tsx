import { CmsLayout } from "@/components/layout/cms-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/auth-context";
import { calculateReadingTime } from "@/lib/mdx";
import { queryClient } from "@/lib/query-client";
import { projectService, TProjectResponse } from "@/services";
import { zodResolver } from "@hookform/resolvers/zod";
import { Timestamp } from "firebase/firestore";
import {
	ArrowRight,
	Briefcase,
	Check,
	Clock,
	Code,
	Github,
	Globe,
	Info,
	LinkIcon,
	Loader2,
	Save,
} from "lucide-react";
import { lazy, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

const MDXEditor = lazy(() => import(`@/components/mdx/mdx-editor`));

const projectSchema = z.object({
	title: z.string().min(5, { message: "Title must be at least 5 characters" }),
	summary: z.string().min(10, { message: "Summary must be at least 10 characters" }),
	description: z.string().min(50, { message: "Description must be at least 50 characters" }),
	technologies: z.string(),
	demoUrl: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
	repoUrl: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
	image: z.string().optional(),
	isPublished: z.boolean().default(false),
	isFeatured: z.boolean().default(false),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

const FormProject = () => {
	const { user } = useAuth();
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const isEditMode = Boolean(id);

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isLoading, setIsLoading] = useState(isEditMode);
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const [readingTime, setReadingTime] = useState(0);
	const [currentProject, setCurrentProject] = useState<TProjectResponse | null>(null);

	const form = useForm<ProjectFormValues>({
		resolver: zodResolver(projectSchema),
		defaultValues: {
			title: "",
			summary: "",
			description: "",
			technologies: "",
			demoUrl: "",
			repoUrl: "",
			isPublished: false,
			isFeatured: false,
		},
	});

	const descriptionValues = form.getValues("description");

	useEffect(() => {
		const fetchProject = async () => {
			if (id) {
				setIsLoading(true);
				try {
					const project = await projectService.getById(id);
					if (project) {
						setCurrentProject(project);
						form.reset({
							title: project.title,
							summary: project.summary,
							description: project.description,
							technologies: project.technologies.join(", "),
							demoUrl: project.demoUrl || "",
							repoUrl: project.repoUrl || "",
							isPublished: Boolean(project.isPublished),
							isFeatured: Boolean(project.isFeatured),
						});

						if (project.image) {
							setSelectedImage(project.image);
						}

						const time = calculateReadingTime(project.description);
						setReadingTime(time);
					} else {
						toast.error("Project not found");
						navigate("/cms/projects");
					}
				} catch (error) {
					console.error("Error fetching project:", error);
					toast.error("Failed to load project");
				} finally {
					setIsLoading(false);
				}
			}
		};

		fetchProject();
	}, [id, form, navigate]);

	useEffect(() => {
		const subscription = form.watch(value => {
			if (value.description) {
				const time = calculateReadingTime(value.description);
				setReadingTime(time);
			}
		});
		return () => subscription.unsubscribe();
	}, [form.watch]);

	if (!user) {
		return <Navigate to="/auth" />;
	}

	const createSlug = (title: string) => {
		return title
			.toLowerCase()
			.replace(/[^\w\s-]/g, "")
			.replace(/\s+/g, "-");
	};

	const onSubmit = async (data: ProjectFormValues) => {
		setIsSubmitting(true);
		try {
			const techList = data.technologies
				.split(",")
				.map(tech => tech.trim())
				.filter(tech => tech.length > 0);

			const imageUrl = data.image || currentProject?.image || "";
			const readingTime = calculateReadingTime(data.description);

			if (isEditMode && id) {
				await projectService.update(id, {
					title: data.title,
					summary: data.summary,
					description: data.description,
					image: imageUrl,
					technologies: techList,
					demoUrl: data.demoUrl || null,
					repoUrl: data.repoUrl || null,
					readingTime,
					isPublished: data.isPublished,
					isFeatured: data.isFeatured,
					...(data.isPublished && !currentProject?.publishedDate
						? { publishedDate: Timestamp.now() }
						: { publishedDate: null }),
				});

				toast.success("Project updated successfully!");
			} else {
				const slug = createSlug(data.title);

				await projectService.create({
					title: data.title,
					slug,
					summary: data.summary,
					description: data.description,
					image: imageUrl,
					isPublished: data.isPublished,
					isFeatured: data.isFeatured,
					publishedDate: data.isPublished ? Timestamp.now() : null,
					technologies: techList,
					demoUrl: data.demoUrl || null,
					repoUrl: data.repoUrl || null,
					views: 0,
					likes: 0,
					readingTime,
					authorId: user.uid,
					authorName: user.displayName || "Anonymous",
				});

				toast.success("Project created successfully!");
			}

			queryClient.invalidateQueries({ queryKey: ["projects", "latestProjects"] });
			navigate("/cms/projects");
		} catch (error) {
			console.error("Error saving project:", error);
			toast.error("Failed to save project. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isLoading) {
		return (
			<CmsLayout>
				<div className="flex items-center justify-center h-96">
					<Loader2 className="h-10 w-10 animate-spin text-primary" />
					<span className="ml-2 text-lg">Loading project...</span>
				</div>
			</CmsLayout>
		);
	}

	return (
		<CmsLayout>
			<div className="max-w-6xl mx-auto">
				<div className="flex flex-col md:flex-row items-center justify-between gap-2 md:gap-0 mb-6 sm:mb-8">
					<h1 className="text-3xl font-bold">{isEditMode ? "Edit Project" : "Add New Project"}</h1>
					<div className="flex items-center text-muted-foreground">
						<Clock className="h-4 w-4 mr-1.5" />
						<span className="text-sm">Estimated reading time: {readingTime} min</span>
					</div>
				</div>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
							<div className="lg:col-span-2">
								<Card className="border-x-0 border-b-0 sm:border-border/50 shadow-none sm:shadow-md rounded-none sm:rounded-xl overflow-hidden">
									<CardHeader className="bg-muted/30 border-b border-border/30 px-0 py-4 sm:p-6">
										<CardTitle className="flex items-center">
											<Briefcase className="h-5 w-5 mr-2 text-primary" />
											Project Content
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-6 px-0 py-4 sm:p-6">
										{/* Publication Status Toggle */}
										<FormField
											control={form.control}
											name="isPublished"
											render={({ field }) => (
												<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
													<div className="space-y-0.5">
														<FormLabel className="text-base">Publication Status</FormLabel>
														<div className="text-sm text-muted-foreground">
															{field.value
																? "Your project will be publicly visible"
																: "Your project will be saved as a draft"}
														</div>
													</div>
													<FormControl>
														<Switch checked={field.value} onCheckedChange={field.onChange} />
													</FormControl>
												</FormItem>
											)}
										/>

										{/* Featured Project Toggle */}
										<FormField
											control={form.control}
											name="isFeatured"
											render={({ field }) => (
												<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
													<div className="space-y-0.5">
														<FormLabel className="text-base">Featured Status</FormLabel>
														<div className="text-sm text-muted-foreground">
															{field.value
																? "This project will be featured on your portfolio"
																: "This project will not be featured"}
														</div>
													</div>
													<FormControl>
														<Switch checked={field.value} onCheckedChange={field.onChange} />
													</FormControl>
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="title"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-foreground/80 font-medium">
														Project Title
													</FormLabel>
													<FormControl>
														<Input
															placeholder="Enter project title"
															className="rounded-lg border-border/50 focus-visible:ring-primary/30"
															{...field}
														/>
													</FormControl>
													<FormMessage />
													<div className="text-xs text-muted-foreground mt-1">
														Slug: {form.watch("title") ? createSlug(form.watch("title")) : ""}
													</div>
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="summary"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-foreground/80 font-medium">Summary</FormLabel>
													<FormControl>
														<Textarea
															placeholder="Brief summary of your project"
															className="resize-none h-20 rounded-lg border-border/50 focus-visible:ring-primary/30"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="description"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-foreground/80 font-medium m-0">
														Description (MDX)
													</FormLabel>
													<FormControl>
														<MDXEditor
															initialCode={descriptionValues}
															onChange={code => field.onChange(code)}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</CardContent>
								</Card>
							</div>

							<div className="lg:col-span-1">
								<div className="space-y-6 sticky">
									<Card className="border-border/50 shadow-md rounded-xl overflow-hidden">
										<CardHeader className="bg-muted/30 border-b border-border/30">
											<CardTitle className="flex items-center">
												<Code className="h-5 w-5 mr-2 text-primary" />
												Project Details
											</CardTitle>
										</CardHeader>
										<CardContent className="space-y-6 p-6">
											<FormField
												control={form.control}
												name="technologies"
												render={({ field }) => (
													<FormItem>
														<FormLabel className="text-foreground/80 font-medium">
															Technologies
														</FormLabel>
														<FormControl>
															<Input
																placeholder="React, TypeScript, Firebase"
																className="rounded-lg border-border/50 focus-visible:ring-primary/30"
																{...field}
															/>
														</FormControl>
														<div className="text-xs text-muted-foreground mt-2 flex items-center">
															<Info className="h-3.5 w-3.5 mr-1.5" />
															Separate technologies with commas
														</div>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name="demoUrl"
												render={({ field }) => (
													<FormItem>
														<FormLabel className="text-foreground/80 font-medium">
															Demo URL
														</FormLabel>
														<FormControl>
															<div className="relative">
																<Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
																<Input
																	placeholder="https://your-project-demo.com"
																	className="pl-10 rounded-lg border-border/50 focus-visible:ring-primary/30"
																	{...field}
																/>
															</div>
														</FormControl>
														<div className="text-xs text-muted-foreground mt-2 flex items-center">
															<LinkIcon className="h-3.5 w-3.5 mr-1.5" />
															Optional: Link to live demo
														</div>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name="repoUrl"
												render={({ field }) => (
													<FormItem>
														<FormLabel className="text-foreground/80 font-medium">
															Repository URL
														</FormLabel>
														<FormControl>
															<div className="relative">
																<Github className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
																<Input
																	placeholder="https://github.com/yourusername/repo"
																	className="pl-10 rounded-lg border-border/50 focus-visible:ring-primary/30"
																	{...field}
																/>
															</div>
														</FormControl>
														<div className="text-xs text-muted-foreground mt-2 flex items-center">
															<Github className="h-3.5 w-3.5 mr-1.5" />
															Optional: Link to source code
														</div>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name="image"
												render={({ field: { value, onChange, ...fieldProps } }) => (
													<FormItem>
														<FormLabel className="text-foreground/80 font-medium">
															Project Image
														</FormLabel>
														<FormControl>
															<div className="space-y-3">
																<div className="relative">
																	<Input
																		placeholder="Enter image URL"
																		className="rounded-lg border-border/50 focus-visible:ring-primary/30"
																		value={selectedImage || ""}
																		onChange={e => {
																			setSelectedImage(e.target.value);
																			form.setValue("image", e.target.value);
																		}}
																	/>
																</div>
																{selectedImage && (
																	<div className="relative aspect-video rounded-lg overflow-hidden border border-border/50 bg-muted/30">
																		<img
																			src={selectedImage || "/placeholder.svg"}
																			alt="Preview"
																			className="w-full h-full object-cover"
																			onError={e => {
																				e.currentTarget.src = "/placeholder.svg";
																			}}
																		/>
																		<Button
																			type="button"
																			variant="destructive"
																			size="sm"
																			className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full"
																			onClick={() => {
																				setSelectedImage(null);
																				form.setValue("image", "");
																			}}
																		>
																			<span className="sr-only">Remove image</span>×
																		</Button>
																	</div>
																)}
																<p className="text-xs text-muted-foreground">
																	Recommended: 1200 × 630 pixels
																</p>
															</div>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</CardContent>
										<CardFooter className="px-6 py-4 bg-muted/20 border-t border-border/30">
											<Button
												type="submit"
												className="w-full rounded-lg group relative overflow-hidden"
												disabled={isSubmitting}
											>
												{isSubmitting ? (
													<>
														<Loader2 className="mr-2 h-4 w-4 animate-spin" />
														Saving...
													</>
												) : (
													<>
														<span className="flex items-center group-hover:-translate-x-1 transition-transform duration-300">
															{form.getValues("isPublished") ? (
																<>
																	<Check className="mr-2 h-4 w-4" />
																	Publish Project
																</>
															) : (
																<>
																	<Save className="mr-2 h-4 w-4" />
																	Save as Draft
																</>
															)}
														</span>
														<ArrowRight className="absolute right-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-4 transition-all duration-300" />
													</>
												)}
											</Button>
										</CardFooter>
									</Card>

									<Card className="border-border/50 shadow-md rounded-xl overflow-hidden">
										<CardHeader className="bg-muted/30 border-b border-border/30 py-3">
											<CardTitle className="text-sm flex items-center">
												<Info className="h-4 w-4 mr-2 text-primary" />
												Project Tips
											</CardTitle>
										</CardHeader>
										<CardContent className="p-4">
											<div className="text-xs space-y-2 text-muted-foreground">
												<p>
													<span className="font-semibold">Images:</span> Include screenshots or
													diagrams to showcase your project
												</p>
												<p>
													<span className="font-semibold">Technologies:</span> List all major
													technologies and tools used
												</p>
												<p>
													<span className="font-semibold">Features:</span> Highlight key features
													and functionality
												</p>
												<p>
													<span className="font-semibold">Challenges:</span> Mention challenges
													faced and how you solved them
												</p>
												<p>
													<span className="font-semibold">Future:</span> Include potential future
													improvements
												</p>
											</div>
										</CardContent>
									</Card>
								</div>
							</div>
						</div>
					</form>
				</Form>
			</div>
		</CmsLayout>
	);
};

export default FormProject;
