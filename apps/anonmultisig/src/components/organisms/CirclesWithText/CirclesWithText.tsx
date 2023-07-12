import React from "react";

import { Icon } from "@components/atoms";
import { cx } from "src/utils";

const CirclesWithText: React.FC<{
	steps: {
		name: string;
		description?: string;
		isSuccess: boolean;
		isError: boolean;
		isUninitialized: boolean;
		isLoading: boolean;
	}[];
}> = ({ steps }) => {
	return (
		<nav aria-label="Progress">
			<ol role="list" className="overflow-hidden">
				{steps.map((step, stepIdx) => (
					<li
						key={step.name}
						className={cx(
							stepIdx !== steps.length - 1 ? "pb-10" : "",
							"relative",
						)}
					>
						{step.isSuccess ? (
							<React.Fragment>
								{stepIdx !== steps.length - 1 ? (
									<div
										className="absolute left-4 top-4 -ml-px mt-0.5 h-full w-0.5 bg-green-600"
										aria-hidden="true"
									/>
								) : null}
								<div
									// href={step.href}
									className=" relative flex items-center"
								>
									<span className="flex h-9 items-center">
										<span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-green-600 ">
											<Icon
												className="h-5 w-5 stroke-white"
												type="CHECKMARK"
											/>
										</span>
									</span>
									<span className="ml-4 flex min-w-0 flex-col">
										<span className="text-sm font-medium">
											{step.name}
										</span>
										<span className="text-sm text-gray-500">
											{step.description}
										</span>
									</span>
								</div>
							</React.Fragment>
						) : step.isLoading ? (
							<React.Fragment>
								{stepIdx !== steps.length - 1 ? (
									<div
										className="absolute left-4 top-4 -ml-px mt-0.5 h-full w-0.5 bg-gray-300"
										aria-hidden="true"
									/>
								) : null}
								<div
									// href={step.href}
									className=" relative flex items-center"
									aria-current="step"
								>
									<span
										className="flex h-9 items-center"
										aria-hidden="true"
									>
										<span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-green-600 bg-white">
											<span className="h-2.5 w-2.5 rounded-full bg-green-600 animate-ping" />
										</span>
									</span>
									<span className="ml-4 flex min-w-0 flex-col">
										<span className="text-sm font-medium">
											{step.name}
										</span>
										<span className="text-sm text-gray-500">
											{step.description}
										</span>
									</span>
								</div>
							</React.Fragment>
						) : (
							<React.Fragment>
								{stepIdx !== steps.length - 1 ? (
									<div
										className="absolute left-4 top-4 -ml-px mt-0.5 h-full w-0.5 bg-gray-300"
										aria-hidden="true"
									/>
								) : null}
								<div
									// href={step.href}
									className=" relative flex items-center"
								>
									<span
										className="flex h-9 items-center"
										aria-hidden="true"
									>
										<span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white ">
											<span className="h-2.5 w-2.5 rounded-full bg-transparent " />
										</span>
									</span>
									<span className="ml-4 flex min-w-0 flex-col">
										<span className="text-sm font-medium text-gray-500">
											{step.name}
										</span>
										<span className="text-sm text-gray-500">
											{step.description}
										</span>
									</span>
								</div>
							</React.Fragment>
						)}
					</li>
				))}
			</ol>
		</nav>
	);
};

export { CirclesWithText };
