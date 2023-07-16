import React from "react";

import { TextSkeleton } from "@components/atoms";
import { useOrganisationDataQuery } from "business-logic-anonmultisig";
import { cx } from "src/utils";

const OrganisationName: React.FC<{
	contractAddress: string;
	className?: string;
}> = ({ contractAddress, className }) => {
	const organisadionDataQuery = useOrganisationDataQuery({ contractAddress });

	if (organisadionDataQuery.isError) {
		throw organisadionDataQuery.error;
	}

	return (
		<h2 className={cx("text-[24px] text-[#2D2D2D]", className)}>
			{organisadionDataQuery.isLoading ||
			organisadionDataQuery.isUninitialized ? (
				<TextSkeleton className="w-40" />
			) : (
				organisadionDataQuery.data.organisation.name
			)}
		</h2>
	);
};

export { OrganisationName };
