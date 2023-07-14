import defaultBackgroundImage from "./background.png";

import React from "react";

import { PageSection } from "@components/atoms";
import {
	useLoadImageQuery,
	useOrganisationDataQuery,
} from "business-logic-anonmultisig";
import { motion } from "framer-motion";
import { cx } from "src/utils";

const OrganisationBackgroundImage: React.FC<{
	contractAddress: string;
	className?: string;
}> = ({ contractAddress, className }) => {
	const organisadionDataQuery = useOrganisationDataQuery({ contractAddress });
	const imageUrl =
		organisadionDataQuery?.data?.organisation?.backgroundImageUrl ||
		(defaultBackgroundImage as string);
	const imageLoadingQuery = useLoadImageQuery(
		{
			src: imageUrl,
		},
		{ skip: !organisadionDataQuery.isSuccess },
	);

	if (organisadionDataQuery.isError || imageLoadingQuery.isError) {
		return <p>{JSON.stringify(organisadionDataQuery.error)}</p>;
	}

	const isLoading =
		organisadionDataQuery.isLoading ||
		organisadionDataQuery.isUninitialized ||
		imageLoadingQuery.isLoading ||
		imageLoadingQuery.isUninitialized ||
		imageLoadingQuery.isFetching;

	return (
		<PageSection
			fullWidth
			className={cx("relative h-80 bg-gray-200", className)}
		>
			<motion.div
				style={{
					...(organisadionDataQuery.isSuccess &&
						imageLoadingQuery.isSuccess && {
							backgroundImage: `url(${imageUrl})`,
						}),
				}}
				className="h-full w-full bg-cover bg-center"
				initial={{ opacity: 0 }}
				animate={{ opacity: isLoading ? 0 : 1 }}
				transition={{ ease: "easeInOut", duration: 0.5 }}
			></motion.div>
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
