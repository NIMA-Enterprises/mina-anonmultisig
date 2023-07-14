import React from "react";

import { TextSkeleton } from "@components/atoms";
import { useOrganisationDataQuery } from "business-logic-anonmultisig";

const OrganisationDescription: React.FC<{
	contractAddress: string;
	className?: string;
}> = ({ contractAddress, className }) => {
	const organisadionDataQuery = useOrganisationDataQuery({ contractAddress });

	if (organisadionDataQuery.isError) {
		throw organisadionDataQuery.error;
	}

	return (
		<p>
			{organisadionDataQuery.isLoading ||
			organisadionDataQuery.isUninitialized ? (
				<React.Fragment>
					<TextSkeleton className="w-full" />
					<TextSkeleton className="w-full mt-1" />
					<TextSkeleton className="w-full mt-1" />
				</React.Fragment>
			) : (
				organisadionDataQuery.data.organisation.description
			)}
		</p>
	);
};

export { OrganisationDescription };
