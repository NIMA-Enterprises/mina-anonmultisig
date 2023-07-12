import React from "react";
import type { OnlyAs, PolymorphicComponent } from "react-polymorphed";

import { nameToShapeMap } from "./nameToShapeMap";
import { cx } from "src/utils";

const defaultAsType: OnlyAs<"svg"> = "svg";

const Icon: PolymorphicComponent<
	typeof defaultAsType,
	{
		type: keyof typeof nameToShapeMap;
		className?: string;
	}
> = ({ type, className, as: As = defaultAsType, ...props }) => {
	const iconContainerClassName = cx(
		"fill-none stroke-2 aspect-square w-10 ",
		className,
	);

	return (
		<As
			strokeLinecap="round"
			strokeLinejoin="round"
			className={iconContainerClassName}
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			{nameToShapeMap[type]}
		</As>
	);
};

type IconTypes = keyof typeof nameToShapeMap;
export type { IconTypes };
export { Icon };
