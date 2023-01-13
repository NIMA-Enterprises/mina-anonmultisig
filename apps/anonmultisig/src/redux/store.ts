import { configureStore } from "@reduxjs/toolkit";
// Or from '@reduxjs/toolkit/query/react'
import { setupListeners } from "@reduxjs/toolkit/query";
import { backendServiceOrganizations } from "backend-service-organizations";
import { contractServiceAnonMultiSig } from "contract-service-anonmultisig";
import { hybridServiceVote } from "hybrid-service-vote";

export const store = configureStore({
	reducer: {
		// Add the generated reducer as a specific top-level slice
		[backendServiceOrganizations.reducerPath]:
			backendServiceOrganizations.reducer,
		[hybridServiceVote.reducerPath]: hybridServiceVote.reducer,
		[contractServiceAnonMultiSig.reducerPath]:
			contractServiceAnonMultiSig.reducer,
	},
	// Adding the api middleware enables caching, invalidation, polling,
	// and other useful features of `rtk-query`.
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware()
			.concat(backendServiceOrganizations.middleware)
			.concat(hybridServiceVote.middleware)
			.concat(contractServiceAnonMultiSig.middleware),
});

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);
