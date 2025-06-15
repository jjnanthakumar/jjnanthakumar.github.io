import { ProjectCard } from "@/components/cards/project-card";
import { Button } from "@/components/ui/button";
import { Project } from "@/services";
import { Search } from "lucide-react";

interface ProjectGridProps {
	isLoading: boolean;
	paginatedProjects: Project[];
	filteredProjects: Project[];
	clearFilters: () => void;
}

const ProjectGrid = ({
	isLoading,
	paginatedProjects,
	filteredProjects,
	clearFilters,
}: ProjectGridProps) => {
	if (isLoading) {
		return (
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={i} className="bg-muted/30 h-[400px] rounded-xl animate-pulse" />
				))}
			</div>
		);
	}

	if (paginatedProjects.length > 0) {
		return (
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				{paginatedProjects.map((project, index) => (
					<ProjectCard
						key={project.id}
						project={project}
						className="animate-fade-in"
						style={{ animationDelay: `${index * 0.05}s` }}
					/>
				))}
			</div>
		);
	}

	if (filteredProjects.length === 0) {
		return (
			<div className="text-center py-20 bg-background border border-border/40 rounded-2xl">
				<div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
					<Search size={24} className="text-muted-foreground" />
				</div>
				<h3 className="text-xl font-medium mb-2">No projects found</h3>
				<p className="text-muted-foreground max-w-md mx-auto mb-6">
					Try adjusting your search or filter criteria to find what you're looking for.
				</p>
				<Button variant="outline" size="sm" onClick={clearFilters} className="rounded-full px-4">
					Clear all filters
				</Button>
			</div>
		);
	}

	return null;
};

export default ProjectGrid;
