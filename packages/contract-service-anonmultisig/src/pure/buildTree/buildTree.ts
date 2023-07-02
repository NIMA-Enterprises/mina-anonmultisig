import { Field, MerkleTree } from "snarkyjs";

const buildTree = ({ memberHashes }: { memberHashes: string[] }) => {
	const tree = memberHashes.reduce((acc, hash, i) => {
		acc.setLeaf(BigInt(i), Field.fromJSON(hash));
		return acc;
	}, new MerkleTree(8));

	return { tree };
};

export { buildTree };
