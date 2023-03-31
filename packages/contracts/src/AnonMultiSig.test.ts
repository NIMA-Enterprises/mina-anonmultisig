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

// Proposal amount and receiver
const receiver = PrivateKey.random().toPublicKey();
const amount = UInt64.from(2_000_000_000);

let memberPrivateKeys: PrivateKey[];
let memberPublicKeys: PublicKey[];

const numberOfMembers = 4;
const minimalQuorum = 3;

function createLocalBlockchain(): PrivateKey {
  const Local = Mina.LocalBlockchain({ proofsEnabled });
  Mina.setActiveInstance(Local);
  return Local.testAccounts[0].privateKey;
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

  beforeAll(async () => {
    deployerAccount = createLocalBlockchain();
    deployerAddress = deployerAccount.toPublicKey();
    zkAppPrivateKey = PrivateKey.random();
    zkAppAddress = zkAppPrivateKey.toPublicKey();

    if (proofsEnabled) {
      console.log('compile');
      console.time('compile');
      await AnonMultiSig.compile();
      console.timeEnd('compile');
    }
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

    it('fund the contract', async () => {
      const amount = UInt64.from(10_000_000_000);
      const txn = await Mina.transaction(deployerAddress, () => {
        const update = AccountUpdate.create(deployerAddress);
        update.send({ to: zkAppAddress, amount });
        update.requireSignature();
      });
      txn.sign([deployerAccount]);
      await txn.send();
      expect(zkAppInstance.account.balance.get()).toEqual(amount);
    });

    it('fund the receiver', async () => {
      const txn = await Mina.transaction(deployerAddress, () => {
        AccountUpdate.fundNewAccount(deployerAddress);
        const update = AccountUpdate.create(deployerAddress);
        update.send({ to: receiver, amount: 0 });
        update.requireSignature();
      });
      await txn.prove();
      txn.sign([deployerAccount, zkAppPrivateKey]);
      await txn.send();
    });

    it('correctly initializes `AnonMultiSig` smart contract', async () => {
      // Initialize the tree
      const returns = AnonMultiSigLib.generateTree(
        tree,
        Field(numberOfMembers),
        false
      );
      memberPrivateKeys = returns.privateKeys;
      memberPublicKeys = returns.publicKeys;

      // Get root
      const root: Field = tree.getRoot();

      // When
      const txn = await Mina.transaction(deployerAddress, () => {
        zkAppInstance.initialize(root, Field(minimalQuorum));
      });
      await txn.prove();
      txn.sign([deployerAccount, zkAppPrivateKey]);
      await txn.send();

      // Then
      expect(zkAppInstance.membersTreeRoot.get()).toEqual(root);
      expect(zkAppInstance.minimalQuorum.get()).toEqual(Field(minimalQuorum));
    });

    it('correctly makes a proposal', async () => {
      // Given
      const memberSlot: number = 0;
      const member: PublicKey = memberPublicKeys[memberSlot];
      const path: MyMerkleWitness = new MyMerkleWitness(
        tree.getWitness(BigInt(memberSlot))
      );

      const proposalHash: Field = Poseidon.hash([
        ...receiver.toFields(),
        ...amount.toFields(),
      ]);

      const proposalId: Field = zkAppInstance.proposalId.get();

      // Define msg fields array with proposalHash and Id
      let msg: Field[] = [
        proposalHash,
        proposalId.add(1),
        ...CircuitString.fromString('propose').toFields(),
        ...zkAppAddress.toFields(),
      ];

      let msgHash = Poseidon.hash(msg);

      // Create signature
      const signature: Signature = Signature.create(
        memberPrivateKeys[memberSlot],
        [msgHash]
      );

      // Create and send transaction
      const txn = await Mina.transaction(deployerAddress, () => {
        zkAppInstance.makeProposal(member, path, signature, proposalHash);
      });
      await txn.prove();
      txn.sign([deployerAccount, zkAppPrivateKey]);
      await txn.send();

      // Then
      expect(zkAppInstance.proposalHash.get()).toEqual(proposalHash);
    });

    it('correctly instantiates quorum of votes', async () => {
      const vote: Field = Field(1);
      const proposalId: Field = zkAppInstance.proposalId.get();
      const thisAddressFields: Field[] = zkAppAddress.toFields();

      let vr = new MerkleMap().getRoot();

      for (let memberSlot = 0; memberSlot < numberOfMembers; memberSlot++) {
        // Given
        const memberHash: Field = tree.getNode(0, BigInt(memberSlot));
        const member = memberPublicKeys[memberSlot];
        const path: MyMerkleWitness = new MyMerkleWitness(
          tree.getWitness(BigInt(memberSlot))
        );
        // Define msg fields array with vote and proposalId
        let msg: Field[] = [
          vote,
          proposalId,
          ...CircuitString.fromString('vote').toFields(),
          ...thisAddressFields,
        ];
        // Get witness
        const mapWitness = map.getWitness(memberHash);

        // Assert initial votes merkle root
        const votesInitialRoot = zkAppInstance.getVotesMerkleMapRoot();
        expect(votesInitialRoot).toEqual(vr);

        // Reconstruct signed message
        const msgHash: Field = Poseidon.hash(msg);
        // Sign message with admin pk
        const signature: Signature = Signature.create(
          memberPrivateKeys[memberSlot],
          [msgHash]
        );
        const value: Field = Field(0);
        // Create and send transaction
        const txn = await Mina.transaction(deployerAddress, () => {
          zkAppInstance.vote(member, path, signature, mapWitness, value, vote);
        });
        await txn.prove();
        txn.sign([deployerAccount, zkAppPrivateKey]);
        await txn.send();

        map.set(memberHash, vote);
        const newWitness = map.getWitness(memberHash);
        const [newRoot] = newWitness.computeRootAndKey(vote);

        // Then
        // Check votes map root
        const newVotesRoot = zkAppInstance.getVotesMerkleMapRoot();
        expect(newVotesRoot).toEqual(newRoot);
        vr = newVotesRoot;
        // Check number of 'for' votes
        const forVoteCounter = zkAppInstance.countVotes(Field(1))[0];
        expect(forVoteCounter).toEqual(Field(memberSlot).add(1));
        // Check number of 'against' votes
        const againstVoteCounter = zkAppInstance.countVotes(Field(2))[0];
        expect(againstVoteCounter).toEqual(Field(0));
      }
    });

    it('correctly overrides a single vote', async () => {
      const vote: Field = Field(2);
      const proposalId: Field = zkAppInstance.proposalId.get();
      const thisAddressFields: Field[] = zkAppAddress.toFields();
      const memberSlot = 3;

      // Given
      const member: PublicKey = memberPublicKeys[memberSlot];
      const memberHash: Field = tree.getNode(0, BigInt(memberSlot));
      const path: MyMerkleWitness = new MyMerkleWitness(
        tree.getWitness(BigInt(memberSlot))
      );
      // Define msg fields array with memberHash, vote and proposalId
      let msg: Field[] = [
        vote,
        proposalId,
        ...CircuitString.fromString('vote').toFields(),
        ...thisAddressFields,
      ];
      // Get witness
      const mapWitness = map.getWitness(memberHash);

      // Reconstruct signed message
      const msgHash: Field = Poseidon.hash(msg);
      // Sign message with admin pk
      const signature: Signature = Signature.create(
        memberPrivateKeys[memberSlot],
        [msgHash]
      );
      const value: Field = Field(1);
      // Create and send transaction
      const txn = await Mina.transaction(deployerAddress, () => {
        zkAppInstance.vote(member, path, signature, mapWitness, value, vote);
      });
      await txn.prove();
      txn.sign([deployerAccount, zkAppPrivateKey]);
      await txn.send();

      map.set(memberHash, vote);
      const newWitness = map.getWitness(memberHash);
      const [newRoot] = newWitness.computeRootAndKey(vote);

      // Then
      // Check votes map root
      const newVotesRoot = zkAppInstance.getVotesMerkleMapRoot();
      expect(newVotesRoot).toEqual(newRoot);
      // Check number of 'for' votes
      const forVoteCounter = zkAppInstance.countVotes(Field(1))[0];
      expect(forVoteCounter).toEqual(Field(minimalQuorum));
      // Check number of 'against' votes
      const againstVoteCounter = zkAppInstance.countVotes(Field(2))[0];
      expect(againstVoteCounter).toEqual(Field(1));
    });

    it('correctly executes proposal', async () => {
      const proposalId: Field = zkAppInstance.proposalId.get();
      const thisAddressFields: Field[] = zkAppAddress.toFields();
      const memberSlot = 3;
      const member: PublicKey = memberPublicKeys[memberSlot];
      // Given
      const path: MyMerkleWitness = new MyMerkleWitness(
        tree.getWitness(BigInt(memberSlot))
      );
      // Define msg fields array with memberHash, vote and proposalId
      let msg: Field[] = [
        proposalId,
        ...CircuitString.fromString('execute').toFields(),
        ...thisAddressFields,
      ];

      const zkAppBalance = zkAppInstance.account.balance.get();

      // Reconstruct signed message
      const msgHash: Field = Poseidon.hash(msg);
      // Sign message with admin pk
      const signature: Signature = Signature.create(
        memberPrivateKeys[memberSlot],
        [msgHash]
      );
      // Create and send transaction
      const txn = await Mina.transaction(deployerAddress, () => {
        zkAppInstance.execute(member, path, signature, receiver, amount);
      });
      await txn.prove();
      txn.sign([deployerAccount, zkAppPrivateKey]);
      await txn.send();

      // Check that transfer went successfully
      expect(AccountUpdate.create(receiver).account.balance.get()).toEqual(
        amount
      );
      expect(zkAppInstance.account.balance.get()).toEqual(
        zkAppBalance.sub(amount)
      );

      // Check that proposal hash state is empty
      expect(zkAppInstance.proposalHash.get()).toEqual(Field(0));
    });
    // TODO: Test making proposal while there is an active proposal
    // TODO: Refactor tests
  });

  xdescribe('General POC tests', () => {
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
