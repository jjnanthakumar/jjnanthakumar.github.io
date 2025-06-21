import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import IssueData from "@/data/shared/opensource/issues.json";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = ["#28a745", "#d73a49"];
const HOVER_COLORS = ["#28a745dd", "#d73a49dd"];

const IssueChart = () => {
	const data = [
		{ name: "Open", value: IssueData["open"] },
		{ name: "Closed", value: IssueData["closed"] },
	];

	return (
		<Card>
			<CardHeader>
				<CardTitle>Issue Distribution</CardTitle>
			</CardHeader>
			{/* <Fade bottom duration={2000} distance="20px"> */}
			{/* </Fade> */}
			<CardContent>
				<ResponsiveContainer width="100%" height={400}>
					<PieChart>
						<Pie
							data={data}
							cx="50%"
							cy="50%"
							labelLine={false}
							outerRadius={150}
							fill="#8884d8"
							dataKey="value"
							animationDuration={4000}
							animationBegin={0}
						>
							{data.map((entry, index) => (
								<Cell
									key={`cell-${index}`}
									fill={COLORS[index % COLORS.length]}
									stroke={HOVER_COLORS[index % HOVER_COLORS.length]}
								/>
							))}
						</Pie>
						<Tooltip />
						<Legend />
					</PieChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
};

export default IssueChart;
