import React from "react";

import { cx } from "src/utils";

const TextSkeleton: React.FC<
	React.PropsWithChildren<{
		className?: string;
	}>
> = ({ className, children }) => {
	return (
		<p
			className={cx(
				"animate-pulse rounded-md bg-gray-400 text-transparent",
				className,
			)}
		>
			{children ? children : "-"}
		</p>
	);
};

export { TextSkeleton };
