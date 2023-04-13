import type { AxiosRequestConfig } from "axios";
import type { ZodType, z } from "zod";

// export declare type BaseQueryArg<T extends (arg: any, ...args: any[]) => any> = T extends (arg: infer A, ...args: any[]) => any ? A : any;

type CreateRequestQueryFunction = <
	SchemaType extends ZodType,
	ModelFunctionType extends (...args: any[]) => z.infer<SchemaType>,
	ArgType,
>(props: {
	getAxiosRequestConfig: (props: ArgType) => AxiosRequestConfig;
	schema: ZodType;
	model: ModelFunctionType;
	isMockingEnabled?: boolean;
	getMockedData?: (props: ArgType) => any;
}) => (props: ArgType) => Promise<ReturnType<ModelFunctionType>>;

export type { CreateRequestQueryFunction };
