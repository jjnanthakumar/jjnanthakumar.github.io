const ContentSkeleton = () => {
	return (
		<div className="container py-10 mx-auto">
			<div className="space-y-4">
				<div className="h-10 bg-primary/10 dark:bg-muted/50 rounded-xl animate-pulse w-3/4" />
				<div className="h-6 bg-primary/10 dark:bg-muted/50 rounded-xl animate-pulse w-1/3" />
				<div className="h-[200px] md:h-[400px] bg-primary/10 dark:bg-muted/50 rounded-xl animate-pulse mt-8" />
				{Array.from({ length: 2 }).map((_, i) => (
					<div key={i} className="space-y-4">
						<div className="h-4 bg-primary/10 dark:bg-muted/50 rounded-xl animate-pulse w-full mt-8" />
						<div className="h-4 bg-primary/10 dark:bg-muted/50 rounded-xl animate-pulse w-full" />
						<div className="h-4 bg-primary/10 dark:bg-muted/50 rounded-xl animate-pulse w-3/4" />
					</div>
				))}
			</div>
		</div>
	);
};

export default ContentSkeleton;
