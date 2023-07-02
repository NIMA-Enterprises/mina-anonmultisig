import { Poseidon, PublicKey } from "snarkyjs";

const generateMemberHash = ({ address }: { address: string }) => {
	const memberHash = Poseidon.hash(
		PublicKey.fromBase58(address).toFields(),
	).toJSON();

	return { memberHash };
};

export { generateMemberHash };
