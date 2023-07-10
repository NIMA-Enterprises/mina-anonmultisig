import React from "react";

import {
	useCancel,
	useExecute,
	useMakeProposal,
	useVote,
} from "business-logic-anonmultisig";
import { cx } from "src/utils";

const HomePage = () => {
	const pageClassName = cx("min-h-screen flex flex-col");

	const { cancel, steps } = useCancel();

	return (
		<div className={pageClassName}>
			<p>HomePage</p>
			<button
				onClick={() =>
					cancel({
						contractAddress:
							"B62qkyKizTdzSCdjsYtzrMcJTPcD2aZ4EpVoWosDGVFJ73hyKMoy4xi",
						// receiverAddress:
						// 	"B62qqFptEGiKzLVoKFAdinkkVhiK111WqJMXrSwFjqdSXdDfU6eqtFg",
						// amount: 999_000_000,
					})
				}
			>
				execute
			</button>
			<pre>{JSON.stringify(steps, null, 2)}</pre>
		</div>
	);
};

export { HomePage };
