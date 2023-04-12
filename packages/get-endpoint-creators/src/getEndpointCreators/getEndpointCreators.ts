import type {
	createApi,
	QueryDefinition,
	BaseQueryFn,
	MutationDefinition,
} from "@reduxjs/toolkit/query/react";

const createQuery = <CallbackType extends (...args: any) => Promise<any>>(
	builder: Parameters<Parameters<typeof createApi>[0]["endpoints"]>[0],
	fn: CallbackType,
	options?: Omit<
		QueryDefinition<
			Parameters<CallbackType>[0],
			BaseQueryFn,
			string,
			Awaited<ReturnType<CallbackType>>
		>,
		"query" | "queryFn" | "type"
	>,
) =>
	builder.query<
		Awaited<ReturnType<CallbackType>>,
		Parameters<CallbackType>[0]
	>({
		queryFn: async (props) => {
			try {
				const response = await fn(props);
				return {
					data: response,
				};
			} catch (error: any) {
				const errorMessage =
					error.error?.message ||
					error.response?.data?.error?.message ||
					error.message ||
					"unknown error";

				return { error: errorMessage };
			}
		},
		...(options && { ...options }),
	});

const createMutation = <CallbackType extends (...args: any) => Promise<any>>(
	builder: Parameters<Parameters<typeof createApi>[0]["endpoints"]>[0],
	fn: CallbackType,
	options?: Omit<
		MutationDefinition<
			Parameters<CallbackType>[0],
			BaseQueryFn,
			string,
			Awaited<ReturnType<CallbackType>>
		>,
		"query" | "queryFn" | "type"
	>,
) =>
	builder.mutation<
		Awaited<ReturnType<CallbackType>>,
		Parameters<CallbackType>[0]
	>({
		queryFn: async (props) => {
			try {
				const response = await fn(props);
				return {
					data: response,
				};
			} catch (error: any) {
				const errorMessage =
					error.error?.message ||
					error.response?.data?.error?.message ||
					error.message ||
					"unknown error";

				return { error: errorMessage };
			}
		},
		...(options && { ...options }),
	});

const getEndpointCreators = (
	builder: Parameters<Parameters<typeof createApi>[0]["endpoints"]>[0],
) => ({
	createMutation: <CallbackType extends (...args: any) => Promise<any>>(
		fn: CallbackType,
		options?: Parameters<typeof createMutation>[2],
	) => createMutation(builder, fn, options),
	createQuery: <CallbackType extends (...args: any) => Promise<any>>(
		fn: CallbackType,
		options?: Parameters<typeof createQuery>[2],
	) => createQuery(builder, fn, options),
});

export { getEndpointCreators };
