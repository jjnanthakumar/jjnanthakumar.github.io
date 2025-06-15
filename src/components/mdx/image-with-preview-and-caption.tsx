"use client";

import { cn } from "@/lib/utils";
import React, { useState } from "react";

interface ImageWithPreviewAndCaptionProps extends React.ImgHTMLAttributes<HTMLImageElement> {
	caption?: string;
}

const ImageWithPreviewAndCaption: React.FC<ImageWithPreviewAndCaptionProps> = ({
	alt,
	className,
	...props
}) => {
	const [open, setOpen] = useState(false);

	return (
		<figure className="my-6 text-center">
			<img
				{...props}
				alt={alt || ""}
				loading="lazy"
				onClick={() => setOpen(true)}
				className={cn(
					"cursor-zoom-in max-w-full h-auto mx-auto rounded-lg border border-border/50 shadow-sm transition hover:opacity-90",
					className
				)}
			/>
			{alt && <figcaption className="mt-2 text-sm text-muted-foreground italic">{alt}</figcaption>}

			{open && (
				<div
					className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center cursor-zoom-out"
					onClick={() => setOpen(false)}
				>
					<img
						src={props.src}
						alt={alt || ""}
						className="w-full max-w-[90vw] max-h-[90vh] rounded-lg shadow-lg"
					/>
				</div>
			)}
		</figure>
	);
};

export default ImageWithPreviewAndCaption;
