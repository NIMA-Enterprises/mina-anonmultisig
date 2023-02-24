import { AnonMultiSig } from './AnonMultiSig';
import {
  MerkleTree,
  Mina,
  Field,
  PrivateKey,
  PublicKey,
  Poseidon,
} from 'snarkyjs';

export const TX_FEE = 200_000_000;

export function generateTree(
  tree: MerkleTree,
  numberOfMembers: Field,
  log: boolean
) {
  if (Math.pow(2, tree.height) < Number(numberOfMembers))
    throw new Error('Too many members.');

  if (log)
    console.log(`Private Key - Public Key - Leaf (Public Key Poseidon Hash)`);
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
  }
}

export async function deploy(
  zkAppInstance: AnonMultiSig,
  zkAppPrivateKey: PrivateKey,
  feePayerKey: PrivateKey
) {
  const txn = await Mina.transaction(
    { sender: feePayerKey.toPublicKey(), fee: TX_FEE, memo: 'Deploy' },
    () => {
      zkAppInstance.deploy({ zkappKey: zkAppPrivateKey });
    }
  );
  await txn.prove();
  txn.sign([feePayerKey, zkAppPrivateKey]);
  await txn.send();
}
