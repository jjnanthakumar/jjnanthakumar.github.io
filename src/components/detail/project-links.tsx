
import React from "react";
import { ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectLinksProps {
  demoUrl?: string;
  repoUrl?: string;
}

const ProjectLinks = ({ demoUrl, repoUrl }: ProjectLinksProps) => {
  if (!demoUrl && !repoUrl) return null;

  return (
    <div className="mb-8 flex flex-wrap gap-4 animate-fade-in">
      {demoUrl && (
        <Button asChild size="lg" className="rounded-full group">
          <a
            href={demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <ExternalLink size={18} className="group-hover:animate-pulse" />
            <span>Live Demo</span>
          </a>
        </Button>
      )}

      {repoUrl && (
        <Button
          asChild
          variant="outline"
          size="lg"
          className="rounded-full group"
        >
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <Github
              size={18}
              className="group-hover:rotate-12 transition-transform"
            />
            <span>View Code</span>
          </a>
        </Button>
      )}
    </div>
  );
};

export default ProjectLinks;
