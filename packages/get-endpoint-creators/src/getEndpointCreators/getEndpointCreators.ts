import type { createApi } from "@reduxjs/toolkit/query/react";

const createQuery = <CallbackType extends (...args: any) => Promise<any>>(
	builder: Parameters<Parameters<typeof createApi>[0]["endpoints"]>[0],
	fn: CallbackType,
) =>
	builder.query<Awaited<ReturnType<typeof fn>>, Parameters<typeof fn>[0]>({
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
		// ...options,
	});

const createMutation = <CallbackType extends (...args: any) => Promise<any>>(
	builder: Parameters<Parameters<typeof createApi>[0]["endpoints"]>[0],
	fn: CallbackType,
) =>
	builder.mutation<Awaited<ReturnType<typeof fn>>, Parameters<typeof fn>[0]>({
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
		// ...options,
	});

const getEndpointCreators = (
	builder: Parameters<Parameters<typeof createApi>[0]["endpoints"]>[0],
) => ({
	createMutation: <CallbackType extends (...args: any) => Promise<any>>(
		fn: CallbackType,
	) => createMutation(builder, fn),
	createQuery: <CallbackType extends (...args: any) => Promise<any>>(
		fn: CallbackType,
	) => createQuery(builder, fn),
});

export { getEndpointCreators };
