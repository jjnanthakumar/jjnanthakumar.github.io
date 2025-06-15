import { formatDate } from "@/lib/utils";
import { Calendar, Clock, Eye } from "lucide-react";

interface ContentHeaderProps {
	title: string;
	tags?: string[];
	technologies?: string[];
	publishedDate: Date;
	views: number;
	readingTime: number | string;
}

const ContentHeader = ({
	title,
	tags,
	technologies,
	publishedDate,
	views,
	readingTime,
}: ContentHeaderProps) => {
	return (
		<header className="mb-8 animate-slide-up">
			{tags && tags.length > 0 && (
				<div className="flex flex-wrap items-center gap-2 mb-4">
					{tags.map((tag) => (
						<span
							key={tag}
							className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
						>
							{tag}
						</span>
					))}
				</div>
			)}
			<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 tracking-tight leading-tight">
				{title}
			</h1>
			<div className="flex flex-wrap items-center text-sm text-muted-foreground">
				<div className="flex items-center">
					<Calendar size={14} className="mr-1.5" />
					<time dateTime={formatDate(publishedDate)}>{formatDate(publishedDate)}</time>
				</div>
				<span className="mx-2">•</span>
				<div className="flex items-center">
					<Clock size={14} className="mr-1.5" />
					<span>{typeof readingTime === "number" ? `${readingTime} min read` : readingTime}</span>
				</div>
				<span className="mx-2">•</span>
				<div className="flex items-center">
					<Eye size={14} className="mr-1.5" />
					<span>{views} views</span>
				</div>
			</div>
			{technologies && technologies.length > 0 && (
				<div className="mt-6 flex flex-wrap gap-2">
					{technologies.map((tech) => (
						<span
							key={tech}
							className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
						>
							{tech}
						</span>
					))}
				</div>
			)}
		</header>
	);
};

export default ContentHeader;
