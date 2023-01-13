import { AnonMultiSig } from './AnonMultiSig.js';
import * as AnonMultiSigLib from './AnonMultiSigLib.js';
import * as dotenv from 'dotenv';
import {
  Mina,
  isReady,
  PrivateKey,
  Field,
  Poseidon,
  MerkleTree,
  shutdown,
  PublicKey,
} from 'snarkyjs';

dotenv.config({ path: './.env' });

await isReady;

const dpk: string = process.env.DPK || '';
const deployerPrivateKey: PrivateKey = PrivateKey.fromBase58(dpk);

let Berkeley = Mina.Network('https://proxy.berkeley.minaexplorer.com/graphql');

Mina.setActiveInstance(Berkeley);

const zpk: string = process.env.MZPK || '';
const zkAppPrivateKey: PrivateKey = PrivateKey.fromBase58(zpk);

const zkAppInstance: AnonMultiSig = new AnonMultiSig(
  zkAppPrivateKey.toPublicKey()
);

let tree: MerkleTree = new MerkleTree(8);

// Define AnonMultiSig admin
const adminPk: PublicKey = PublicKey.fromBase58("B62qrjGayCU1U4xAmzDfUVxMsf2FEuXNWn6VyuhDi5QuGUf7Ukh5gZ4");

// Given
const admin: Field = Poseidon.hash(adminPk.toFields());
const numberOfMembers: Field = Field(4);
const minimalQuorum: Field = Field(3);

// Initialize the tree
AnonMultiSigLib.generateTree(tree, numberOfMembers, true);

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
