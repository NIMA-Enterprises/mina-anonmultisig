import React from "react";

import {
	useLoadImageQuery,
	useOrganisationDataQuery,
} from "business-logic-anonmultisig";
import { motion } from "framer-motion";
import { cx } from "src/utils";

const OrganisationLogo: React.FC<{
	contractAddress: string;
	className?: string;
}> = ({ contractAddress, className }) => {
	const organisadionDataQuery = useOrganisationDataQuery({ contractAddress });
	const imageLoadingQuery = useLoadImageQuery(
		{
			src: organisadionDataQuery.data?.organisation?.logoUrl as string,
		},
		{ skip: !organisadionDataQuery.data?.organisation?.logoUrl },
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
		<div
			className={cx(
				"relative w-24 h-24 rounded-2xl overflow-hidden bg-gray-200",
				className,
			)}
		>
			<motion.div
				style={{
					...(organisadionDataQuery.isSuccess &&
						imageLoadingQuery.isSuccess && {
							backgroundImage: `url(${organisadionDataQuery.data.organisation.logoUrl})`,
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
				<div className="h-full w-full animate-pulse bg-gray-400"></div>
			</motion.div>
		</div>
	);
};

export { OrganisationLogo };
