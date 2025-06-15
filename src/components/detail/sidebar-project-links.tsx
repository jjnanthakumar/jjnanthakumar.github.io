
import React from "react";
import { ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProjectLinksProps {
  demoUrl?: string;
  repoUrl?: string;
}

const SidebarProjectLinks = ({ demoUrl, repoUrl }: SidebarProjectLinksProps) => {
  if (!demoUrl && !repoUrl) return null;

  return (
    <div className="bg-primary/5 border border-primary/10 rounded-xl p-5">
      <h3 className="font-medium mb-3">Project Links</h3>
      <div className="space-y-3">
        {demoUrl && (
          <Button asChild className="w-full rounded-lg">
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              <ExternalLink size={16} />
              <span>View Live Demo</span>
            </a>
          </Button>
        )}
        {repoUrl && (
          <Button asChild variant="outline" className="w-full rounded-lg">
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              <Github size={16} />
              <span>View Source Code</span>
            </a>
          </Button>
        )}
      </div>
    </div>
  );
};

export default SidebarProjectLinks;
