import { Field, MerkleMap } from "snarkyjs";

const buildMap = ({
	memberHashes,
}: {
	memberHashes: { memberHash: string; vote: 0 | 1 | 2 }[];
}) => {
	const map = memberHashes.reduce((acc, { memberHash, vote }) => {
		acc.set(Field.fromJSON(memberHash), Field(vote));
		return acc;
	}, new MerkleMap());

	return { map };
};

export { buildMap };
