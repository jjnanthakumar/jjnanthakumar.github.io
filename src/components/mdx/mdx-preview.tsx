"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { AlertCircle, AlertTriangle, CheckCircle, ExternalLink, Info } from "lucide-react";
import React, { useMemo } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import rehypeReact from "rehype-react";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import CodeBlock from "./code-block";
import ImageWithPreviewAndCaption from "./image-with-preview-and-caption";

interface MDXPreviewProps {
	code: string;
	innerRef?: React.Ref<HTMLDivElement>;
	isLoading?: boolean;
}

// Custom Callout component
const Callout = ({
	children,
	type = "info",
	...props
}: React.HTMLAttributes<HTMLDivElement> & {
	type?: "info" | "warning" | "error" | "success";
}) => {
	const icons = {
		info: <Info className="h-5 w-5 text-blue-500 flex-shrink-0" />,
		warning: <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />,
		error: <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />,
		success: <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />,
	};

	const styles = {
		info: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800",
		warning: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800",
		error: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800",
		success: "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800",
	};

	return (
		<div className={cn("flex p-4 rounded-lg border my-6", styles[type])} {...props}>
			<div className="mr-3 mt-1">{icons[type]}</div>
			<div>{children}</div>
		</div>
	);
};

const components = {
	h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
		<h1
			{...props}
			className="text-3xl font-bold mt-10 mb-4 pb-2 border-b border-border/50 scroll-m-20"
			id={props.id || props.children?.toString().toLowerCase().replace(/\s+/g, "-")}
		/>
	),
	h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
		<h2
			{...props}
			className="text-2xl font-bold mt-8 mb-3 pb-1 scroll-m-20"
			id={props.id || props.children?.toString().toLowerCase().replace(/\s+/g, "-")}
		/>
	),
	h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
		<h3
			{...props}
			className="text-xl font-bold mt-6 mb-2 scroll-m-20"
			id={props.id || props.children?.toString().toLowerCase().replace(/\s+/g, "-")}
		/>
	),
	h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
		<h4
			{...props}
			className="text-lg font-bold mt-4 mb-2 scroll-m-20"
			id={props.id || props.children?.toString().toLowerCase().replace(/\s+/g, "-")}
		/>
	),
	p: (props: React.HTMLAttributes<HTMLParagraphElement>) => {
		const children = React.Children.toArray(props.children);

		if (
			children.length === 1 &&
			React.isValidElement(children[0]) &&
			children[0].key.includes("img")
		) {
			return children[0];
		}

		return <p {...props} className="my-4 leading-7" />;
	},

	ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
		<ul {...props} className="list-disc pl-6 my-4 space-y-2" />
	),
	ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
		<ol {...props} className="list-decimal pl-6 my-4 space-y-2" />
	),
	li: (props: React.HTMLAttributes<HTMLLIElement>) => <li {...props} className="mb-1" />,
	blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
		<blockquote
			{...props}
			className="border-l-4 border-primary/50 pl-4 my-6 italic text-muted-foreground"
		/>
	),
	a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
		const isExternal = props.href?.startsWith("http");
		return (
			<a
				{...props}
				className="text-primary hover:underline inline-flex items-center gap-1 font-medium"
				target={isExternal ? "_blank" : undefined}
				rel={isExternal ? "noopener noreferrer" : undefined}
			>
				{props.children}
				{isExternal && <ExternalLink className="h-3 w-3" />}
			</a>
		);
	},
	code: (props: React.HTMLAttributes<HTMLElement>) => {
		if (typeof props.className === "undefined") {
			return (
				<code
					{...props}
					className="bg-muted rounded px-1.5 py-0.5 font-mono text-sm border border-border/50"
				/>
			);
		}
		return (
			<code
				{...props}
				className="block overflow-x-auto p-4 rounded-md bg-muted font-mono text-sm"
			/>
		);
	},
	pre: (props: TAny) => {
		// Check if this is a code block with language class
		const className = props.children?.props?.className || "";
		const match = /language-(\w+)/.exec(className);
		const language = match ? match[1] : "text";
		const children = props.children?.props?.children;

		// Extract metadata from the first line if it's in a special format
		let filename = undefined;
		let codeContent = props.children?.props?.children;

		// Check if the first line contains metadata in format: // filename: example.js theme: dark
		if (children.startsWith("// metadata:")) {
			const lines = children.split("\n");
			const metadataLine = lines[0].substring("// metadata:".length);

			// Parse metadata
			if (metadataLine.includes("filename:")) {
				const filenameMatch = metadataLine.match(/filename:\s*([^\s]+)/);
				if (filenameMatch) filename = filenameMatch[1];
			}

			// Remove the metadata line from the code
			codeContent = lines.slice(1).join("\n");
		}

		return (
			<CodeBlock data-language={language} filename={filename}>
				{codeContent}
			</CodeBlock>
		);
	},
	img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
		<ImageWithPreviewAndCaption {...props} />
	),
	table: (props: React.TableHTMLAttributes<HTMLTableElement>) => (
		<div className="overflow-x-auto my-6 rounded-lg border border-border/50">
			<table {...props} className="min-w-full divide-y divide-border" />
		</div>
	),
	thead: (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
		<thead {...props} className="bg-muted" />
	),
	tbody: (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
		<tbody {...props} className="divide-y divide-border" />
	),
	tr: (props: React.HTMLAttributes<HTMLTableRowElement>) => (
		<tr {...props} className="hover:bg-muted/50 transition-colors" />
	),
	th: (props: React.ThHTMLAttributes<HTMLTableCellElement>) => (
		<th {...props} className="px-4 py-3 text-left text-sm font-medium" />
	),
	td: (props: React.TdHTMLAttributes<HTMLTableCellElement>) => (
		<td {...props} className="px-4 py-3 text-sm" />
	),
	hr: (props: React.HTMLAttributes<HTMLHRElement>) => (
		<hr {...props} className="my-8 border-t border-border" />
	),
	// Custom components
	Callout: (props: TAny) => <Callout {...props} />,
	InfoCallout: (props: TAny) => <Callout type="info" {...props} />,
	WarningCallout: (props: TAny) => <Callout type="warning" {...props} />,
	ErrorCallout: (props: TAny) => <Callout type="error" {...props} />,
	SuccessCallout: (props: TAny) => <Callout type="success" {...props} />,
};

