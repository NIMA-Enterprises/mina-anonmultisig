import { AnonMultiSigMock } from './AnonMultiSigMock.js';
import * as AnonMultiSigLib from './AnonMultiSigLib.js';
import * as dotenv from 'dotenv';
import { Mina, PrivateKey, PublicKey } from 'snarkyjs';

dotenv.config({ path: './.env' });

//const dpk: string = process.env.DPK || '';
//const deployerPrivateKey: PrivateKey = PrivateKey.fromBase58(dpk);

let Berkeley = Mina.Network('https://proxy.berkeley.minaexplorer.com/graphql');

Mina.setActiveInstance(Berkeley);

const zpk: string = process.env.MZPK || '';
const zkAppPrivateKey: PrivateKey = PrivateKey.fromBase58(zpk);
const zkAppPublicKey: PublicKey = zkAppPrivateKey.toPublicKey();

console.log('Compiling...');
console.time('compile');
let { verificationKey } = await AnonMultiSigMock.compile();
console.timeEnd('compile');

// produce and log the transaction json; the fee payer is a dummy which has to be added later, by the signing logic
let tx = await Mina.transaction(
  {
    sender: zkAppPublicKey,
    fee: AnonMultiSigLib.TX_FEE,
    memo: 'Deploy',
  },
  () => {
    new AnonMultiSigMock(zkAppPublicKey).deploy({
      verificationKey,
    });
  }
);
console.log('Proving...');
console.time('prove');
await tx.prove();
console.timeEnd('prove');
let transactionJson = tx.sign([zkAppPrivateKey]).toJSON();
console.log(transactionJson);
await tx.send();
console.log('Tx sent!');
