import { getAllOrganizations } from "../service";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { getEndpointCreators } from "get-endpoint-creators";

export const backendServiceOrganizations = createApi({
	reducerPath: "backendServiceOrganizations",
	baseQuery: fakeBaseQuery(),
	endpoints: (builder) => {
		const { createMutation } = getEndpointCreators(builder);

		return {
			getAllOrganizations: createMutation(getAllOrganizations),
		};
	},
});

export const { useGetAllOrganizationsMutation } = backendServiceOrganizations;
