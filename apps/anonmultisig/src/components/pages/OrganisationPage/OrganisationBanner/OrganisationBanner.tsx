import React from "react";

import { OrganisationBackgroundImage } from "./OrganisationBackgroundImage";
import { OrganisationDescription } from "./OrganisationDescription";
import { OrganisationLogo } from "./OrganisationLogo";
import { OrganisationName } from "./OrganisationName";
import { OrganisationStats } from "./OrganisationStats";
import { PageSection } from "@components/atoms";

const OrganisationBanner: React.FC<{ contractAddress: string }> = ({
	contractAddress,
}) => {
	return (
		<React.Fragment>
			<OrganisationBackgroundImage contractAddress={contractAddress} />
			<PageSection className="-mt-12 z-10">
				<div className="flex gap-3 items-end">
					<OrganisationLogo contractAddress={contractAddress} />
					<OrganisationName contractAddress={contractAddress} />
				</div>
				<div className="grid grid-cols-12 mt-4 gap-4">
					<div className="col-span-12 col-start-1 md:col-span-7 text-[14px] font-thin ">
						<OrganisationDescription
							contractAddress={contractAddress}
						/>
					</div>
					<div className="col-span-12 col-start-1 md:col-span-4 md:col-start-9">
						<OrganisationStats contractAddress={contractAddress} />
					</div>
				</div>
			</PageSection>
		</React.Fragment>
	);
};

export { OrganisationBanner };
