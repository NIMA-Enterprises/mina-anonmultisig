import React from "react";

import { cx } from "src/utils";

const TextSkeleton: React.FC<
	React.PropsWithChildren<{
		className?: string;
	}>
> = ({ className, children }) => {
	return (
		<span
			className={cx(
				"animate-pulse rounded-md bg-gray-400 text-transparent block w-full",
				className,
			)}
		>
			{children ? children : "-"}
		</span>
	);
};

export { TextSkeleton };
