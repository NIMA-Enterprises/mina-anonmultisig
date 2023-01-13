import type { schema } from "./schema";
import type { z } from "zod";

type ModelType = z.infer<typeof schema>;

const createGetAllOrganizationsResponseModel = (response: any): ModelType => {
	return {
		status: response?.status ?? "",
		organizations: Array.isArray(response?.organizations)
			? response?.organizations.map(
					(organization: any): ModelType["organizations"][0] => ({
						name: organization?.name ?? "",
						description: organization?.description ?? "",
						contractAddress: organization?.contractAddress ?? "",
					}),
			  )
			: [],
	};
};

export { createGetAllOrganizationsResponseModel };
