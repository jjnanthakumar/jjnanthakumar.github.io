import { Button } from "@/components/ui/button";
import { Calendar, Mail, MessageCircle } from "lucide-react";
import { Link } from "react-router";

export function QuickContactCTA() {
	const whatsappNumber = "+918695255075"; // Replace with your actual WhatsApp number
	const email = "jjnanthakumar477@gmail.com"; // Replace with your actual email
	const whatsappMessage = encodeURIComponent(
		"Hi Nanthakumar! I'd like to discuss a project with you.",
	);

	return (
		<div className="fixed bottom-8 right-8 z-50 flex flex-col gap-3">
			{/* WhatsApp */}
			<div className="relative group">
				<a
					href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
					target="_blank"
					rel="noopener noreferrer"
				>
					<Button
						size="icon"
						className="h-14 w-14 rounded-full shadow-lg bg-green-500 hover:bg-green-600 hover:scale-110 transition-all"
					>
						<MessageCircle className="h-6 w-6" />
						<span className="sr-only">WhatsApp</span>
					</Button>
				</a>
				<span className="absolute right-16 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
					WhatsApp Chat
				</span>
			</div>

			{/* Email */}
			<div className="relative group">
				<a href={`mailto:${email}?subject=Project Inquiry&body=Hi Nanthakumar, I'd like to discuss a project...`}>
					<Button
						size="icon"
						className="h-14 w-14 rounded-full shadow-lg bg-blue-500 hover:bg-blue-600 hover:scale-110 transition-all"
					>
						<Mail className="h-6 w-6" />
						<span className="sr-only">Email</span>
					</Button>
				</a>
				<span className="absolute right-16 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
					Send Email
				</span>
			</div>

			{/* Schedule Consultation */}
			<div className="relative group">
				<Link to="/hire-me">
					<Button
						size="icon"
						className="h-14 w-14 rounded-full shadow-lg bg-purple-500 hover:bg-purple-600 hover:scale-110 transition-all"
					>
						<Calendar className="h-6 w-6" />
						<span className="sr-only">Schedule Consultation</span>
					</Button>
				</Link>
				<span className="absolute right-16 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
					Schedule Call
				</span>
			</div>
		</div>
	);
}
