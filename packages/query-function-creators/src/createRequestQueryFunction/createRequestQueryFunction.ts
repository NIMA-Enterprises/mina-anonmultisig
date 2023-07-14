import axios from "axios";
import type { AxiosRequestConfig } from "axios";
import humps from "humps";
import wait from "wait";
import type { ZodType, z } from "zod";

type CreateRequestQueryFunction = <SchemaType extends ZodType, ArgType>(props: {
	getAxiosRequestConfig: (props: ArgType) => AxiosRequestConfig;
	schema: SchemaType;
	isMockingEnabled?: boolean;
	getMockedData?: (props: ArgType) => any;
}) => (props: ArgType) => Promise<z.infer<SchemaType>>;

const defaultValue: Record<any, any> = {};

export const createRequestQueryFunction: CreateRequestQueryFunction =
	({
		getAxiosRequestConfig,
		schema,
		isMockingEnabled = false,
		getMockedData = () => ({}),
	}) =>
	async (arg = defaultValue) => {
		console.log("100");

		const axiosRequestConfig = getAxiosRequestConfig(arg);
		const data = await (async () => {
			if (isMockingEnabled) {
				await wait(1000);
				return getMockedData(arg);
			}

			const response = await axios.request(axiosRequestConfig);
			return humps.camelizeKeys(response.data);
		})();

		const validatedData = schema.parse(data);

		return validatedData;
	};
