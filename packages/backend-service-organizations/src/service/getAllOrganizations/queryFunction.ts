import mockedData from "./mockedData";
import { createGetAllOrganizationsResponseModel } from "./model";
import { schema } from "./schema";
import { createRequestQueryFunction } from "query-function-creators";

const getAllOrganizations = createRequestQueryFunction({
	getAxiosRequestConfig: ({ userToken }: { userToken: number }) => ({
		url: `${import.meta.env.BACKEND_SERVICE_ORGANIZATIONS_BASE_URL}/`,
		method: "post",
		headers: {
			Authorization: `Bearer ${userToken}`,
		},
	}),
	schema,
	model: createGetAllOrganizationsResponseModel,
	getMockedData: () => mockedData.response1,
	isMockingEnabled: true,
});

declare global {
	interface Window {
		getAllOrganizations: typeof getAllOrganizations;
	}
}

window.getAllOrganizations = getAllOrganizations;

export { getAllOrganizations };
