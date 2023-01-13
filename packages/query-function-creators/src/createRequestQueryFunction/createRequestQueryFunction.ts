import type { CreateRequestQueryFunction } from "./createRequestQueryFunction.types";
import axios from "axios";
import humps from "humps";

const IS_BACKEND_RESPONSE_VALIDATION_LOGGER_ENABLED = true;

const getData = async (
	axiosRequestConfig: ReturnType<
		Parameters<CreateRequestQueryFunction>[0]["getAxiosRequestConfig"]
	>,
	isMockingEnabled: boolean,
	getMockedData: () => any,
): Promise<any> => {
	if (isMockingEnabled) {
		// await wait(1000);
		return getMockedData();
	}

	const { data } = await axios.request(axiosRequestConfig);
	return humps.camelizeKeys(data);
};

const validateData = (
	data: any,
	axiosRequestConfig: ReturnType<
		Parameters<CreateRequestQueryFunction>[0]["getAxiosRequestConfig"]
	>,
	schema: Parameters<CreateRequestQueryFunction>[0]["schema"],
): any => {
	if (!IS_BACKEND_RESPONSE_VALIDATION_LOGGER_ENABLED) {
		return data;
	}

	const validationResult = schema.safeParse(data);

	if (!validationResult.success) {
		console.error(
			`response from ${axiosRequestConfig.method} ${axiosRequestConfig.url} failed to validate`,
		);
		console.error(validationResult.error.message, data);
	}

	return data;
};

const defaultValue: Record<any, any> = {};

export const createRequestQueryFunction: CreateRequestQueryFunction =
	({
		getAxiosRequestConfig,
		schema,
		model,
		isMockingEnabled = false,
		getMockedData = () => ({}),
	}) =>
	async (arg = defaultValue) => {
		const axiosRequestConfig = getAxiosRequestConfig(arg);

		const data = await getData(
			axiosRequestConfig,
			isMockingEnabled,
			getMockedData,
		);

		const validatedData = validateData(data, axiosRequestConfig, schema);

		return model(validatedData);
	};
