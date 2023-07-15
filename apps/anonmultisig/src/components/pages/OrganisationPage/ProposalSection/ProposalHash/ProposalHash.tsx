import React from "react";

import { Icon, TextSkeleton, Tooltip } from "@components/atoms";
import { useReadStateFieldsQuery } from "business-logic-anonmultisig";
import { truncateEthAddress } from "formatting-service";

const ProposalHash: React.FC<{ contractAddress: string }> = ({
	contractAddress,
}) => {
	const stateFieldsQuery = useReadStateFieldsQuery({ contractAddress });

	const hashOrSkeleton = (
		<span className="flex gap-1 font-bold">
			{stateFieldsQuery.isSuccess ? (
				truncateEthAddress(stateFieldsQuery.data.proposalHash)
			) : (
				<span className="flex items-center">
					<TextSkeleton className="w-[4ch]" />
					{"..."}
					<TextSkeleton className="w-[4ch]" />
				</span>
			)}
			<Icon type="COPY" className="w-4 stroke-black" />
		</span>
	);

	return (
		<div className="flex flex-col">
			<p className="text-[14px] text-gray-500">Proposal Hash</p>
			<div className="flex items-end gap-2">
				<p className="text-[18px] text-gray-700">
					{stateFieldsQuery.isSuccess ? (
						<Tooltip
							copy={stateFieldsQuery.data.proposalHash}
							content={stateFieldsQuery.data.proposalHash}
							placement="top"
						>
							{hashOrSkeleton}
						</Tooltip>
					) : (
						hashOrSkeleton
					)}
				</p>
			</div>
		</div>
	);
};

export { ProposalHash };
