
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { animated, useSpring } from "@react-spring/web";
import { Check, Loader2, X, ZoomIn, ZoomOut } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface ImageCropperProps {
	imageFile: File | null;
	open: boolean;
	onClose: () => void;
	onCropComplete: (croppedBlob: Blob) => void;
}

const ImageCropper = ({ imageFile, open, onClose, onCropComplete }: ImageCropperProps) => {
	const [zoom, setZoom] = useState([1]);
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [isDragging, setIsDragging] = useState(false);
	const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
	const [imageLoaded, setImageLoaded] = useState(false);
	const [processing, setProcessing] = useState(false);
	const [naturalDimensions, setNaturalDimensions] = useState({ width: 0, height: 0 });

	// Add spring animation for smooth zoom
	const [{ zoomSpring }, setZoomSpring] = useSpring(() => ({
		zoomSpring: 1,
		config: { mass: 1, tension: 280, friction: 60 },
	}));

	const imageRef = useRef<HTMLImageElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const imageUrlRef = useRef<string>("");

	// Create URL only once when imageFile changes
	useEffect(() => {
		if (imageFile) {
			imageUrlRef.current = URL.createObjectURL(imageFile);
		}
		return () => {
			if (imageUrlRef.current) {
				URL.revokeObjectURL(imageUrlRef.current);
				imageUrlRef.current = "";
			}
		};
	}, [imageFile]);

	// Reset state when dialog opens with new image
	useEffect(() => {
		if (open && imageFile) {
			setZoom([1]);
			setPosition({ x: 0, y: 0 });
			setImageLoaded(false);
			setNaturalDimensions({ width: 0, height: 0 });
		}
	}, [open, imageFile]);

	const calculateBoundaries = useCallback(
		(newX: number, newY: number, scale: number) => {
			if (!containerRef.current || !imageRef.current) return { x: newX, y: newY };

			const container = containerRef.current;
			const containerRect = container.getBoundingClientRect();
			const containerWidth = containerRect.width;
			const containerHeight = containerRect.height;

			// Calculate the scaled dimensions of the image
			const scaledWidth = naturalDimensions.width * scale;
			const scaledHeight = naturalDimensions.height * scale;

			// Calculate the maximum allowed position based on the scaled dimensions
			const maxX = Math.max((scaledWidth - containerWidth) / 2, 0);
			const maxY = Math.max((scaledHeight - containerHeight) / 2, 0);

			// Bound the position within the allowed range
			return {
				x: Math.max(Math.min(newX, maxX), -maxX),
				y: Math.max(Math.min(newY, maxY), -maxY),
			};
		},
		[naturalDimensions],
	);

	// Handle zoom changes
	const handleZoomChange = useCallback(
		(newZoom: number[]) => {
			const zoomValue = newZoom[0];
			setZoom(newZoom);
			setZoomSpring({ zoomSpring: zoomValue });

			// Recalculate position boundaries with new zoom level
			const boundedPosition = calculateBoundaries(position.x, position.y, zoomValue);
			setPosition(boundedPosition);
		},
		[position.x, position.y, calculateBoundaries, setZoomSpring],
	);

	const handleImageLoad = useCallback(() => {
		if (!imageRef.current || !containerRef.current) return;

		const img = imageRef.current;
		const container = containerRef.current;

		const imgDimensions = {
			width: img.naturalWidth,
			height: img.naturalHeight,
		};

		setNaturalDimensions(imgDimensions);

		// Calculate initial zoom to fit the image within the container
		const containerSize = container.offsetWidth;
		const widthRatio = containerSize / imgDimensions.width;
		const heightRatio = containerSize / imgDimensions.height;
		const initialZoom = Math.min(widthRatio, heightRatio);

		// Set initial zoom to fit the image
		setZoom([initialZoom]);
		setZoomSpring({ zoomSpring: initialZoom });
		setImageLoaded(true);
	}, [setZoomSpring]);

	const handleMouseDown = (e: React.MouseEvent) => {
		if (!imageLoaded) return;
		e.preventDefault();
		setIsDragging(true);
		setDragStart({
			x: e.clientX - position.x,
			y: e.clientY - position.y,
		});
	};

	const handleMouseMove = useCallback(
		(e: React.MouseEvent) => {
			if (!isDragging || !imageLoaded) return;

			const newX = e.clientX - dragStart.x;
			const newY = e.clientY - dragStart.y;

			const boundedPosition = calculateBoundaries(newX, newY, zoom[0]);
			setPosition(boundedPosition);
		},
		[isDragging, imageLoaded, dragStart, zoom, calculateBoundaries],
	);

	const handleMouseUp = useCallback(() => {
		setIsDragging(false);
	}, []);

	const handleComplete = async () => {
		if (!imageRef.current || !containerRef.current) return;

		setProcessing(true);

		try {
			const canvas = document.createElement("canvas");
			const containerRect = containerRef.current.getBoundingClientRect();
			const scale = zoom[0];

			// Make canvas same size as the circle crop area
			const cropSize = containerRect.width;
			canvas.width = cropSize;
			canvas.height = cropSize;

			const ctx = canvas.getContext("2d");
			if (!ctx) throw new Error("Could not get canvas context");

			// Clear canvas with transparent background
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			// Create circular clipping path
			ctx.save();
			ctx.beginPath();
			ctx.arc(cropSize / 2, cropSize / 2, cropSize / 2, 0, Math.PI * 2);
			ctx.clip();

			// Calculate center position for image
			const img = imageRef.current;
			const imgWidth = naturalDimensions.width;
			const imgHeight = naturalDimensions.height;

			// Calculate image drawing position
			const scaledImgWidth = imgWidth * scale;
			const scaledImgHeight = imgHeight * scale;

			// Calculate the centered position of the image
			const centerX = (cropSize - scaledImgWidth) / 2 + position.x;
			const centerY = (cropSize - scaledImgHeight) / 2 + position.y;

			// Draw image at correct position with scaling
			ctx.drawImage(
				img,
				0, 0, imgWidth, imgHeight,
				centerX, centerY, scaledImgWidth, scaledImgHeight
			);

			// Fill outside circle with white for proper cropping
			ctx.restore();

			// Convert to blob
			canvas.toBlob(
				(blob) => {
					if (!blob) throw new Error("Could not create blob from canvas");
					onCropComplete(blob);
					setProcessing(false);
					onClose();
				},
				"image/jpeg",
				0.95,
			);
		} catch (error) {
			console.error("Error cropping image:", error);
			setProcessing(false);
		}
	};

	// Handle touch events for mobile devices
	const handleTouchStart = (e: React.TouchEvent) => {
		if (!imageLoaded) return;
		e.preventDefault();
		setIsDragging(true);
		setDragStart({
			x: e.touches[0].clientX - position.x,
			y: e.touches[0].clientY - position.y,
		});
	};

	const handleTouchMove = useCallback(
		(e: React.TouchEvent) => {
			if (!isDragging || !imageLoaded) return;

			const newX = e.touches[0].clientX - dragStart.x;
			const newY = e.touches[0].clientY - dragStart.y;

			const boundedPosition = calculateBoundaries(newX, newY, zoom[0]);
			setPosition(boundedPosition);
		},
		[isDragging, imageLoaded, dragStart, zoom, calculateBoundaries],
	);

	return (
		<Dialog open={open} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Crop Profile Picture</DialogTitle>
				</DialogHeader>

				<div className="flex flex-col items-center my-4">
					{/* Image cropping area */}
					<div
						ref={containerRef}
						className="relative w-64 h-64 overflow-hidden rounded-full border-2 border-primary/50 mb-4"
						onMouseDown={handleMouseDown}
						onMouseMove={handleMouseMove}
						onMouseUp={handleMouseUp}
						onMouseLeave={handleMouseUp}
						onTouchStart={handleTouchStart}
						onTouchMove={handleTouchMove}
						onTouchEnd={handleMouseUp}
						style={{ cursor: isDragging ? "grabbing" : "grab" }}
					>
						{!imageLoaded && (
							<div className="absolute inset-0 flex items-center justify-center bg-muted/20">
								<Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
							</div>
						)}
						{imageUrlRef.current && (
							<div
								className="absolute top-1/2 left-1/2"
								style={{
									transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
								}}
							>
								<animated.img
									ref={imageRef}
									src={imageUrlRef.current}
									alt="Crop preview"
									onLoad={handleImageLoad}
									style={{
										transform: zoomSpring.to((s) => `scale(${s})`),
										transformOrigin: "center",
										maxWidth: "none",
										width: "auto",
										height: "auto",
									}}
									draggable={false}
								/>
							</div>
						)}
					</div>

					{/* Zoom controls */}
					<div className="w-full flex items-center gap-4 px-2">
						<ZoomOut
							className="h-4 w-4 text-muted-foreground cursor-pointer"
							onClick={() => handleZoomChange([Math.max(0.1, zoom[0] - 0.1)])}
						/>
						<Slider
							value={zoom}
							min={0.1}
							max={3}
							step={0.05}
							onValueChange={handleZoomChange}
							className="flex-1"
						/>
						<ZoomIn
							className="h-4 w-4 text-muted-foreground cursor-pointer"
							onClick={() => handleZoomChange([Math.min(3, zoom[0] + 0.1)])}
						/>
					</div>
				</div>

				<DialogFooter className="sm:justify-between">
					<Button variant="outline" onClick={onClose} disabled={processing}>
						<X className="mr-2 h-4 w-4" />
						Cancel
					</Button>
					<Button onClick={handleComplete} disabled={!imageLoaded || processing}>
						{processing ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Processing...
							</>
						) : (
							<>
								<Check className="mr-2 h-4 w-4" />
								Apply
							</>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default ImageCropper;
