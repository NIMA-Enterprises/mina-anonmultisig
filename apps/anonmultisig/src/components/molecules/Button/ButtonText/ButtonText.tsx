import { twMerge } from "tailwind-merge";

import React from "react";

import { useButtonContext } from "../ButtonContext";

const ButtonText: React.FC<React.PropsWithChildren> = ({ children }) => {
	const { size, type } = useButtonContext();
	const textClassname = twMerge(
		"text-white font-semibold font-popins text-base tracking-wider ",
		type === "light" && " text-black ",
		// sizes
		size === "sm" && " text-sm",
		size === "lg" && " text-xl",
	);

	return <span className={textClassname}>{children}</span>;
};

export { ButtonText };
