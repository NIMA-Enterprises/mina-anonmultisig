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
  MerkleMap,
  MerkleMapWitness,
  Poseidon,
} from 'snarkyjs';

class MyMerkleWitness extends MerkleWitness(8) {}

await isReady;

let tree: MerkleTree = new MerkleTree(MyMerkleWitness.height);
let map: MerkleMap = new MerkleMap();

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
  const deployerPublicKey = deployerAccount.toPublicKey();
  const txn = await Mina.transaction(deployerPublicKey, () => {
    AccountUpdate.fundNewAccount(deployerPublicKey);
    zkAppInstance.deploy({ zkappKey: zkAppPrivateKey });
  });
  await txn.prove();
  txn.sign([deployerAccount, zkAppPrivateKey]);
  await txn.send();
}

describe('AnonMultiSig', () => {
  let deployerAccount: PrivateKey,
    deployerAddress: PublicKey,
    zkAppAddress: PublicKey,
    zkAppPrivateKey: PrivateKey,
    zkAppInstance: AnonMultiSig;

  let account1: PrivateKey;

  beforeAll(async () => {
    if (proofsEnabled) AnonMultiSig.compile();

    [deployerAccount, account1] = createLocalBlockchain();
    deployerAddress = deployerAccount.toPublicKey();
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
      const admin: Field = Poseidon.hash(deployerAddress.toFields());
      const numberOfMembers = Field(4);
      const minimalQuorum = Field(3);

      // Initialize the tree
      AnonMultiSigLib.generateTree(tree, numberOfMembers, false);

      // Get root
      const root: Field = tree.getRoot();

      // When
      const txn = await Mina.transaction(deployerAddress, () => {
        zkAppInstance.initialize(admin, root, minimalQuorum);
      });
      await txn.prove();
      txn.sign([deployerAccount, zkAppPrivateKey]);
      await txn.send();

      // Then
      //console.log(zkAppInstance.votesAgainst.get());
      expect(zkAppInstance.admin.get()).toEqual(admin);
      expect(zkAppInstance.membersTreeRoot.get()).toEqual(root);
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
      let msg: Field[] = [
        newAdmin,
        ...expirationTimestamp.toFields(),
        ...zkAppAddress.toFields(),
      ];

      // Compute message hash
      const msgHash: Field = Poseidon.hash(msg);
      // Deployer is current admin
      const signature: Signature = Signature.create(deployerAccount, [msgHash]);

      // When
      const txn = await Mina.transaction(deployerAddress, () => {
        zkAppInstance.setAdmin(
          deployerAddress,
          newAdmin,
          signature,
          expirationTimestamp
        );
      });
      await txn.prove();
      txn.sign([deployerAccount]);
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
      let msg: Field[] = [
        memberHash,
        proposalHash,
        proposalId.add(1),
        ...zkAppAddress.toFields(),
      ];

      let msgHash = Poseidon.hash(msg);

      // Create signature
      const signature: Signature = Signature.create(account1, [msgHash]);

      // Create and send transaction
      const txn = await Mina.transaction(deployerAddress, () => {
        zkAppInstance.makeProposal(
          account1.toPublicKey(),
          memberHash,
          path,
          signature,
          proposalHash
        );
      });
      await txn.prove();
      txn.sign([deployerAccount, zkAppPrivateKey]);
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

      // Define msg fields array with memberHash, vote and proposalId
      let msg: Field[] = [memberHash, vote, proposalId];

      // Iterate over address fields and push them to msg fields array
      const thisAddressFields: Field[] = zkAppAddress.toFields();
      for (let i = 0; i < thisAddressFields.length; i++) {
        msg.push(thisAddressFields[i]);
      }

      const mapWitness = map.getWitness(memberHash);

      const votesInitialRoot = zkAppInstance.getVotesMerkleMapRoot();
      expect(votesInitialRoot).toEqual(new MerkleMap().getRoot());

      // Reconstruct signed message
      const msgHash: Field = Poseidon.hash(msg);
      // Sign message with admin pk
      const signature: Signature = Signature.create(account1, [msgHash]);
      const value: Field = Field(0);
      // Create and send transaction
      const txn = await Mina.transaction(deployerAddress, () => {
        zkAppInstance.vote(
          account1.toPublicKey(),
          memberHash,
          path,
          signature,
          mapWitness,
          value,
          vote
        );
      });
      await txn.prove();
      txn.sign([deployerAccount, zkAppPrivateKey]);
      await txn.send();

      map.set(memberHash, vote);
      const newWitness = map.getWitness(memberHash);
      const [newRoot] = newWitness.computeRootAndKey(vote);

      // Then
      const newVotesRoot = zkAppInstance.getVotesMerkleMapRoot();
      expect(newVotesRoot).toEqual(newRoot);

      const forVoteCounter = zkAppInstance.countVotes(Field(1))[0];
      expect(forVoteCounter).toEqual(Field(1));

      const againstVoteCounter = zkAppInstance.countVotes(Field(2))[0];
      expect(againstVoteCounter).toEqual(Field(0));
    });

    // TODO: Test for voting twice by same member
    // TODO: Test making proposal while there is an active proposal
    // TODO: Refactor tests
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

    it('Create & proove key-value pair being present in a MerkleMap', async () => {
      // Given
      const leafToValidate = 0;
      const accounts: PublicKey[] = [];
      const map: MerkleMap = new MerkleMap();

      // Compute and add leaves to the tree
      for (let i = 0; i < 4; i++) {
        const publicKey: PublicKey = PrivateKey.random().toPublicKey();
        accounts.push(publicKey);
        map.set(
          CircuitString.fromString(publicKey.toBase58()).hash(),
          Field(1)
        );
      }

      // Compute a key
      const key = CircuitString.fromString(
        accounts[leafToValidate].toBase58()
      ).hash();

      // Get witness for leaf
      const witness: MerkleMapWitness = map.getWitness(key);

      // Proove leaf is part of the tree
      let witnessRoot: Field;
      let witnessKey: Field;
      [witnessRoot, witnessKey] = witness.computeRootAndKey(Field(1));

      witnessRoot.assertEquals(map.getRoot());
      witnessKey.assertEquals(key);
    });
  });
});
