interface ProjectResultsInfoProps {
	filteredProjects: TAny[];
	paginatedProjects: TAny[];
	isLoading: boolean;
	currentPage: number;
	totalPages: number;
}

const ProjectResultsInfo = ({
	filteredProjects,
	paginatedProjects,
	isLoading,
	currentPage,
	totalPages,
}: ProjectResultsInfoProps) => {
	if (isLoading) return null;

	return (
		<div className="mb-8 text-muted-foreground flex justify-between items-center">
			<p>
				Showing {filteredProjects.length > 0 ? 1 : 0}
				{paginatedProjects.length > 0 ? `-${paginatedProjects.length + 1}` : ""} of{" "}
				{filteredProjects.length} projects
			</p>
			{totalPages > 1 && (
				<div className="text-sm">
					Page {currentPage} of {totalPages}
				</div>
			)}
		</div>
	);
};

export default ProjectResultsInfo;
