import { MyMerkleWitness } from "../MyMerkleWitness";
import { MerkleTree } from "snarkyjs";

const getWitness = async ({
	tree,
	memberSlot,
}: {
	tree: MerkleTree;
	memberSlot: number;
}) => {
	const witness = tree.getWitness(BigInt(memberSlot));

	const path = new MyMerkleWitness(witness);

	return { path };
};

export { getWitness };
