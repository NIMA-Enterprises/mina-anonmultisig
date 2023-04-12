import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { getEndpointCreators } from "get-endpoint-creators";

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
