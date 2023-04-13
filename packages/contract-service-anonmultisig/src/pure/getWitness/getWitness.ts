import { MerkleTree, MerkleWitness } from "snarkyjs";

class MyMerkleWitness extends MerkleWitness(8) {}

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
