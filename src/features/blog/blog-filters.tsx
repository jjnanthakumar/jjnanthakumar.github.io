
import React from "react";
import { SearchIcon, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface BlogFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
  allTags: string[];
}

const BlogFilters = ({
  searchTerm,
  setSearchTerm,
  selectedTag,
  setSelectedTag,
  allTags,
}: BlogFiltersProps) => {
  return (
    <div className="bg-background border border-border/40 rounded-2xl p-6 mb-12 shadow-sm">
      <div className="flex flex-col justify-between gap-6">
        <div className="relative w-full">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            <SearchIcon size={16} />
          </div>
          <Input
            placeholder="Search articles..."
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
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <div className="flex items-center mr-2 text-muted-foreground">
            <Filter size={16} className="mr-2" />
            <span className="text-sm font-medium">Filter:</span>
          </div>
          <Button
            variant={selectedTag === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTag(null)}
            className="rounded-full px-4"
          >
            All
          </Button>
          {allTags.map((tag) => (
            <Button
              key={tag}
              variant={selectedTag === tag ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              className="rounded-full px-4 group"
            >
              <span>{tag}</span>
              {selectedTag === tag && (
                <X size={14} className="ml-2 group-hover:text-red-500" />
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Active filters display */}
      {(searchTerm || selectedTag) && (
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
          {selectedTag && (
            <div className="bg-background border border-border/50 rounded-full px-3 py-1 text-xs flex items-center">
              <span className="font-medium mr-1">Tag:</span> {selectedTag}
              <button
                onClick={() => setSelectedTag(null)}
                className="ml-2 text-muted-foreground hover:text-red-500"
              >
                <X size={12} />
              </button>
            </div>
          )}
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedTag(null);
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

export default BlogFilters;
