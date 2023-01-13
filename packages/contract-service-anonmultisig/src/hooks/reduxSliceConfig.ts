import { reset } from "../service";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { getEndpointCreators } from "get-endpoint-creators";

export const contractServiceAnonMultiSig = createApi({
	reducerPath: "backendServiceVote",
	baseQuery: fakeBaseQuery(),
	endpoints: (builder) => {
		const { createMutation } = getEndpointCreators(builder);

		return {
			reset: createMutation(reset),
		};
	},
});

export const { useResetMutation } = contractServiceAnonMultiSig;
