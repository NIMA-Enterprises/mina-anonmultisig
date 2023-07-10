import React from "react";

import {
	useCancel,
	useExecute,
	useMakeProposal,
	useReadStateFieldsQuery,
	useVote,
} from "business-logic-anonmultisig";
import { cx } from "src/utils";

const HomePage = () => {
	const pageClassName = cx("min-h-screen flex flex-col");

	const { data } = useReadStateFieldsQuery({
		contractAddress:
			"B62qkyKizTdzSCdjsYtzrMcJTPcD2aZ4EpVoWosDGVFJ73hyKMoy4xi",
	});
	const { cancel, steps } = useCancel();

	return (
		<div className={pageClassName}>
			<p>HomePage</p>
			<p>{JSON.stringify(data, null, 2)}</p>
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
