import mockedData from "./mockedData";
import { schema } from "./schema";
import { createRequestQueryFunction } from "query-function-creators";

const getOrganisationData = createRequestQueryFunction({
	getAxiosRequestConfig: ({
		contractAddress,
	}: {
		contractAddress: string;
	}) => ({
		url: `${
			import.meta.env.BACKEND_SERVICE_VOTE_BASE_URL
		}/organisation/${contractAddress}`,
	}),
	schema,
	getMockedData: () => mockedData.response1,
	isMockingEnabled: true,
});

export { getOrganisationData };
