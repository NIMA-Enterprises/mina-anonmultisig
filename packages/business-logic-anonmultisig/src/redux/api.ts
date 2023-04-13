import { makeProposal } from "../service";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import {
	generateMessageHash,
	readStateFields,
	reset,
} from "contract-service-anonmultisig";
import { getEndpointCreators } from "get-endpoint-creators";

window.readStateFields = readStateFields;
window.reset = reset;
window.generateMessageHash = generateMessageHash;
window.makeProposal = makeProposal;

const anonmultisigBusinessLogicApi = createApi({
	reducerPath: "anonmultisigBusinessLogicApi",
	baseQuery: fakeBaseQuery(),
	endpoints: (builder) => {
		const { createQuery, createMutation } = getEndpointCreators(builder);

		return {};
	},
});

export { anonmultisigBusinessLogicApi };

// export const {} = anonmultisigBusinessLogicApi;
