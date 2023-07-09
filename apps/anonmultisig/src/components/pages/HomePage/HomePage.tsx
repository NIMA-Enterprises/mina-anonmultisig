import React from "react";

import { useMakeProposal } from "business-logic-anonmultisig";
import { cx } from "src/utils";

const HomePage = () => {
	const pageClassName = cx("min-h-screen flex flex-col");

	const { makeProposal, steps } = useMakeProposal();

	return (
		<div className={pageClassName}>
			<p>HomePage</p>
			<button
				onClick={() =>
					makeProposal({
						contractAddress:
							"B62qkyKizTdzSCdjsYtzrMcJTPcD2aZ4EpVoWosDGVFJ73hyKMoy4xi",
						receiverAddress:
							"B62qqFptEGiKzLVoKFAdinkkVhiK111WqJMXrSwFjqdSXdDfU6eqtFg",
						amount: 999_000_000,
					})
				}
			>
				makeProposal
			</button>
			<pre>{JSON.stringify(steps, null, 2)}</pre>
		</div>
	);
};

export { HomePage };
