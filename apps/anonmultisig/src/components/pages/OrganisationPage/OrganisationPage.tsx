import React from "react";
import { useParams } from "react-router-dom";

import { OrganisationBanner } from "./OrganisationBanner";
import { useModalManager } from "@components/ethereals/ModalsWrapper";
import { Button } from "@components/molecules";
import { cx } from "src/utils";

const OrganisationPage = () => {
	const pageClassName = cx("min-h-screen flex flex-col bg-[#E7F2F6]");

	const params = useParams<"contractAddress">();
	const contractAddress = params.contractAddress!;

	const { modalManager } = useModalManager();

	return (
		<div className={pageClassName}>
			<OrganisationBanner contractAddress={contractAddress} />
			<Button
				onClick={() =>
					modalManager.open("MakeProposalModal", {
						contractAddress,
						receiverAddress:
							"B62qqFptEGiKzLVoKFAdinkkVhiK111WqJMXrSwFjqdSXdDfU6eqtFg",
						amount: 999_000_000,
					})
				}
			>
				<Button.Text>Make Proposal</Button.Text>
			</Button>
			<Button
				onClick={() =>
					modalManager.open("VoteModal", {
						contractAddress,
						isUpVote: true,
					})
				}
			>
				<Button.Text>UpVote</Button.Text>
			</Button>
			<Button
				onClick={() =>
					modalManager.open("VoteModal", {
						contractAddress,
						isUpVote: false,
					})
				}
			>
				<Button.Text>DownVote</Button.Text>
			</Button>
			<Button
				onClick={() =>
					modalManager.open("ExecuteModal", {
						contractAddress,
						receiverAddress:
							"B62qqFptEGiKzLVoKFAdinkkVhiK111WqJMXrSwFjqdSXdDfU6eqtFg",
						amount: 999_000_000,
					})
				}
			>
				<Button.Text>Execute</Button.Text>
			</Button>
			<Button
				onClick={() =>
					modalManager.open("CancelModal", {
						contractAddress,
					})
				}
			>
				<Button.Text>Cancel</Button.Text>
			</Button>
		</div>
	);
};

export { OrganisationPage };
