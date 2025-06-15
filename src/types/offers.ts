
import { LucideIcon } from "lucide-react";

export type TOffer = {
	id: string;
	title: string;
	description: string;
	icon: LucideIcon;
	price: number;
	forWho: string;
	extras?: string[];
	popular?: boolean;
	color?: string;
};