const MDXPreview = ({ code, innerRef, isLoading = false }: MDXPreviewProps) => {
	const Content = useMemo(() => {
		if (isLoading) {
			return () => (
				<div className="space-y-4">
					<Skeleton className="h-8 w-3/4" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-2/3" />
					<Skeleton className="h-32 w-full" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-5/6" />
				</div>
			);
		}

		if (!code) return () => null;

		try {
			const processor = unified()
				.use(remarkParse)
				.use(remarkMdx)
				.use(remarkRehype)
				.use(rehypeSanitize)
				.use(rehypeStringify)
				// @ts-expect-error will be fix later
				.use(rehypeReact, {
					createElement: React.createElement,
					Fragment: React.Fragment,
					jsx,
					jsxs,
					components,
				});

			const file = processor.processSync(code);
			return () => <>{file.result}</>;
		} catch (err) {
			console.error("Error parsing MDX:", err);
			return () => (
				<div className="p-6 border border-red-300 bg-red-50 dark:bg-red-950/30 dark:border-red-800 rounded-lg my-4">
					<div className="flex items-start">
						<AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
						<div>
							<h3 className="text-lg font-medium text-red-800 dark:text-red-300">
								Failed to render content
							</h3>
							<p className="text-red-700 dark:text-red-400 mt-1">{String(err)}</p>
							<details className="mt-3">
								<summary className="text-sm cursor-pointer text-red-600 dark:text-red-400 hover:underline">
									View source
								</summary>
								<pre className="mt-2 p-3 bg-white dark:bg-black/30 border border-red-200 dark:border-red-800 rounded-md text-xs overflow-auto max-h-[300px]">
									{code
										? typeof code === "string"
											? code.substring(0, 500) + (code.length > 500 ? "..." : "")
											: "Non-string content"
										: "No content provided"}
								</pre>
							</details>
						</div>
					</div>
				</div>
			);
		}
	}, [code, isLoading]);

	return (
		<div
			ref={innerRef}
			className={cn(
				"prose prose-sm md:prose-base dark:prose-invert max-w-none",
				"prose-headings:scroll-m-20 prose-headings:font-semibold",
				"prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
				"prose-code:bg-muted prose-code:rounded prose-code:px-1 prose-code:py-0.5 prose-code:font-mono prose-code:text-sm",
				"prose-pre:bg-muted prose-pre:rounded-lg prose-pre:border prose-pre:border-border/50",
				"prose-img:rounded-lg prose-img:border prose-img:border-border/50 prose-img:shadow-sm",
				"prose-blockquote:border-l-4 prose-blockquote:border-primary/50 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground",
				"prose-li:marker:text-muted-foreground"
			)}
		>
			<Content />
		</div>
	);
};

export default MDXPreview;
