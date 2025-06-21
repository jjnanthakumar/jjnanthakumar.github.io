import React, { Component } from "react";
// import IssueChart from "../../components/issueChart/IssueChart.jsx";
import "./style.css";
import { SectionHeader } from "@/components/ui/section-header.tsx";
import PullRequestChart from "@/components/opensource/charts/pullrequest";
import { Button } from "@/components/ui/button";
import IssueChart from "@/components/opensource/charts/issue-chart";

class OpensourceCharts extends Component {
	render() {
		const theme = this.props.theme;
		return (
			<div className="main-div">
				<SectionHeader
					title="Contributions"
					subtitle="my contribtions"
					description=""
					className="mb-16"
				/>
				{/* <Fade bottom duration={2000} distance="20px"> */}
				{/* </Fade> */}
				<div className="grid grid-cols-2 gap-4">
					<PullRequestChart />
					<IssueChart />
				</div>
			</div>
		);
	}
}

export default OpensourceCharts;
