/* This example requires Tailwind CSS v2.0+ */
import React, { Fragment, useState } from "react";

import { Dialog, Transition } from "@headlessui/react";
import {
	Bars3Icon,
	CalendarIcon,
	ChartBarIcon,
	FolderIcon,
	HomeIcon,
	InboxIcon,
	UsersIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";

const navigation = [
	{ name: "Dashboard", href: "#", icon: HomeIcon, current: true },
	{ name: "Team", href: "#", icon: UsersIcon, current: false },
	{ name: "Projects", href: "#", icon: FolderIcon, current: false },
	{ name: "Calendar", href: "#", icon: CalendarIcon, current: false },
	{ name: "Documents", href: "#", icon: InboxIcon, current: false },
	{ name: "Reports", href: "#", icon: ChartBarIcon, current: false },
];

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

const Sidebar = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<React.Fragment>
			{/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-100">
        <body class="h-full">
        ```
      */}
			<div>
				<Transition.Root show={sidebarOpen} as={Fragment}>
					<Dialog
						as="div"
						className="relative z-40 md:hidden"
						onClose={setSidebarOpen}
					>
						<Transition.Child
							as={Fragment}
							enter="transition-opacity ease-linear duration-300"
							enterFrom="opacity-0"
							enterTo="opacity-100"
							leave="transition-opacity ease-linear duration-300"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
						</Transition.Child>

						<div className="fixed inset-0 z-40 flex">
							<Transition.Child
								as={Fragment}
								enter="transition ease-in-out duration-300 transform"
								enterFrom="-translate-x-full"
								enterTo="translate-x-0"
								leave="transition ease-in-out duration-300 transform"
								leaveFrom="translate-x-0"
								leaveTo="-translate-x-full"
							>
								<Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-gray-800">
									<Transition.Child
										as={Fragment}
										enter="ease-in-out duration-300"
										enterFrom="opacity-0"
										enterTo="opacity-100"
										leave="ease-in-out duration-300"
										leaveFrom="opacity-100"
										leaveTo="opacity-0"
									>
										<div className="absolute top-0 right-0 -mr-12 pt-2">
											<button
												type="button"
												className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
												onClick={() =>
													setSidebarOpen(false)
												}
											>
												<span className="sr-only">
													Close sidebar
												</span>
												<XMarkIcon
													className="h-6 w-6 text-white"
													aria-hidden="true"
												/>
											</button>
										</div>
									</Transition.Child>
									<div className="h-0 flex-1 overflow-y-auto pt-5 pb-4">
										<div className="flex flex-shrink-0 items-center px-4">
											<img
												className="h-8 w-auto"
												src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
												alt="Your Company"
											/>
										</div>
										<nav className="mt-5 space-y-1 px-2">
											{navigation.map((item) => (
												<a
													key={item.name}
													href={item.href}
													className={classNames(
														item.current
															? "bg-gray-900 text-white"
															: "text-gray-300 hover:bg-gray-700 hover:text-white",
														"group flex items-center px-2 py-2 text-base font-medium rounded-md",
													)}
												>
													<item.icon
														className={classNames(
															item.current
																? "text-gray-300"
																: "text-gray-400 group-hover:text-gray-300",
															"mr-4 flex-shrink-0 h-6 w-6",
														)}
														aria-hidden="true"
													/>
													{item.name}
												</a>
											))}
										</nav>
									</div>
								</Dialog.Panel>
							</Transition.Child>
							<div className="w-14 flex-shrink-0">
								{/* Force sidebar to shrink to fit close icon */}
							</div>
						</div>
					</Dialog>
				</Transition.Root>

				{/* Static sidebar for desktop */}
				<div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
					{/* Sidebar component, swap this element with another sidebar if you like */}
					<div className="a flex min-h-0 flex-1 flex-col bg-gray-800">
						<div className="b flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
							<div className="flex flex-shrink-0 items-center px-4">
								<img
									className="h-8 w-auto"
									src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
									alt="Your Company"
								/>
							</div>
							<nav className="mt-5 flex-1 space-y-1 px-2">
								{navigation.map((item) => (
									<a
										key={item.name}
										href={item.href}
										className={classNames(
											item.current
												? "bg-gray-900 text-white"
												: "text-gray-300 hover:bg-gray-700 hover:text-white",
											"group flex items-center px-2 py-2 text-sm font-medium rounded-md",
										)}
									>
										<item.icon
											className={classNames(
												item.current
													? "text-gray-300"
													: "text-gray-400 group-hover:text-gray-300",
												"mr-3 flex-shrink-0 h-6 w-6",
											)}
											aria-hidden="true"
										/>
										{item.name}
									</a>
								))}
							</nav>
						</div>
					</div>
				</div>
				<div className="fixed top-0 z-10 pl-5 pt-5 md:hidden">
					<button
						type="button"
						className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 bg-gray-800"
						onClick={() => setSidebarOpen(true)}
					>
						<span className="sr-only">Open sidebar</span>
						<Bars3Icon className="h-6 w-6" aria-hidden="true" />
					</button>
				</div>
			</div>
		</React.Fragment>
	);
};

export { Sidebar };
