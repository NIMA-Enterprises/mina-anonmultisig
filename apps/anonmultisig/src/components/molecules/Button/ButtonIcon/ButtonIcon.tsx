import { twMerge } from "tailwind-merge";

import React from "react";

import { useButtonContext } from "../ButtonContext";
import { Icon } from "@components/atoms/Icon";

const ButtonIcon: React.FC<React.ComponentProps<typeof Icon>> = (props) => {
	const { size, type } = useButtonContext();
	console.log("ButtonIcon has ", { size, type });
	const iconClassName = twMerge(
		"w-4",
		// type === "gradient" && "stroke-white dark:stroke-white",
		// type === "black" && "stroke-white dark:stroke-white",
		props.className,
	);

	console.log(iconClassName);
	return <Icon className={iconClassName} type={props.type} />;
};

export { ButtonIcon };
