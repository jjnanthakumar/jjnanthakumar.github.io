import clsx from "clsx";
import { Sparkles } from "lucide-react";

const BlogHeader = () => {
	return (
		<div className="text-center mb-16 space-y-4">
			<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium">
				<Sparkles size={16} />
				THOUGHTS & IDEAS
			</div>
			<h1 className="text-4xl md:text-5xl font-bold">My Blog</h1>
			<p className="text-muted-foreground text-lg max-w-2xl mx-auto">
				Explore my articles on web development, design trends, and technology insights.
			</p>
			<div className={clsx("h-1 w-16 bg-primary/80 rounded-full mx-auto")} />
		</div>
	);
};

export default BlogHeader;
