import { AnonMultiSigMock } from './AnonMultiSigMock.js';
import * as AnonMultiSigLib from './AnonMultiSigLib.js';
import * as dotenv from 'dotenv';
import { Mina, PrivateKey } from 'snarkyjs';

dotenv.config({ path: './.env' });

const dpk: string = process.env.DPK || '';
const deployerPrivateKey: PrivateKey = PrivateKey.fromBase58(dpk);

let Berkeley = Mina.Network('https://proxy.berkeley.minaexplorer.com/graphql');

Mina.setActiveInstance(Berkeley);

const zpk: string = process.env.MZPK || '';
const zkAppPrivateKey: PrivateKey = PrivateKey.fromBase58(zpk);

const zkAppInstance: AnonMultiSigMock = new AnonMultiSigMock(
  zkAppPrivateKey.toPublicKey()
);

console.log('compiling');
await AnonMultiSigMock.compile();

// When
console.log('making tx');
const txn = await Mina.transaction(
  {
    sender: deployerPrivateKey.toPublicKey(),
    fee: AnonMultiSigLib.TX_FEE,
    memo: 'Reset',
  },
  () => {
    zkAppInstance.reset();
  }
);
console.log('prooving');
await txn.prove();
console.log('signing');
txn.sign([deployerPrivateKey, zkAppPrivateKey]);
console.log('sending');
await txn.send();
