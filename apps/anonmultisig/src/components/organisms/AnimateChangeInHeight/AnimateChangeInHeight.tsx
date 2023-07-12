import React from "react";

import { motion } from "framer-motion";
import { cx } from "src/utils";

// https://github.com/framer/motion/discussions/1884#discussioncomment-5861808
const AnimateChangeInHeight: React.FC<
	React.PropsWithChildren<{ className?: string }>
> = ({ children, className }) => {
	const containerRef = React.useRef<HTMLDivElement | null>(null);
	const [height, setHeight] = React.useState<number | "auto">("auto");

	React.useEffect(() => {
		if (containerRef.current) {
			const resizeObserver = new ResizeObserver((entries) => {
				// We only have one entry, so we can use entries[0].
				const observedHeight = entries[0].contentRect.height;
				setHeight(observedHeight);
			});

			resizeObserver.observe(containerRef.current);

			return () => {
				// Cleanup the observer when the component is unmounted
				resizeObserver.disconnect();
			};
		}
	}, []);

	return (
		<motion.div
			className={cx("w-full ", className, "overflow-hidden")}
			style={{ height }}
			animate={{ height }}
			transition={{ duration: 1 }}
		>
			<div ref={containerRef} className="flex justify-center">
				{children}
			</div>
		</motion.div>
	);
};

export { AnimateChangeInHeight };
