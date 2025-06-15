
import React from "react";

interface BlogResultsInfoProps {
  currentPage: number;
  itemsPerPage: number;
  filteredCount: number;
  totalPages: number;
  isLoading: boolean;
}

const BlogResultsInfo = ({
  currentPage,
  itemsPerPage,
  filteredCount,
  totalPages,
  isLoading,
}: BlogResultsInfoProps) => {
  if (isLoading) return null;

  const startItem = Math.min(
    filteredCount,
    (currentPage - 1) * itemsPerPage + 1
  );
  const endItem = Math.min(filteredCount, currentPage * itemsPerPage);

  return (
    <div className="mb-8 text-muted-foreground flex justify-between items-center">
      <p>
        Showing {filteredCount > 0 ? `${startItem}-${endItem}` : "0"} of{" "}
        {filteredCount} articles
      </p>
      {totalPages > 1 && (
        <div className="text-sm">
          Page {currentPage} of {totalPages}
        </div>
      )}
    </div>
  );
};

export default BlogResultsInfo;
