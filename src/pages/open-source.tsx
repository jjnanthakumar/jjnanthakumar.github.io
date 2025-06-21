"use client";

import { SEO } from "@/components/common/seo";
import OrganizationList from "@/components/opensource/organization-list";
import { getCtaDataForPage } from "@/lib/get-cta-data-for-page";
import { useState } from "react";
import OrganizationsData from "@/data/shared/opensource/organizations.json";
import OpensourceCharts from "@/components/opensource/charts";
import pullRequestsData from "@/data/shared/opensource/pull_requests.json";
import issueData from "@/data/shared/opensource/issues.json";
import PullRequestCard from "@/components/opensource/cards/pull-request";
import IssueCard from "@/components/opensource/cards/issue";

const OpenSource = () => {
	const ctaData = getCtaDataForPage("about");
	const [activeTab, setActiveTab] = useState("experience");

	return (
		<div className="space-y-24">
			<SEO
				title="Open Source Contributions | Nanthakumar J J"
				description="Learn more about Nanthakumar, a frontend software engineer specializing in React, Vue, and modern web technologies. Discover my journey, skills, and approach to development"
				type="website"
			/>
			{/* Hero Section */}
			<section className="relative overflow-hidden pt-8 md:pt-16">
				<div id="organizations">
					<div className="organizations-header-div">
						{/* <Fade bottom duration={2000} distance="20px"> */}
						<h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 tracking-tight leading-tight text-center">
							Contributed Organizations
						</h2>
						{/* </Fade> */}
					</div>
					<OrganizationList logos={OrganizationsData["data"]} />
					<OpensourceCharts />
				</div>
			</section>

			{/* Enhanced Hire Me Section with ContactCTA */}
			<section className="pb-16">
				<div id="pullrequests">
					<h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 tracking-tight leading-tight text-center">
						Recent Pull Requests
					</h2>
					<div className="text-center mb-2">
						{pullRequestsData["data"].map((pullRequest) => {
							return <PullRequestCard pullRequest={pullRequest} />;
						})}
					</div>
				</div>
                <div id="issues">
					<h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 tracking-tight leading-tight text-center">
						Recent Isues
					</h2>
					<div className="text-center mb-2">
						{issueData["data"].map((row) => {
							return <IssueCard issue={row} />;
						})}
					</div>
				</div>
			</section>
		</div>
	);
};

export default OpenSource;
