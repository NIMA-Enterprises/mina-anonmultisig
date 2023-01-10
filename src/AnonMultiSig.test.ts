import { AnonMultiSig } from './AnonMultiSig';
import * as AnonMultiSigLib from './AnonMultiSigLib';
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
} from 'snarkyjs';

class MyMerkleWitness extends MerkleWitness(8) {}

await isReady;

let tree: MerkleTree = new MerkleTree(MyMerkleWitness.height);

let proofsEnabled: boolean = false;

function createLocalBlockchain(): PrivateKey[] {
  const Local = Mina.LocalBlockchain({ proofsEnabled });
  Mina.setActiveInstance(Local);
  return [Local.testAccounts[0].privateKey, Local.testAccounts[1].privateKey];
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

  let account1: PrivateKey;

  beforeAll(async () => {
    if (proofsEnabled) AnonMultiSig.compile();

    [deployerAccount, account1] = createLocalBlockchain();
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

  describe('General flow tests', () => {
    it('generates and deploys the `AnonMultiSig` smart contract', async () => {
      // Deploy zkApp
      await localDeploy(zkAppInstance, zkAppPrivateKey, deployerAccount);
    });

    it('correctly initializes `AnonMultiSig` smart contract', async () => {
      // Given
      const admin: Field = Poseidon.hash(
        deployerAccount.toPublicKey().toFields()
      );
      const numberOfMembers: Field = Field(4);
      const minimalQuorum: Field = Field(3);

      // Initialize the tree
      AnonMultiSigLib.generateTree(tree, numberOfMembers, false);

      // Get root
      const root: Field = tree.getRoot();

      // When
      const txn = await Mina.transaction(deployerAccount, () => {
        zkAppInstance.initialize(admin, root, numberOfMembers, minimalQuorum);
      });
      await txn.prove();
      txn.sign([zkAppPrivateKey]);
      await txn.send();

      // Then
      expect(zkAppInstance.admin.get()).toEqual(admin);
      expect(zkAppInstance.membersTreeRoot.get()).toEqual(root);
      expect(zkAppInstance.numberOfMembers.get()).toEqual(numberOfMembers);
      expect(zkAppInstance.minimalQuorum.get()).toEqual(minimalQuorum);
    });

    it('correctly sets the new admin', async () => {
      // Given
      const newAdmin: Field = Poseidon.hash(account1.toPublicKey().toFields());
      // Expiration timestamp which is valid for 2 minutes after created
      const expirationTimestamp: UInt64 = Mina.getNetworkState().timestamp.add(
        UInt64.from(120)
      );
      // Compute message
      let msg: Field[] = [newAdmin];
      // Iterate over timestamp fields and push them to msg fields array
      const expTimestampFields: Field[] = expirationTimestamp.toFields();
      for (let i = 0; i < expTimestampFields.length; i++) {
        msg.push(expTimestampFields[i]);
      }
      // Iterate over address fields and push them to msg fields array
      const thisAddressFields: Field[] = zkAppAddress.toFields();
      for (let i = 0; i < thisAddressFields.length; i++) {
        msg.push(thisAddressFields[i]);
      }
      // Compute message hash
      const msgHash: Field = Poseidon.hash(msg);
      // Deployer is current admin
      const signature: Signature = Signature.create(deployerAccount, [msgHash]);

      // When
      const txn = await Mina.transaction(deployerAccount, () => {
        zkAppInstance.setAdmin(
          deployerAccount.toPublicKey(),
          newAdmin,
          signature,
          expirationTimestamp
        );
      });
      await txn.prove();
      txn.sign([zkAppPrivateKey]);
      await txn.send();

      // Then
      expect(zkAppInstance.admin.get()).toEqual(newAdmin);
    });

    it('correctly makes a proposal', async () => {
      // Given
      const memberSlot: number = 0;
      const memberHash: Field = tree.getNode(0, BigInt(memberSlot));
      const path: MyMerkleWitness = new MyMerkleWitness(
        tree.getWitness(BigInt(memberSlot))
      );
      const proposalHash: Field = CircuitString.fromString('Test1').hash();

      const proposalId: Field = zkAppInstance.proposalId.get();

      // Define msg fields array with memberHash, proposalHash and Id
      let msg: Field[] = [memberHash, proposalHash, proposalId.add(1)];

      // Iterate over address fields and push them to msg fields array
      const thisAddressFields: Field[] = zkAppAddress.toFields();
      for (let i = 0; i < thisAddressFields.length; i++) {
        msg.push(thisAddressFields[i]);
      }

      let msgHash = Poseidon.hash(msg);

      // Create signature
      const signature: Signature = Signature.create(account1, [msgHash]);

      // Create and send transaction
      const txn = await Mina.transaction(deployerAccount, () => {
        zkAppInstance.makeProposal(
          account1.toPublicKey(),
          memberHash,
          path,
          signature,
          proposalHash
        );
      });
      await txn.prove();
      txn.sign([zkAppPrivateKey]);
      await txn.send();

      // Then
      expect(zkAppInstance.proposalHash.get()).toEqual(proposalHash);
    });

    it('correctly instantiates a vote', async () => {
      // Given
      const memberSlot: number = 0;
      const memberHash: Field = tree.getNode(0, BigInt(memberSlot));
      const path: MyMerkleWitness = new MyMerkleWitness(
        tree.getWitness(BigInt(memberSlot))
      );
      const vote: Field = Field(1);
      const proposalId: Field = zkAppInstance.proposalId.get();

      // TODO: Adapt to vote state changes before final checks
      let updatedVotesState = zkAppInstance.proposalVotes.get();

      // Define msg fields array with memberHash, vote and proposalId
      let msg: Field[] = [memberHash, vote, proposalId];

      // Iterate over address fields and push them to msg fields array
      const thisAddressFields: Field[] = zkAppAddress.toFields();
      for (let i = 0; i < thisAddressFields.length; i++) {
        msg.push(thisAddressFields[i]);
      }

      // Reconstruct signed message
      const msgHash: Field = Poseidon.hash(msg);
      // Sign message with admin pk
      const signature: Signature = Signature.create(account1, [msgHash]);

      // Create and send transaction
      const txn = await Mina.transaction(deployerAccount, () => {
        zkAppInstance.vote(
          account1.toPublicKey(),
          memberHash,
          path,
          signature,
          vote
        );
      });
      await txn.prove();
      txn.sign([zkAppPrivateKey]);
      await txn.send();

      // Then
      expect(zkAppInstance.proposalVotes.get()).toEqual(updatedVotesState);
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
        tree.setLeaf(
          BigInt(i),
          CircuitString.fromString(publicKey.toBase58()).hash()
        );
      }

      // Get witness for leaf
      const witness: MyMerkleWitness = new MyMerkleWitness(
        tree.getWitness(BigInt(leafToValidate))
      );

      // Proove leaf is part of the tree
      witness
        .calculateRoot(tree.getNode(0, BigInt(leafToValidate)))
        .assertEquals(tree.getRoot());
    });
  });
});
