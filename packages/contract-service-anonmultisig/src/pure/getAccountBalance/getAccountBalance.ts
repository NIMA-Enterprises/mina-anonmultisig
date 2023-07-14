import { createAnonMultiSigContract } from "../createAnonMultiSigContract";

const getAccountBalance = async ({
	contractAddress,
}: {
	contractAddress: string;
}) => {
	const { zkAppAccount } = await createAnonMultiSigContract({
		contractAddress,
		skipCompile: true,
	});

	if (!zkAppAccount) {
		return { balance: 0 };
	}

	const balance = +zkAppAccount.balance.toJSON() / 1_000_000_000;

	return {
		balance,
	};
};

export { getAccountBalance };
