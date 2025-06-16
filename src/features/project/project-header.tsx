import clsx from "clsx";
import { Briefcase } from "lucide-react";

const ProjectHeader = () => {
	return (
		<div className="text-center mb-16 space-y-4">
			<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium">
				<Briefcase size={16} />
				RECENT WORK
			</div>
			<h1 className="text-4xl md:text-5xl font-bold">My Projects</h1>
			<p className="text-muted-foreground text-lg max-w-2xl mx-auto">
				Explore my portfolio of web applications, and other development projects.
			</p>
			<div className={clsx("h-1 w-16 bg-primary/80 rounded-full mx-auto")} />
		</div>
	);
};

export default ProjectHeader;
