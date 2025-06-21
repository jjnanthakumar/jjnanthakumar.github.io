import React, { Component } from "react";
import "./style.css";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
// import { Fade } from "react-reveal";

class OrganizationList extends Component {
	render() {
		return (
			<div className="organizations-main-div">
				<ul className="dev-icons-orgs">
					{this.props.logos.map((logo) => {
						return (
							<li
								className="organizations-inline"
								name={logo["login"]}
								style={{ marginBottom: "5px" }}
							>
								<Tooltip>
									<TooltipTrigger asChild>
										<img
											className="organizations-img"
											src={logo["avatarUrl"]}
											alt={logo["login"]}
										/>
									</TooltipTrigger>
									<TooltipContent side="top">
										<strong>{logo["login"]}</strong>
									</TooltipContent>
								</Tooltip>
							</li>
						);
					})}
				</ul>
			</div>
		);
	}
}

export default OrganizationList;
