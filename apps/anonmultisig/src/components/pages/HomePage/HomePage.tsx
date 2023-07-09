import React from "react";

import { useMakeProposal, useVote } from "business-logic-anonmultisig";
import { cx } from "src/utils";

const HomePage = () => {
	const pageClassName = cx("min-h-screen flex flex-col");

	const { vote, steps } = useVote();

	return (
		<div className={pageClassName}>
			<p>HomePage</p>
			<button
				onClick={() =>
					vote({
						contractAddress:
							"B62qkyKizTdzSCdjsYtzrMcJTPcD2aZ4EpVoWosDGVFJ73hyKMoy4xi",
						isUpVote: true,
					})
				}
			>
				vote
			</button>
			<pre>{JSON.stringify(steps, null, 2)}</pre>
		</div>
	);
};

export { HomePage };
