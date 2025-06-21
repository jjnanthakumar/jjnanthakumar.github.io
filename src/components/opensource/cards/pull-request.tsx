import { motion } from "framer-motion";
import "./style.css";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const PullRequestCard = ({ pullRequest }) => {
	// Determine icon and colors based on PR state
	let iconPR;
	let bgColor;

	if (pullRequest["state"] === "OPEN") {
		iconPR = {
			iconifyClass: "octicon:git-pull-request",
			style: { color: "#28a745" },
		};
		bgColor = "#dcffe4";
	} else if (pullRequest["state"] === "MERGED") {
		iconPR = {
			iconifyClass: "octicon:git-merge",
			style: { color: "#6f42c1" },
		};
		bgColor = "#f5f0ff";
	} else {
		iconPR = {
			iconifyClass: "octicon:git-pull-request",
			style: { color: "#d73a49" },
		};
		bgColor = "#ffdce0";
	}

	const subtitleString = `#${pullRequest["number"]} opened on ${pullRequest["createdAt"].split("T")[0]}`;

	const mergedBy = pullRequest["mergedBy"] ? (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<a
						href={pullRequest["mergedBy"]["url"]}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-block"
					>
						<img
							className="merge-by-img"
							src={pullRequest["mergedBy"]["avatarUrl"]}
							alt={`Merged by ${pullRequest["mergedBy"]["login"]}`}
						/>
					</a>
				</TooltipTrigger>
				<TooltipContent>
					<strong>{`Merged by ${pullRequest["mergedBy"]["login"]}`}</strong>
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
						className="iconify pr-icons"
						data-icon={iconPR.iconifyClass}
						style={iconPR.style}
						data-inline="false"
					></span>
					<div className="pr-title-header">
						<p className="pr-title">
							<a href={pullRequest["url"]} target="_blank" rel="noopener noreferrer">
								{pullRequest["title"]}
							</a>
						</p>
						<p className="pr-subtitle">{subtitleString}</p>
					</div>
				</div>
				<div className="files-changed-header">
					<p className="files-changed-text" style={{ backgroundColor: iconPR.style.color }}>
						{pullRequest["changedFiles"]}
					</p>
					<p className="files-changed-text-2">Files Changed</p>
				</div>
			</div>
			<div className="pr-down">
				<div className="changes-repo">
					<p className="parent-repo">
						Repository:{" "}
						<a style={{ color: iconPR.style.color }} href={pullRequest["baseRepository"]["url"]}>
							{pullRequest["baseRepository"]["owner"]["login"]}/
							{pullRequest["baseRepository"]["name"]}
						</a>
					</p>
					<div className="changes-files">
						<p className="additions-files">
							<strong>{pullRequest["additions"]} + </strong>
						</p>
						<p className="deletions-files">
							<strong>{pullRequest["deletions"]} - </strong>
						</p>
						{mergedBy}
					</div>
				</div>
				<div className="owner-img-div">
					<a
						href={pullRequest["baseRepository"]["owner"]["url"]}
						target="_blank"
						rel="noopener noreferrer"
					>
						<img
							className="owner-img"
							src={pullRequest["baseRepository"]["owner"]["avatarUrl"]}
							alt={`${pullRequest["baseRepository"]["owner"]["login"]}'s avatar`}
						/>
					</a>
				</div>
			</div>
		</motion.div>
	);
};

export default PullRequestCard;
