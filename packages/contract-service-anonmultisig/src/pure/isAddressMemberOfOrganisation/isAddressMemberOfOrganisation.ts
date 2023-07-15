import wait from "wait";

const isAddressMemberOfOrganisation = async ({
	contractAddress,
	userAddress,
}: {
	contractAddress: string;
	userAddress: string;
}) => {
	await wait(1000);
	return { isMember: true };
};

export { isAddressMemberOfOrganisation };
