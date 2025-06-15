"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useMDXPreview } from "@/hooks/use-mdx-preview";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Code, Copy, Eye } from "lucide-react";
import type React from "react";
import { useState } from "react";
import MDXPreview from "./mdx-preview";

interface MDXEditorProps {
	initialCode?: string;
	height?: string;
	onChange?: (code: string) => void;
}

const MDXEditor: React.FC<MDXEditorProps> = ({ initialCode = "", height = "500px", onChange }) => {
	const { code, setCode, parsedCode, isLoading } = useMDXPreview({
		initialCode,
	});
	const [activeTab, setActiveTab] = useState<string>("edit");
	const [copied, setCopied] = useState(false);

	// Handle copy to clipboard
	const handleCopy = () => {
		navigator.clipboard.writeText(code);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="border rounded-lg shadow-sm overflow-hidden">
			<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
				<div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b">
					<TabsList className="grid w-[200px] grid-cols-2">
						<TabsTrigger value="edit" className="flex items-center gap-1.5">
							<Code className="h-4 w-4" />
							<span>Edit</span>
						</TabsTrigger>
						<TabsTrigger value="preview" className="flex items-center gap-1.5">
							<Eye className="h-4 w-4" />
							<span>Preview</span>
						</TabsTrigger>
					</TabsList>

					<div className="flex items-center gap-2">
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
				</div>

				<TabsContent value="edit" className="m-0">
					<Textarea
						value={code}
						onChange={(e) => {
							setCode(e.target.value);
							onChange?.(e.target.value);
						}}
						placeholder="Write your MDX content here..."
						className="font-mono text-sm border-0 rounded-none focus-visible:ring-0 resize-none"
						style={{ height }}
					/>
				</TabsContent>

				<TabsContent value="preview" className="m-0 p-6 overflow-auto" style={{ height }}>
					<MDXPreview code={parsedCode} isLoading={isLoading} />
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default MDXEditor;
