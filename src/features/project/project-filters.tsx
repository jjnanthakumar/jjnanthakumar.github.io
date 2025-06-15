import { Button } from "@/components/ui/button";
import { Code, X } from "lucide-react";

interface ProjectFiltersProps {
	searchTerm: string;
	setSearchTerm: (term: string) => void;
	selectedTech: string | null;
	setSelectedTech: (tech: string | null) => void;
	allTechnologies: string[];
}

const ProjectFilters = ({
	searchTerm,
	setSearchTerm,
	selectedTech,
	setSelectedTech,
	allTechnologies,
}: ProjectFiltersProps) => {
	return (
		<div className="bg-background border border-border/40 rounded-2xl p-6 mb-12 shadow-sm">
			<div className="flex flex-col justify-between gap-6">
				{/* <div className="relative w-full">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            <Search size={16} />
          </div>
          <Input
            placeholder="Search projects..."
            className="pl-10 rounded-xl border-border/50 focus-visible:ring-primary/30 bg-background/80"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X size={16} />
            </button>
          )}
        </div> */}

				<div className="flex items-center flex-wrap gap-2">
					<div className="flex items-center mr-2 text-muted-foreground">
						<Code size={16} className="mr-2" />
						<span className="text-sm font-medium">Technology:</span>
					</div>
					<Button
						variant={selectedTech === null ? "default" : "outline"}
						size="sm"
						onClick={() => setSelectedTech(null)}
						className="rounded-full px-4"
					>
						All
					</Button>
					{allTechnologies.map((tech) => (
						<Button
							key={tech}
							variant={selectedTech === tech ? "default" : "outline"}
							size="sm"
							onClick={() => setSelectedTech(tech === selectedTech ? null : tech)}
							className="rounded-full px-4 group"
						>
							<span>{tech}</span>
							{selectedTech === tech && <X size={14} className="ml-2 group-hover:text-red-500" />}
						</Button>
					))}
				</div>
			</div>

			{/* Active filters display */}
			{(searchTerm || selectedTech) && (
				<div className="mt-4 pt-4 border-t border-border/40 flex items-center flex-wrap gap-2">
					<span className="text-sm text-muted-foreground">Active filters:</span>
					{searchTerm && (
						<div className="bg-background border border-border/50 rounded-full px-3 py-1 text-xs flex items-center">
							<span className="font-medium mr-1">Search:</span> "{searchTerm}"
							<button
								onClick={() => setSearchTerm("")}
								className="ml-2 text-muted-foreground hover:text-red-500"
							>
								<X size={12} />
							</button>
						</div>
					)}
					{selectedTech && (
						<div className="bg-background border border-border/50 rounded-full px-3 py-1 text-xs flex items-center">
							<span className="font-medium mr-1">Technology:</span> {selectedTech}
							<button
								onClick={() => setSelectedTech(null)}
								className="ml-2 text-muted-foreground hover:text-red-500"
							>
								<X size={12} />
							</button>
						</div>
					)}
					<button
						onClick={() => {
							setSearchTerm("");
							setSelectedTech(null);
						}}
						className="text-xs text-primary hover:underline ml-2"
					>
						Clear all
					</button>
				</div>
			)}
		</div>
	);
};

export default ProjectFilters;
