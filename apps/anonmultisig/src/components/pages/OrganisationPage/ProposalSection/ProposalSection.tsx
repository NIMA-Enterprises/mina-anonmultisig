import React from "react";

import { ProposalBox } from "./ProposalBox";
import { ProposalHashCalculator } from "./ProposalHashCalculator";
import { PageSection } from "@components/atoms";
import { cx } from "src/utils";

const ProposalSection: React.FC<{
	contractAddress: string;
	className?: string;
}> = ({ contractAddress, className }) => {
	return (
		<PageSection className={cx("", className)}>
			<h3 className="text-[20px] font-medium">Current Proposal</h3>
			<div className="grid gap-4 grid-cols-12 mt-4">
				<div className="col-span-12 md:col-span-8">
					<ProposalBox contractAddress={contractAddress} />
				</div>
				<div className="col-span-12 md:col-span-4">
					<ProposalHashCalculator />
				</div>
			</div>
		</PageSection>
	);
};

export { ProposalSection };
