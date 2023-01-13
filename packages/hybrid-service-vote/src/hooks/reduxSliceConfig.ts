import { vote } from "../service";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { getEndpointCreators } from "get-endpoint-creators";

export const hybridServiceVote = createApi({
	reducerPath: "hybridServiceVote",
	baseQuery: fakeBaseQuery(),
	endpoints: (builder) => {
		const { createMutation } = getEndpointCreators(builder);

		return {
			vote: createMutation(vote),
		};
	},
});

export const { useVoteMutation } = hybridServiceVote;
