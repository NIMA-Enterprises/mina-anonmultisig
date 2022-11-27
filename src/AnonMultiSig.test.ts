import { AnonMultiSig } from './AnonMultiSig';
import {
  isReady,
  shutdown,
  Field,
  Mina,
  PrivateKey,
  PublicKey,
  AccountUpdate,
  Signature,
  CircuitString,
  Bool,
} from 'snarkyjs';

let proofsEnabled = false;
function createLocalBlockchain() {
  const Local = Mina.LocalBlockchain({ proofsEnabled });
  Mina.setActiveInstance(Local);
  return Local.testAccounts[0].privateKey;
}

async function localDeploy(
  zkAppInstance: AnonMultiSig,
  zkAppPrivatekey: PrivateKey,
  deployerAccount: PrivateKey
) {
  const txn = await Mina.transaction(deployerAccount, () => {
    AccountUpdate.fundNewAccount(deployerAccount);
    zkAppInstance.deploy({ zkappKey: zkAppPrivatekey });
    zkAppInstance.init(zkAppPrivatekey);
  });
  await txn.prove();
  txn.sign([zkAppPrivatekey]);
  await txn.send();
}

describe('AnonMultiSig', () => {
  let deployerAccount: PrivateKey,
    zkAppAddress: PublicKey,
    zkAppPrivateKey: PrivateKey,
    zkAppInstance: AnonMultiSig;

  beforeAll(async () => {
    await isReady;
    if (proofsEnabled) AnonMultiSig.compile();

    deployerAccount = createLocalBlockchain();
    zkAppPrivateKey = PrivateKey.random();
    zkAppAddress = zkAppPrivateKey.toPublicKey();
    zkAppInstance = new AnonMultiSig(zkAppAddress);
  });

  afterAll(async () => {
    // `shutdown()` internally calls `process.exit()` which will exit the running Jest process early.
    // Specifying a timeout of 0 is a workaround to defer `shutdown()` until Jest is done running all tests.
    // This should be fixed with https://github.com/MinaProtocol/mina/issues/10943
    setTimeout(shutdown, 0);
  });

  it('generates and deploys the `AnonMultiSig` smart contract', async () => {
    // Deploy zkApp
    await localDeploy(zkAppInstance, zkAppPrivateKey, deployerAccount);
    // Make sure zkApp is initialized
    const num = zkAppInstance.num.get();
    expect(num).toEqual(Field(1));
  });

  it('correctly sets the admin state', async () => {
    // Create and send transaction
    const txn = await Mina.transaction(deployerAccount, () => {
      zkAppInstance.setAdmin(deployerAccount.toPublicKey());
    });
    await txn.prove();
    txn.sign([zkAppPrivateKey]);
    await txn.send();
    // console.log(zkAppInstance.admin.get().x.toString()); // Log the admin address
    // Make sure admin is set
    const admin = zkAppInstance.admin.get();
    expect(admin).toEqual(deployerAccount.toPublicKey());
  });

  it('correctly updates the num state', async () => {
    const num: Field = Field(7);
    const nonce: Field = zkAppInstance.nonce.get();

    // Generate signature
    const msg: CircuitString = CircuitString.fromString(num.toString().concat(nonce.toString()));
    const sig: Signature = Signature.create(deployerAccount, msg.hash().toFields());

    // Create and send transaction
    const txn = await Mina.transaction(deployerAccount, () => {
      zkAppInstance.update(sig, num);
    });
    await txn.prove();
    txn.sign([zkAppPrivateKey]);
    await txn.send();

    // Check if state is updated properly
    const updatedNum = zkAppInstance.num.get();
    expect(updatedNum).toEqual(Field(7));
  });

  describe('General POC tests', () => {
    it('Create & Recover signature with snarkyjs', async () => {
      const privateKey: PrivateKey = PrivateKey.random();
      const publicKey: PublicKey = privateKey.toPublicKey();
  
      const msg: CircuitString = CircuitString.fromString('hello');
      const msgHash: Field = msg.hash();
      // console.log(msg, msg.toFields(), msgHash, msgHash.toString());
  
      const sig: Signature = Signature.create(privateKey, msgHash.toFields());
      // console.log(sig, sig.r.toString(), sig.s.toString());
  
      const success: Bool = sig.verify(publicKey, msgHash.toFields());
      // console.log(success);
  
      expect(success).toBeTruthy;
    });
  });
});
