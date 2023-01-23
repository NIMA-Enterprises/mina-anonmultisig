import { makeProposal } from "../service";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { getEndpointCreators } from "get-endpoint-creators";

export const hybridServiceVote = createApi({
	reducerPath: "hybridServiceVote",
	baseQuery: fakeBaseQuery(),
	endpoints: (builder) => {
		const { createMutation } = getEndpointCreators(builder);

		return {
			makeProposal: createMutation(makeProposal),
		};
	},
});

export const { useMakeProposalMutation } = hybridServiceVote;
