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
  UInt64,
  MerkleTree,
  MerkleWitness,
  Poseidon,
  Encoding
} from 'snarkyjs';

class MyMerkleWitness extends MerkleWitness(8) {}

let tree: MerkleTree;
let leaves: PublicKey[] = [];

let proofsEnabled: boolean = false;

function createLocalBlockchain(): PrivateKey[] {
  const Local = Mina.LocalBlockchain({ proofsEnabled });
  Mina.setActiveInstance(Local);
  return [
    Local.testAccounts[0].privateKey, 
    Local.testAccounts[1].privateKey, 
    Local.testAccounts[2].privateKey
  ];
}

async function localDeploy(
  zkAppInstance: AnonMultiSig,
  zkAppPrivateKey: PrivateKey,
  deployerAccount: PrivateKey
) {
  const txn = await Mina.transaction(deployerAccount, () => {
    AccountUpdate.fundNewAccount(deployerAccount);
    zkAppInstance.deploy({ zkappKey: zkAppPrivateKey });
  });
  await txn.prove();
  txn.sign([zkAppPrivateKey]);
  await txn.send();
}

describe('AnonMultiSig', () => {
  let deployerAccount: PrivateKey,
    zkAppAddress: PublicKey,
    zkAppPrivateKey: PrivateKey,
    zkAppInstance: AnonMultiSig;
  
  let account1: PrivateKey, account2: PrivateKey;

  beforeAll(async () => {
    await isReady;
    if (proofsEnabled) AnonMultiSig.compile();

    [deployerAccount, account1, account2] = createLocalBlockchain();
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

  describe("General flow tests", () => {
    it('generates and deploys the `AnonMultiSig` smart contract', async () => {
      // Deploy zkApp
      await localDeploy(zkAppInstance, zkAppPrivateKey, deployerAccount);
    });
  
    it('correctly initializes `AnonMultiSig` smart contract', async () => {
      // Given
      const admin: PublicKey = deployerAccount.toPublicKey();
      const demoRoot: Field = Field(1);
      const numberOfMembers: Field = Field(4);
      const minimalQuorum: Field = Field(3);
  
      // When
      const txn = await Mina.transaction(deployerAccount, () => {
        zkAppInstance.initialize(admin, demoRoot, numberOfMembers, minimalQuorum);
      });
      await txn.prove();
      txn.sign([zkAppPrivateKey]);
      await txn.send();
  
      // Then
      expect(zkAppInstance.admin.get()).toEqual(admin);
      expect(zkAppInstance.membersTreeRoot.get()).toEqual(demoRoot);
      expect(zkAppInstance.numberOfMembers.get()).toEqual(numberOfMembers);
      expect(zkAppInstance.minimalQuorum.get()).toEqual(minimalQuorum);
    });
  
    it('correctly sets the new admin', async () => {
      // Given
      const newadmin: PublicKey = account1.toPublicKey();
      // Expiration timestamp which is valid for 2 minutes after created
      const expirationTimestamp: UInt64 = Mina.getNetworkState().timestamp.add(UInt64.from(120));
      // Compute message hash
      const msgHash: Field = CircuitString.fromString(newadmin.toString().concat(expirationTimestamp.toString())).hash();
      // Deployer is current admin
      const signature: Signature = Signature.create(deployerAccount, msgHash.toFields());
  
      // Create and send transaction
      const txn = await Mina.transaction(deployerAccount, () => {
        zkAppInstance.setAdmin(newadmin, signature, expirationTimestamp);
      });
      await txn.prove();
      txn.sign([zkAppPrivateKey]);
      await txn.send();
  
      // Then
      expect(zkAppInstance.admin.get()).toEqual(newadmin);
    });
  });

  describe('General POC tests', () => {
    it('Create & recover signature with snarkyjs', async () => {
      const privateKey: PrivateKey = PrivateKey.random();
      const publicKey: PublicKey = privateKey.toPublicKey();

      // Construct message to sign
      const msg: CircuitString = CircuitString.fromString('hello');
      const msgHash: Field = msg.hash();

      // Construct signature
      const sig: Signature = Signature.create(privateKey, [msgHash]);

      // Verify signature
      const success: Bool = sig.verify(publicKey, [msgHash]);
      expect(success).toBeTruthy();
    });

    it('Create & proove account being leaf of a tree', async () => {
      // Given
      const leafToValidate = 0;
      const accounts: PublicKey[] = [];
      const tree: MerkleTree = new MerkleTree(MyMerkleWitness.height);

      // Compute and add leaves to the tree
      for (let i = 0; i < 4; i++) {
        const publicKey: PublicKey = PrivateKey.random().toPublicKey();
        accounts.push(publicKey);
        tree.setLeaf(BigInt(i), CircuitString.fromString(publicKey.toBase58()).hash());
      }

      // Get witness for leaf
      const witness: MyMerkleWitness = new MyMerkleWitness(tree.getWitness(BigInt(leafToValidate)));
      
      // Proove leaf is part of the tree
      witness.calculateRoot(tree.getNode(0, BigInt(leafToValidate))).assertEquals(tree.getRoot())
    });
  });
});
