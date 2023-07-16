import defaultBackgroundImage from "./background.png";

import React from "react";

import { PageSection } from "@components/atoms";
import { useLoadImageQuery } from "business-logic-anonmultisig";
import { motion } from "framer-motion";
import { cx } from "src/utils";

const OrganisationBackgroundImage: React.FC<{
	className?: string;
}> = ({ className }) => {
	const imageUrl = defaultBackgroundImage as string;
	const imageLoadingQuery = useLoadImageQuery({
		src: imageUrl,
	});

	if (imageLoadingQuery.isError) {
		return <p>Error</p>;
	}

	const isLoading =
		imageLoadingQuery.isLoading ||
		imageLoadingQuery.isUninitialized ||
		imageLoadingQuery.isFetching;

	return (
		<PageSection
			fullWidth
			className={cx("relative h-24 bg-gray-200", className)}
		>
			<motion.div
				style={{
					...(imageLoadingQuery.isSuccess && {
						backgroundImage: `url(${imageUrl})`,
					}),
				}}
				className="h-full w-full bg-cover bg-center"
				initial={{ opacity: 0 }}
				animate={{ opacity: isLoading ? 0 : 1 }}
				transition={{ ease: "easeInOut", duration: 0.5 }}
			>
				<PageSection className="flex items-center h-full">
					<h2 className="font-bold text-[24px] md:text-[48px]">
						Organisations
					</h2>
				</PageSection>
			</motion.div>
			<motion.div
				className="absolute inset-0 h-full w-full z-10"
				initial={{ opacity: 1 }}
				animate={{ opacity: isLoading ? 1 : 0 }}
				transition={{ ease: "easeInOut", delay: 0 }}
			>
				<div className="h-full w-full animate-pulse bg-gray-300"></div>
			</motion.div>
		</PageSection>
	);
};

export { OrganisationBackgroundImage };
