import React from "react";

import { useButtonContext } from "../ButtonContext";
import { Icon } from "@components/atoms/Icon";
import { cx } from "src/utils";

const ButtonIcon: React.FC<React.ComponentProps<typeof Icon>> = (props) => {
	const { size, type } = useButtonContext();
	const iconClassName = cx(
		"w-4",
		// type === "gradient" && "stroke-white dark:stroke-white",
		// type === "black" && "stroke-white dark:stroke-white",
		type === "outline" && "stroke-slate-700",
		type === "ghost" && "stroke-[#FF603B]",
		props.className,
	);

	return <Icon className={iconClassName} type={props.type} />;
};

export { ButtonIcon };
