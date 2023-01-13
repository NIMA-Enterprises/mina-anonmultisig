import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

export const backendServiceVote = createApi({
	reducerPath: "backendServiceVote",
	baseQuery: fakeBaseQuery(),
	endpoints: (builder) => ({}),
});

export const {} = backendServiceVote;
