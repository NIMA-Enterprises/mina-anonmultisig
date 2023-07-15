import React from "react";

import { TextSkeleton } from "@components/atoms";
import { useCountVotesQuery } from "business-logic-anonmultisig";

const VotedStatsSection: React.FC<{ contractAddress: string }> = ({
	contractAddress,
}) => {
	const countVotesQuery = useCountVotesQuery({ contractAddress });

	return (
		<div className="flex flex-col gap-1">
			<p className="text-[14px] text-[#2d2d2d]">Voted</p>
			<p className=" text-[#2d2d2d] leading-4">
				<span className="font-bold text-[20px]">
					{countVotesQuery.isSuccess ? (
						countVotesQuery.data.votedCount
					) : (
						<TextSkeleton className="w-[2ch] inline-block" />
					)}
				</span>
				<span className="font-light text-[16px]"> of </span>
				<span className="font-medium text-[16px]">
					{countVotesQuery.isSuccess ? (
						countVotesQuery.data.numberOfMembers
					) : (
						<TextSkeleton className="w-[2ch] inline-block" />
					)}
				</span>
			</p>
		</div>
	);
};

export { VotedStatsSection };
