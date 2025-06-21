import "./style.css";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const IssueCard = ({ issue }) => {
	// Determine icon and colors based on issue state
	const isClosed = issue["closed"];
	const iconPR = {
		iconifyClass: isClosed ? "octicon:issue-closed" : "octicon:issue-opened",
		style: { color: isClosed ? "#d73a49" : "#28a745" },
	};
	const bgColor = isClosed ? "#ffdce0" : "#dcffe4";

	const subtitleString = `#${issue["number"]} opened on ${issue["createdAt"].split("T")[0]}`;

	const assignee =
		issue["assignees"]["nodes"].length > 0 ? (
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<a
							href={issue["assignees"]["nodes"][0]["url"]}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-block"
						>
							<img
								className="merge-by-img"
								src={issue["assignees"]["nodes"][0]["avatarUrl"]}
								alt={`Assigned to ${issue["assignees"]["nodes"][0]["name"]}`}
							/>
						</a>
					</TooltipTrigger>
					<TooltipContent>
						<strong>{`Assigned to ${issue["assignees"]["nodes"][0]["name"]}`}</strong>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		) : null;

	return (
		<motion.div
			initial={{ opacity: 0, y: 50 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-100px" }}
			transition={{ duration: 0.6, ease: "easeOut" }}
			className="pull-request-card"
			style={{
				backgroundColor: bgColor,
				border: `1px solid ${iconPR.style.color}`,
			}}
		>
			<div className="pr-top">
				<div className="pr-header">
					<span
						className="iconify issue-icons"
						data-icon={iconPR.iconifyClass}
						style={iconPR.style}
						data-inline="false"
					></span>
					<div className="pr-title-header">
						<p className="pr-title">
							<a href={issue["url"]} target="_blank" rel="noopener noreferrer">
								{issue["title"]}
							</a>
						</p>
						<p className="pr-subtitle">{subtitleString}</p>
					</div>
				</div>
			</div>
			<div className="pr-down">
				<div className="changes-repo">
					<p className="parent-repo">
						Repository:{" "}
						<a style={{ color: iconPR.style.color }} href={issue["repository"]["url"]}>
							{issue["repository"]["owner"]["login"]}/{issue["repository"]["name"]}
						</a>
					</p>
					<div className="assignee-info">{assignee}</div>
				</div>
				<div className="owner-img-div">
					<a href={issue["repository"]["owner"]["url"]} target="_blank" rel="noopener noreferrer">
						<img
							className="owner-img"
							src={issue["repository"]["owner"]["avatarUrl"]}
							alt={`${issue["repository"]["owner"]["login"]}'s avatar`}
						/>
					</a>
				</div>
			</div>
		</motion.div>
	);
};

export default IssueCard;
