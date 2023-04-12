import type { TypedUseSelectorHook } from "react-redux";
import { useDispatch, useSelector } from "react-redux";

import { configureStore } from "@reduxjs/toolkit";
import { anonmultisigBusinessLogicApi } from "business-logic-anonmultisig";

export const store = configureStore({
	reducer: {
		// Add the generated reducer as a specific top-level slice
		[anonmultisigBusinessLogicApi.reducerPath]:
			anonmultisigBusinessLogicApi.reducer,
	},
	// Adding the api middleware enables caching, invalidation, polling,
	// and other useful features of `rtk-query`.
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(anonmultisigBusinessLogicApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;

export type GetEndpointReturnType<
	Key extends keyof typeof anonmultisigBusinessLogicApi["endpoints"],
> = typeof anonmultisigBusinessLogicApi["endpoints"][Key]["Types"]["ResultType"];

export type GetEndpointArgType<
	Key extends keyof typeof anonmultisigBusinessLogicApi["endpoints"],
> = typeof anonmultisigBusinessLogicApi["endpoints"][Key]["Types"]["QueryArg"];
