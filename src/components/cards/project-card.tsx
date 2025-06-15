import { Button } from "@/components/ui/button";
import { cn, formatDate } from "@/lib/utils";
import { Project } from "@/services";
import { ArrowRight, Calendar, Clock, ExternalLink, Eye, Github } from "lucide-react";
import React from "react";
import { Link } from "react-router";
import Chip from "../ui/chip";

interface ProjectCardProps {
	project: Project;
	variant?: "default" | "featured";
	className?: string;
	style?: React.CSSProperties;
}

const ProjectCard = React.memo(
	({ project, className, variant, style }: ProjectCardProps) => {
		const isFeatured = variant === "featured";
		const readingTime = project.readingTime || "10 min read";

		return (
			<div
				className={cn(
					"group overflow-hidden rounded-lg bg-card border border-border/40 flex flex-col card-hover h-full transition-all duration-300 hover:shadow-md hover:border-primary/40",
					isFeatured && "md:flex-row",
					className
				)}
				style={style}
			>
				<Link
					to={`/projects/${project.slug}`}
					className={cn(
						"relative aspect-video overflow-hidden bg-muted",
						isFeatured ? "md:w-1/2" : "w-full"
					)}
				>
					<img
						src={project.image || "/placeholder.svg"}
						alt={project.title}
						className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
				</Link>

				<div className={cn("flex flex-col p-5 h-full max-h-64", isFeatured && "md:w-1/2 md:p-6")}>
					<div className="flex flex-wrap items-center text-xs text-muted-foreground mb-3 gap-y-2">
						<div className="flex items-center">
							<Calendar size={14} className="mr-1" />
							<time dateTime={project.publishedDate.toString()}>
								{formatDate(project.publishedDate)}
							</time>
						</div>

						<span className="mx-2">•</span>

						<div className="flex items-center">
							<Clock size={14} className="mr-1" />
							<span>{readingTime}</span>
						</div>

						<span className="mx-2">•</span>

						<div className="flex items-center">
							<Eye size={14} className="mr-1" />
							<span>{project.views} views</span>
						</div>
					</div>

					<Link to={`/projects/${project.slug}`}>
						<h3
							className={cn(
								"font-bold group-hover:text-primary transition-colors duration-300",
								isFeatured ? "text-2xl mb-3" : "text-lg mb-2"
							)}
						>
							{project.title}
						</h3>
					</Link>

					<p className="text-muted-foreground text-sm line-clamp-2 mb-4 leading-relaxed">
						{project.summary}
					</p>

					<div className="flex flex-wrap gap-2">
						{project.technologies.slice(0, 4).map(tech => (
							<Chip
								key={tech}
								className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
							>
								{tech}
							</Chip>
						))}
						{project.technologies.length > 4 && <Chip>+{project.technologies.length - 4}</Chip>}
					</div>

					<div className="mt-auto flex items-center justify-between pt-4">
						<div className="flex items-center gap-3">
							{project.demoUrl && (
								<a
									href={project.demoUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="text-sm text-foreground flex items-center hover:underline transition-all duration-200 hover:translate-y-[-1px]"
									onClick={e => e.stopPropagation()}
									aria-label={`View live demo for ${project.title}`}
								>
									<ExternalLink size={14} className="mr-1" />
									Demo
								</a>
							)}

							{project.repoUrl && (
								<a
									href={project.repoUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="text-sm text-foreground flex items-center hover:underline transition-all duration-200 hover:translate-y-[-1px]"
									onClick={e => e.stopPropagation()}
									aria-label={`View source code for ${project.title}`}
								>
									<Github size={14} className="mr-1" />
									Code
								</a>
							)}
						</div>

						<Button
							variant="ghost"
							size="sm"
							className="p-0 h-auto text-primary font-medium hover:bg-transparent hover:text-primary/80 group-hover:translate-x-1 transition-transform"
							asChild
						>
							<Link to={`/projects/${project.slug}`}>
								View Project
								<ArrowRight size={14} className="ml-1" />
							</Link>
						</Button>
					</div>
				</div>
			</div>
		);
	},
	(prevProps, nextProps) => {
		// Custom comparison function
		return (
			prevProps.project.id === nextProps.project.id &&
			prevProps.project.updatedAt === nextProps.project.updatedAt
		);
	}
);

export { ProjectCard };
