import {
  MerkleTree,
  Mina,
  Field,
  PrivateKey,
  PublicKey,
  Poseidon,
} from 'snarkyjs';
import { AnonMultiSig } from './AnonMultiSig';

export const TX_FEE = 100_000_000;

export function generateTree(
  tree: MerkleTree,
  numberOfMembers: Field,
  log: boolean
) {
  if (Math.pow(2, tree.height) < Number(numberOfMembers))
    throw new Error('Too many members.');

  // Add leaves to the tree
  for (let i = 0; i < Number(numberOfMembers); i++) {
    const privateKey: PrivateKey = PrivateKey.random();
    const publicKey: PublicKey = privateKey.toPublicKey();
    tree.setLeaf(BigInt(i), Poseidon.hash(publicKey.toFields()));
    if (log) console.log(privateKey.toBase58(), publicKey.toBase58());
  }
}

export async function deploy(
  zkAppInstance: AnonMultiSig,
  zkAppPrivateKey: PrivateKey,
  feePayerKey: PrivateKey
) {
  const txn = await Mina.transaction(
    { feePayerKey, fee: TX_FEE, memo: 'Deploy' },
    () => {
      zkAppInstance.deploy({ zkappKey: zkAppPrivateKey });
    }
  );
  await txn.prove();
  txn.sign([zkAppPrivateKey]);
  await txn.send();
}
