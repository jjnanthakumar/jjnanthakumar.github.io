import { TableOfContents } from "@/components/cards/table-of-contents";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { useReadingProgress } from "@/hooks/use-reading-progress";
import { useMutation, useQuery } from "@tanstack/react-query";
import { lazy, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";

// Import refactored components
import { SEO } from "@/components/common/seo";
import ContentHeader from "@/components/detail/content-header";
import ContentSkeleton from "@/components/detail/content-skeleton";
import FeaturedImage from "@/components/detail/featured-image";
import ProjectLinks from "@/components/detail/project-links";
import ReadingProgress from "@/components/detail/reading-progress";
import SidebarProjectLinks from "@/components/detail/sidebar-project-links";
import SocialShareBar from "@/components/detail/social-share-bar";
import { useScrollToHash } from "@/hooks/use-scroll-to-hash";
import { projectService } from "@/services";

const MDXPreview = lazy(() => import(`@/components/mdx/mdx-preview`));

const ProjectDetail = () => {
	const { slug } = useParams<{ slug: string }>();
	const navigate = useNavigate();
	const contentRef = useRef<HTMLDivElement>(null);
	const { scrollToHash } = useScrollToHash();
	const [isLiked, setIsLiked] = useState(false);

	// Use custom hooks
	const readingProgress = useReadingProgress(contentRef);

	const {
		data: project,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["project", slug],
		queryFn: () => projectService.getBySlug(slug || ""),
		enabled: !!slug,
	});

	const viewMutation = useMutation({
		mutationFn: () => projectService.incrementView(project?.id || ""),
		onError: (error) => {
			console.error("Failed to increment view count:", error);
		},
	});

	const likeMutation = useMutation({
		mutationFn: () => projectService.incrementLike(project?.id || ""),
		onSuccess: () => {
			setIsLiked(true);
			toast({
				title: "Thanks for your feedback!",
				description: "You liked this project.",
			});
		},
	});

	const handleLike = () => {
		if (project && !isLiked) {
			likeMutation.mutate();
		}
	};

	// Increment view count on component mount
	useEffect(() => {
		if (project) {
			viewMutation.mutate();
			setTimeout(scrollToHash, 100);
		}
	}, [project]);

	// Redirect if project not found
	useEffect(() => {
		if (isError) {
			console.error("Project not found:", error);
			navigate("/projects", { replace: true });
		}
	}, [isError, navigate]);

	if (isLoading) {
		return <ContentSkeleton />;
	}

	if (!project) return null;

	// Default reading time if not provided
	const readingTime = `${project.readingTime ?? 10} min read`;

	return (
		<>
			<SEO
				title={project.title}
				description={project.summary}
				image={project.image}
				type="website"
			/>
			<div className="py-10">
				<ReadingProgress value={readingProgress} />

				<div className="container max-w-6xl px-4">
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8">
						{/* Main Content */}
						<main className="lg:col-span-9">
							<article>
								<ContentHeader
									title={project.title}
									technologies={project.technologies}
									publishedDate={project.publishedDate}
									views={project.views}
									readingTime={readingTime}
								/>

								<FeaturedImage image={project.image} alt={project.title} />

								<ProjectLinks demoUrl={project.demoUrl} repoUrl={project.repoUrl} />

								<div className="prose prose-lg max-w-none mb-8 animate-fade-in">
									<p className="text-xl text-muted-foreground leading-relaxed border-l-4 border-primary/50 pl-4 italic">
										{project.summary}
									</p>
									<TableOfContents
										containerRef={contentRef}
										className="block lg:hidden my-8 bg-muted/20 rounded-xl border border-border/40"
									/>
									<Separator className="my-8" />
								</div>

								<MDXPreview code={project.description} innerRef={contentRef} />

								<SocialShareBar
									id={project.id}
									likes={project.likes}
									isLiked={isLiked}
									onLike={handleLike}
									contentType="project"
								/>
							</article>
						</main>

						{/* Sidebar */}
						<aside className="hidden lg:block lg:col-span-3">
							<div className="sticky top-20 space-y-8">
								<TableOfContents
									containerRef={contentRef}
									className="bg-background border border-border/40 rounded-xl shadow-sm"
								/>

								<SidebarProjectLinks demoUrl={project.demoUrl} repoUrl={project.repoUrl} />
							</div>
						</aside>
					</div>
				</div>
			</div>
		</>
	);
};

export default ProjectDetail;
