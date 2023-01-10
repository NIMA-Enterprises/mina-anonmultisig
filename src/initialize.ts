import { AnonMultiSig } from './AnonMultiSig.js';
import * as AnonMultiSigLib from './AnonMultiSigLib.js';
import * as dotenv from 'dotenv';
import {
  Mina,
  isReady,
  PrivateKey,
  Field,
  CircuitString,
  MerkleTree,
  shutdown,
} from 'snarkyjs';

dotenv.config({ path: './.env' });

await isReady;

const dpk: string = process.env.DPK || '';
const deployerPrivateKey: PrivateKey = PrivateKey.fromBase58(dpk);

let Berkeley = Mina.Network('https://proxy.berkeley.minaexplorer.com/graphql');

Mina.setActiveInstance(Berkeley);

const zpk: string = process.env.ZPK || '';
const zkAppPrivateKey: PrivateKey = PrivateKey.fromBase58(zpk);

const zkAppInstance: AnonMultiSig = new AnonMultiSig(
  zkAppPrivateKey.toPublicKey()
);

let tree: MerkleTree = new MerkleTree(8);

// Given
const admin: Field = CircuitString.fromString(
  deployerPrivateKey.toPublicKey().toBase58()
).hash();
const numberOfMembers: Field = Field(4);
const minimalQuorum: Field = Field(3);

// Initialize the tree
AnonMultiSigLib.generateTree(tree, numberOfMembers, false);

// Get root
const root: Field = tree.getRoot();

// When
const txn = await Mina.transaction(
  {
    feePayerKey: deployerPrivateKey,
    fee: AnonMultiSigLib.TX_FEE,
    memo: 'Initialize',
  },
  () => {
    zkAppInstance.initialize(admin, root, numberOfMembers, minimalQuorum);
  }
);
await txn.prove();
txn.sign([zkAppPrivateKey]);
await txn.send();

shutdown();
