import React from "react";

import animationData from "./animationData.json";
import lottie from "lottie-web";
import { cx } from "src/utils";

const AnimatedIllustration: React.FC<{ className?: string }> = ({
	className,
}) => {
	const containerRef = React.useRef(null);

	React.useEffect(() => {
		if (!containerRef.current) {
			return;
		}
		const animationInstance = lottie.loadAnimation({
			container: containerRef.current,
			renderer: "svg",
			loop: true,
			autoplay: false,
			animationData,
		});
		setTimeout(() => {
			animationInstance.play();
		}, 200);

		return () => animationInstance.destroy();
	}, []);

	return <div className={cx("", className)} ref={containerRef} />;
};

export { AnimatedIllustration };
