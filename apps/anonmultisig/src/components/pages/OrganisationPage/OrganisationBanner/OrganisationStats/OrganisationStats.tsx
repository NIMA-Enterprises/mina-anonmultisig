import React from "react";

import { TextSkeleton } from "@components/atoms";
import { Icon } from "@components/atoms/Icon";
import { Tooltip } from "@components/atoms/Tooltip";
import {
	useAccountBalanceQuery,
	useOrganisationDataQuery,
} from "business-logic-anonmultisig";
import { truncateEthAddress } from "formatting-service/src";
import { cx } from "src/utils";

const StatItem: React.FC<{
	value: React.ReactNode;
	title: string;
	className?: string;
}> = ({ title, value, className }) => {
	return (
		<div className={cx("flex flex-col gap-1 text-[18px]", className)}>
			{value}
			<span className="whitespace-nowrap text-[14px] text-gray-500">
				{title}
			</span>
		</div>
	);
};

const OrganisationStats = ({
	contractAddress,
	className,
}: {
	contractAddress: string;
	className?: string;
}) => {
	const organisationDataQuery = useOrganisationDataQuery(
		{ contractAddress },
		{ refetchOnMountOrArgChange: 10 },
	);

	const accountBalanceQuery = useAccountBalanceQuery({ contractAddress });

	if (organisationDataQuery.isError || accountBalanceQuery.isError) {
		return null;
	}

	const statsConfig = [
		{
			name: "No. of Members",
			value: <span className="flex gap-1 font-bold">{4}</span>,
		},
		{
			name: "Current Balance",
			value: (
				<span className="flex gap-1 font-bold">
					{accountBalanceQuery.isLoading ||
					accountBalanceQuery.isUninitialized ? (
						<TextSkeleton className="w-1/2" />
					) : (
						<span>{accountBalanceQuery.data.balance}</span>
					)}{" "}
					MINA
				</span>
			),
		},
	];

	return (
		<div
			className={cx(
				"flex flex-col gap-3 rounded-lg border-[1px] border-gray-300 py-4",
				className,
			)}
			style={{
				background:
					"linear-gradient(180deg, #E7F2F6 0%, rgba(183, 205, 216, 0.40) 100%)",
			}}
		>
			<div className="flex flex-col gap-1 px-4 ">
				<p className="text-[14px] text-gray-500">Contract Address</p>
				<div className="flex items-end gap-2 ">
					<p className="text-[18px] text-gray-700">
						<Tooltip
							copy={contractAddress}
							content={contractAddress}
							placement="top"
						>
							<span className="flex gap-1 font-bold">
								{truncateEthAddress(contractAddress)}
								<Icon
									type="COPY"
									className="w-4 stroke-black"
								/>
							</span>
						</Tooltip>
					</p>
				</div>
			</div>
			<div className="h-[1px] w-full bg-gray-300" />
			<div className="grid grid-cols-[repeat(auto-fit,_minmax(Max(90px,_34%),_1fr))] gap-6 px-4">
				{statsConfig.map(({ value, name }) => (
					<StatItem value={value} key={name} title={name} />
				))}
			</div>
		</div>
	);
};

export { OrganisationStats };
