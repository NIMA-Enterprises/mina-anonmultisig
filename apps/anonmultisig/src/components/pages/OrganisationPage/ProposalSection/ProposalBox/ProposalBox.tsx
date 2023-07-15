import React from "react";

import { CancelButton } from "../CancelButton";
import { DownVoteButton } from "../DownVoteButton";
import { ExecuteButton } from "../ExecuteButton";
import { ProposalHash } from "../ProposalHash";
import { UpVoteButton } from "../UpVoteButton";
import { VotedStatsSection } from "../VotedStatsSection";

const ProposalBox: React.FC<{
	contractAddress: string;
	className?: string;
}> = ({ contractAddress }) => {
	return (
		<div
			className="flex flex-col gap-4 border-[#B7CDD8] border-solid border-[1px] rounded-3xl p-6"
			style={{
				background:
					"linear-gradient(180deg, #E7F2F6 0%, rgba(183, 205, 216, 0.40) 100%)",
			}}
		>
			<ProposalHash contractAddress={contractAddress} />
			<VotedStatsSection contractAddress={contractAddress} />
			<div className="flex gap-4">
				<UpVoteButton contractAddress={contractAddress} />
				<DownVoteButton contractAddress={contractAddress} />
			</div>
			<div className="bg-[#B7CDD8] h-[1px] rounded-sm w-full"></div>
			<p className="text-[14px] text-[#2d2d2d]">
				Place holder Every day, we give up control of intimate data to
				large tech companies to use online services. We give up control
				of our finances to banks and unaccountable credit bureaus.
			</p>
			<div className="flex gap-4">
				<ExecuteButton
					contractAddress={contractAddress}
					receiverAddress="B62qqFptEGiKzLVoKFAdinkkVhiK111WqJMXrSwFjqdSXdDfU6eqtFg"
					amount={999_000_000}
				/>
				<CancelButton contractAddress={contractAddress} />
			</div>
		</div>
	);
};

export { ProposalBox };
