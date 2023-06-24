import {
  MerkleTree,
  Field,
  PrivateKey,
  PublicKey,
  Poseidon,
} from 'snarkyjs';

export const TX_FEE = 100_000_000;

export function generateTree(
  tree: MerkleTree,
  numberOfMembers: Field,
  log: boolean
) {
  if (Math.pow(2, tree.height) < Number(numberOfMembers))
    throw new Error('Too many members.');

  if (log)
    console.log(`Private Key - Public Key - Leaf (Public Key Poseidon Hash)`);
  let privateKeys: PrivateKey[] = [],
    publicKeys: PublicKey[] = [];
  // Add leaves to the tree
  for (let i = 0; i < Number(numberOfMembers); i++) {
    const privateKey: PrivateKey = PrivateKey.random();
    const publicKey: PublicKey = privateKey.toPublicKey();
    const leaf: Field = Poseidon.hash(publicKey.toFields());
    tree.setLeaf(BigInt(i), leaf);
    if (log)
      console.log(
        `${privateKey.toBase58()} - ${publicKey.toBase58()} - ${leaf.toString()}`
      );
    privateKeys.push(privateKey);
    publicKeys.push(publicKey);
  }
  return { privateKeys, publicKeys };
}
