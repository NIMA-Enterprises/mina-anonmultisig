import mockedData from "./mockedData";
import { schema } from "./schema";
import { createRequestQueryFunction } from "query-function-creators";

const getOrganisations = createRequestQueryFunction({
	getAxiosRequestConfig: () => ({
		url: `${import.meta.env.BACKEND_SERVICE_VOTE_BASE_URL}/organisations`,
	}),
	schema,
	getMockedData: () => mockedData.response1,
	isMockingEnabled: true,
});

export { getOrganisations };
