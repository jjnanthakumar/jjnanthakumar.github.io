"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Check, CodeIcon, Copy } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";

// Import Prism.js for syntax highlighting - simplified imports
import Prism from "prismjs";
// Import Prism core first
import "prismjs/prism";
// Then import only the most common languages to avoid conflicts
import "prism-themes/themes/prism-material-oceanic.css";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-json";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-scss";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-yaml";

interface CodeBlockProps extends React.HTMLAttributes<HTMLElement> {
	"data-language"?: string;
	filename?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ children, filename, ...props }) => {
	const [copied, setCopied] = useState(false);
	const language = props["data-language"] || "text";

	// Extract code content
	const code = React.Children.toArray(children)
		.map((child: TAny) => (typeof child === "string" ? child : child?.props?.children || ""))
		.join("");

	// Handle copy to clipboard
	const handleCopy = () => {
		navigator.clipboard.writeText(code);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	// Apply syntax highlighting when component mounts or code changes
	useEffect(() => {
		// Safer approach to highlighting with better error handling
		const highlightCode = () => {
			try {
				if (typeof window !== "undefined" && Prism && code) {
					// Give the DOM time to render
					const timer = setTimeout(() => {
						const elements = document.querySelectorAll("pre code");
						elements.forEach((element) => {
							if (element.textContent) {
								Prism.highlightElement(element);
							}
						});
					}, 100);
					return () => clearTimeout(timer);
				}
			} catch (error) {
				console.error("Prism highlighting error:", error);
			}
		};

		highlightCode();
	}, [code, language]);

	// Get language display name
	const getLanguageDisplayName = (lang: string) => {
		const languageMap: Record<string, string> = {
			js: "JavaScript",
			jsx: "React JSX",
			ts: "TypeScript",
			tsx: "React TSX",
			html: "HTML",
			css: "CSS",
			scss: "SCSS",
			json: "JSON",
			md: "Markdown",
			bash: "Bash",
			yaml: "YAML",
			text: "Plain Text",
		};

		return languageMap[lang] || lang.toUpperCase();
	};

	return (
		<div className="relative group my-6 text-sm font-mono rounded-lg overflow-hidden border border-border/50 bg-muted/50 shadow-sm">
			{/* Header with language and filename */}
			<div className="flex items-center justify-between px-4 py-2 bg-muted/80 border-b border-border/50 text-xs text-muted-foreground">
				<div className="flex items-center gap-2">
					<CodeIcon size={14} />
					<span>{getLanguageDisplayName(language)}</span>
					{filename && (
						<>
							<span className="opacity-50 mx-1">|</span>
							<span className="font-medium">{filename}</span>
						</>
					)}
				</div>

				{/* Copy button */}
				<Button
					variant="outline"
					size="sm"
					onClick={handleCopy}
					className={cn("h-8 gap-1.5", copied ? "text-green-500" : "text-muted-foreground")}
					aria-label={copied ? "Copied!" : "Copy code"}
					type="button"
				>
					<AnimatePresence mode="wait" initial={false}>
						<motion.span
							key={copied ? "check" : "copy"}
							initial={{ opacity: 0, y: 5 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -5 }}
							transition={{ duration: 0.15 }}
							className="flex items-center gap-1"
						>
							{copied ? (
								<>
									<Check size={14} />
									<span>Copied!</span>
								</>
							) : (
								<>
									<Copy size={14} />
									<span>Copy</span>
								</>
							)}
						</motion.span>
					</AnimatePresence>
				</Button>
			</div>

			{/* Code content */}
			<div className="relative overflow-auto">
				<pre
					{...props}
					className={cn(
						"p-0 !m-0 text-sm leading-relaxed !rounded-t-none",
						"scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent",
						"!bg-[#0E172B]",
					)}
				>
					<code className={`language-${language} block p-4 !bg-[#0E172B]`}>{children}</code>
				</pre>
			</div>
		</div>
	);
};

export default CodeBlock;
