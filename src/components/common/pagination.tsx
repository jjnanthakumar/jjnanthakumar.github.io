import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	pageNumbers: (number | string)[];
	setCurrentPage: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, pageNumbers, setCurrentPage }: PaginationProps) => {
	if (totalPages <= 1) return null;

	return (
		<div className="mt-12 flex justify-center">
			<div className="flex items-center gap-2">
				<Button
					variant="outline"
					size="icon"
					className="h-9 w-9 rounded-full"
					onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
					disabled={currentPage === 1}
				>
					<ChevronLeft size={16} />
					<span className="sr-only">Previous page</span>
				</Button>

				{pageNumbers.map((page, index) =>
					page === "ellipsis" ? (
						<span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
							...
						</span>
					) : (
						<Button
							key={page}
							variant={currentPage === page ? "default" : "outline"}
							size="sm"
							className={cn("h-9 w-9 rounded-full", currentPage === page && "pointer-events-none")}
							onClick={() => setCurrentPage(page as number)}
						>
							{page}
						</Button>
					),
				)}

				<Button
					variant="outline"
					size="icon"
					className="h-9 w-9 rounded-full"
					onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
					disabled={currentPage === totalPages}
				>
					<ChevronRight size={16} />
					<span className="sr-only">Next page</span>
				</Button>
			</div>
		</div>
	);
};

export default Pagination;
