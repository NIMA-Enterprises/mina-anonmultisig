import React from "react";
import { useNavigate } from "react-router-dom";

import { OrganisationLogo } from "../OrganisationLogo";
import { PageSection } from "@components/atoms";
import { Button } from "@components/molecules";
import { useGetOrganisationsQuery } from "business-logic-anonmultisig";
import { cx } from "src/utils";

const OrganisationsGrid: React.FC<{
	className?: string;
}> = ({ className }) => {
	const navigate = useNavigate();
	const organisationsQuery = useGetOrganisationsQuery(undefined);
	if (organisationsQuery.isLoading || organisationsQuery.isUninitialized) {
		return <p>Loading...</p>;
	}
	if (organisationsQuery.isError) {
		return <p>Error</p>;
	}
	return (
		<PageSection
			className={cx("grid-cols-12 grid gap-x-4 gap-y-6", className)}
		>
			{organisationsQuery.data.organisations.map(
				({ contractAddress, name, description, logoUrl }) => (
					<div
						key={contractAddress}
						className="border-[#B7CDD8] border-solid border-[1px] rounded-3xl p-6 col-span-4"
						style={{
							background:
								"linear-gradient(180deg, #E7F2F6 0%, rgba(183, 205, 216, 0.40) 100%)",
						}}
					>
						<div className="flex gap-3">
							<OrganisationLogo logoUrl={logoUrl} />
							<div>
								<h3 className="text-[18px] text-[#2d2d2d]">
									{name}
								</h3>
								<p className="font-light text-[16px] text-[#2d2d2d]">
									<span>5</span> members
								</p>
							</div>
						</div>
						<p className="mt-3 font-light text-[14px] text-[#2d2d2d]">
							{description}
						</p>
						<Button
							type="ghost"
							size="wrapper"
							className="mt-3"
							onClick={() => {
								navigate(`/organisation/${contractAddress}`);
							}}
						>
							<Button.Text>View Organisation</Button.Text>
							<Button.Icon type="ARROW_RIGHT" />
						</Button>
					</div>
				),
			)}
		</PageSection>
	);
};

export { OrganisationsGrid };
