import type { PropsWithChildren } from "react";
import React, { createContext, useContext } from "react";

import type { ButtonType, IButtonProps } from "./Button.types";

interface IButtonContext extends IButtonProps {}

const ButtonContext = createContext<IButtonContext | null>(null);

const ButtonContextProvider: React.FC<
	PropsWithChildren<{ value: IButtonContext }>
> = ({ value, children }) => {
	return (
		<ButtonContext.Provider value={value}>
			{children}
		</ButtonContext.Provider>
	);
};

const useButtonContext = () => {
	const buttonContext = useContext(ButtonContext);
	return {
		size: buttonContext?.size ?? "md",
		type: buttonContext?.type ?? "primary",
		disabled: buttonContext?.disabled ?? false,
	};
};

export { ButtonContextProvider, useButtonContext };
