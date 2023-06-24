import { AnonMultiSig } from './AnonMultiSig.js';
import * as AnonMultiSigLib from './AnonMultiSigLib.js';
import * as dotenv from 'dotenv';
import { Mina, PrivateKey, PublicKey, Field, MerkleTree } from 'snarkyjs';

dotenv.config({ path: './.env' });

const dpk: string = process.env.DPK || '';
const deployerPrivateKey: PrivateKey = PrivateKey.fromBase58(dpk);

let Berkeley = Mina.Network('https://proxy.berkeley.minaexplorer.com/graphql');

Mina.setActiveInstance(Berkeley);

const zpk: string = process.env.MZPK || '';
const zkAppPrivateKey: PrivateKey = PrivateKey.fromBase58(zpk);
const zkAppPublicKey: PublicKey = zkAppPrivateKey.toPublicKey();

const zkAppInstance: AnonMultiSig = new AnonMultiSig(zkAppPublicKey);

let tree: MerkleTree = new MerkleTree(8);

// Given
const numberOfMembers = Field(4);
const minimalQuorum = Field(3);

// Initialize the tree
AnonMultiSigLib.generateTree(tree, numberOfMembers, true);

// Get root
const root: Field = tree.getRoot();

// When
const tx = await Mina.transaction(
  {
    sender: deployerPrivateKey.toPublicKey(),
    fee: AnonMultiSigLib.TX_FEE,
    memo: 'Initialize',
  },
  () => {
    zkAppInstance.initialize(root, minimalQuorum);
  }
);
console.log('Proving...');
console.time('prove');
await tx.prove();
console.timeEnd('prove');
let transactionJson = tx.sign([zkAppPrivateKey, deployerPrivateKey]).toJSON();
console.log(transactionJson);
await tx.send();
console.log('Tx sent!');
