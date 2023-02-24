import { AnonMultiSigMock } from './AnonMultiSigMock.js';
import * as AnonMultiSigLib from './AnonMultiSigLib.js';
import * as dotenv from 'dotenv';
import { Mina, isReady, PrivateKey, shutdown } from 'snarkyjs';

dotenv.config({ path: './.env' });

await isReady;

const dpk: string = process.env.DPK || '';
const deployerPrivateKey: PrivateKey = PrivateKey.fromBase58(dpk);

let Berkeley = Mina.Network('https://proxy.berkeley.minaexplorer.com/graphql');

Mina.setActiveInstance(Berkeley);

const zpk: string = process.env.MZPK || '';
const zkAppPrivateKey: PrivateKey = PrivateKey.fromBase58(zpk);

const zkAppInstance: AnonMultiSigMock = new AnonMultiSigMock(
  zkAppPrivateKey.toPublicKey()
);

// When
const txn = await Mina.transaction(
  {
    sender: deployerPrivateKey.toPublicKey(),
    fee: AnonMultiSigLib.TX_FEE,
    memo: 'Deploy',
  },
  () => {
    zkAppInstance.deploy({ zkappKey: zkAppPrivateKey });
  }
);
await txn.prove();
txn.sign([deployerPrivateKey]);
await txn.send();

shutdown();
