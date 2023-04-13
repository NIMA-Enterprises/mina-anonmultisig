import type { CreateRequestQueryFunction } from "./createRequestQueryFunction.types";
import axios from "axios";
import humps from "humps";
import wait from "wait";

const IS_BACKEND_RESPONSE_VALIDATION_LOGGER_ENABLED = true;

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

		const data = await (async () => {
			if (isMockingEnabled) {
				await wait(1000);
				return getMockedData(arg);
			}

			const response = await axios.request(axiosRequestConfig);
			return humps.camelizeKeys(response.data);
		})();

		const validatedData = validateData(data, axiosRequestConfig, schema);

		return model(validatedData);
	};
