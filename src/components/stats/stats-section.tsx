import { Award, Briefcase, Code, Users, type LucideIcon } from "lucide-react";

interface StatCardProps {
	icon: LucideIcon;
	number: string;
	label: string;
}

function StatCard({ icon: Icon, number, label }: StatCardProps) {
	return (
		<div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
			<div className="flex flex-col items-center text-center">
				<div className="p-3 bg-primary/10 rounded-full mb-4">
					<Icon className="w-6 h-6 text-primary" />
				</div>
				<div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{number}</div>
				<div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
			</div>
		</div>
	);
}

export function StatsSection() {
	return (
		<section className="py-12">
			<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
				<StatCard icon={Code} number="5+" label="Years Experience" />
				<StatCard icon={Briefcase} number="25+" label="Projects Completed" />
				<StatCard icon={Users} number="20+" label="Happy Clients" />
				<StatCard icon={Award} number="100%" label="Client Satisfaction" />
			</div>
		</section>
	);
}
