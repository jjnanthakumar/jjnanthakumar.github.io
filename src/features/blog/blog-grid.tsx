import { BlogCard } from "@/components/cards/blog-card";
import { Button } from "@/components/ui/button";
import { Blog } from "@/services";
import { SearchIcon } from "lucide-react";

interface BlogGridProps {
	isLoading: boolean;
	paginatedBlogs: Blog[];
	filteredBlogs: Blog[];
	clearFilters: () => void;
}

const BlogGrid = ({ isLoading, paginatedBlogs, filteredBlogs, clearFilters }: BlogGridProps) => {
	if (isLoading) {
		return (
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={i} className="bg-muted/30 h-[400px] rounded-xl animate-pulse" />
				))}
			</div>
		);
	}

	if (paginatedBlogs.length > 0) {
		return (
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				{paginatedBlogs.map((blog, index) => (
					<BlogCard
						key={blog.id}
						blog={blog}
						className="animate-fade-in"
						style={{ animationDelay: `${index * 0.05}s` }}
					/>
				))}
			</div>
		);
	}

	return (
		<div className="text-center py-20 bg-background border border-border/40 rounded-2xl">
			<div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
				<SearchIcon size={24} className="text-muted-foreground" />
			</div>
			<h3 className="text-xl font-medium mb-2">No articles found</h3>
			<p className="text-muted-foreground max-w-md mx-auto mb-6">
				Try adjusting your search or filter criteria to find what you're looking for.
			</p>
			<Button variant="outline" size="sm" onClick={clearFilters} className="rounded-full px-4">
				Clear all filters
			</Button>
		</div>
	);
};

export default BlogGrid;
