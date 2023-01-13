import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const signService = createApi({
	reducerPath: "signService",
	baseQuery: fakeBaseQuery(),
	endpoints: (builder) => ({}),
});

export const {} = signService;
