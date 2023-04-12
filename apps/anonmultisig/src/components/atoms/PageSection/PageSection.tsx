import React from "react";

import { cx } from "src/utils";

const PageSection = React.forwardRef<
	HTMLDivElement,
	React.PropsWithChildren<{
		fullWidth?: boolean;
		className?: string;
		wider?: boolean;
		background?: boolean;
	}>
>(({ children, fullWidth, className, wider, background }, ref) => {
	const pageSectionClassName = cx(
		"mx-5",
		{
			"mx-0": !!fullWidth,
			"lg:mx-auto lg:w-[1000px] xl:w-[1200px] 2xl:w-[1400px]": !!wider,
			"lg:mx-auto lg:w-[944px] xl:w-[1136px] 2xl:w-[1328px]":
				!fullWidth && !wider,
			"px-[40px] lg:mx-auto lg:w-[984px] xl:w-[1176px] 2xl:w-[1368px] bg-orange-gradient":
				!!background,
		},
		className,
	);
	return (
		<div ref={ref} className={pageSectionClassName}>
			{children}
		</div>
	);
});

PageSection.displayName = "PageSection";

export { PageSection };
