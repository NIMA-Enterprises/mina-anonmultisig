import React from "react";
import { useParams } from "react-router-dom";

import { OrganisationBanner } from "./OrganisationBanner";
import { ProposalSection } from "./ProposalSection";
import { cx } from "src/utils";

const OrganisationPage = () => {
	const pageClassName = cx("min-h-screen flex flex-col bg-[#E7F2F6]");

	const params = useParams<"contractAddress">();
	const contractAddress = params.contractAddress!;

	return (
		<div className={pageClassName}>
			<OrganisationBanner contractAddress={contractAddress} />
			<ProposalSection contractAddress={contractAddress} />
		</div>
	);
};

export { OrganisationPage };
