import {
  Field,
  SmartContract,
  Bool,
  UInt64,
  state,
  State,
  method,
  DeployArgs,
  Permissions,
  Signature,
  PublicKey,
  MerkleWitness,
  Poseidon,
  MerkleMap,
  MerkleMapWitness,
} from 'snarkyjs';

class MyMerkleWitness extends MerkleWitness(8) {}

export class AnonMultiSig extends SmartContract {
  @state(Field) admin = State<Field>();
  @state(Field) membersTreeRoot = State<Field>();
  @state(Field) minimalQuorum = State<Field>();
  @state(Field) proposalId = State<Field>(); // Acts as a nonce in signing flow
  @state(Field) proposalHash = State<Field>();
  @state(Field) votesMerkleMapRoot = State<Field>();
  @state(Field) votesFor = State<Field>();
  @state(Field) votesAgainst = State<Field>();

  deploy(args: DeployArgs) {
    super.deploy(args);
    this.setPermissions({
      ...Permissions.default(),
      editState: Permissions.proofOrSignature(),
      setVerificationKey: Permissions.impossible(), // Make contract non-upgradeable
    });
  }

  /**
   * @notice Function to initialize 'AnonMultiSig' smart contract
   * @param admin is public key of initial administrator
   * @param membersTreeRoot is root of a merkle tree containing all members
   * @param minimalQuorum is minimal amount of votes needed to execute/cancel proposal
   */
  @method initialize(
    admin: Field,
    membersTreeRoot: Field,
    minimalQuorum: Field
  ) {
    // Set root
    const currentMembersTreeRoot: Field = this.membersTreeRoot.get();
    this.membersTreeRoot.assertEquals(currentMembersTreeRoot);
    currentMembersTreeRoot.isZero().assertTrue();
    membersTreeRoot.isZero().assertFalse();
    this.membersTreeRoot.set(membersTreeRoot);

    // Set admin
    const currentAdmin: Field = this.admin.get();
    this.admin.assertEquals(currentAdmin);
    currentAdmin.isZero().assertTrue();
    admin.isZero().assertFalse();
    this.admin.set(admin);

    // Set minimal quorum
    const currentMinimalQuorum: Field = this.minimalQuorum.get();
    this.minimalQuorum.assertEquals(currentMinimalQuorum);
    currentMinimalQuorum.isZero().assertTrue();
    minimalQuorum.isZero().assertFalse();
    this.minimalQuorum.set(minimalQuorum);

    // Require zkApp signature
    this.requireSignature();
  }

  /**
   * @notice Function to set new 'AnonMultiSig' administrator
   * @param newAdmin is public key of new administrator
   * @param signature is expireable signature provided by the current admin
   * @param expirationTimestamp is timestamp until which signature is valid
   */
  @method setAdmin(
    oldAdmin: PublicKey,
    newAdmin: Field,
    signature: Signature,
    expirationTimestamp: UInt64
  ) {
    // Get and assert current admin
    const currentAdmin: Field = this.admin.get();
    this.admin.assertEquals(currentAdmin);
    currentAdmin.assertEquals(Poseidon.hash(oldAdmin.toFields()));

    // Require that new admin is not empty
    newAdmin.isZero().assertFalse();
    // Require new admin is different than the current one
    currentAdmin.equals(newAdmin).assertFalse();

    // Define msg fields array with new admin
    let msg: Field[] = [newAdmin, ...expirationTimestamp.toFields(), ...this.address.toFields()];

    // Reconstruct signed message
    const msgHash: Field = Poseidon.hash(msg);

    // Make sure signature is valid
    const isSignatureValid: Bool = signature.verify(oldAdmin, [msgHash]);
    isSignatureValid.assertTrue();

    // Require signature has not expired
    this.network.timestamp.assertBetween(UInt64.zero, expirationTimestamp);

    // Set new admin
    this.admin.set(newAdmin);
  }

  /**
   * @notice Function to make new proposal / initiate new voting session
   * @param admin is public key of contract administrator
   * @param memberHash is hash of user public key who's membership needs to be verified
   * @param path is proof of user belonging in the members tree
   * @param signature is administrator's confirmation signature
   * @param proposalHash is identification hash of proposed action
   */
  @method makeProposal(
    admin: PublicKey,
    memberHash: Field,
    path: MyMerkleWitness,
    signature: Signature,
    proposalHash: Field
  ) {
    // Verify admin
    const contractAdmin: Field = this.admin.get();
    this.admin.assertEquals(contractAdmin);
    contractAdmin.assertEquals(Poseidon.hash(admin.toFields()));

    // Assert current root
    const membersTreeRoot: Field = this.membersTreeRoot.get();
    this.membersTreeRoot.assertEquals(membersTreeRoot);

    // Assert member being part of the tree
    path.calculateRoot(memberHash).assertEquals(membersTreeRoot);

    // Assert proposal hash state is empty
    const currentProposalHash: Field = this.proposalHash.get();
    this.proposalHash.assertEquals(currentProposalHash);
    currentProposalHash.isZero().assertTrue();

    // Assert votes state is empty
    const votesMerkleMapRoot: Field = this.votesMerkleMapRoot.get();
    this.votesMerkleMapRoot.assertEquals(votesMerkleMapRoot);
    votesMerkleMapRoot.isZero().assertTrue();
    // set votes merkle map root to default/empty map root
    this.votesMerkleMapRoot.set(new MerkleMap().getRoot());

    // Assert new proposal hash is not empty field
    proposalHash.isZero().assertFalse();

    // Increase proposal nonce by 1
    const proposalId: Field = this.proposalId.get();
    this.proposalId.assertEquals(proposalId);
    const newProposalId: Field = proposalId.add(1);
    this.proposalId.set(newProposalId);

    // Define msg fields array with memberHash, proposalHash and Id
    let msg: Field[] = [memberHash, proposalHash, newProposalId, ...this.address.toFields()];

    // Reconstruct signed message
    const msgHash: Field = Poseidon.hash(msg);

    // Verify Signature
    signature.verify(admin, [msgHash]).assertTrue();

    // Set new proposal hash
    this.proposalHash.set(proposalHash);
  }

  /**
   * @notice Function to instantiate a vote on active proposal
   * @param admin is public key of contract administrator
   * @param memberHash is hash of user public key who's membership needs to be verified
   * @param path is proof of user belonging in the members tree
   * @param signature is administrator's confirmation signature
   * @param vote is users support for current proposal for/true or against/false
   */
  @method vote(
    admin: PublicKey,
    memberHash: Field,
    path: MyMerkleWitness,
    signature: Signature,
    mapPath: MerkleMapWitness,
    vote: Field
  ) {
    // Verify admin
    const contractAdmin: Field = this.admin.get();
    this.admin.assertEquals(contractAdmin);
    contractAdmin.assertEquals(Poseidon.hash(admin.toFields()));

    // Assert current root
    const membersTreeRoot: Field = this.membersTreeRoot.get();
    this.membersTreeRoot.assertEquals(membersTreeRoot);

    // Assert member being part of the tree
    path.calculateRoot(memberHash).assertEquals(membersTreeRoot);

    // Assert current proposal id
    const proposalId: Field = this.proposalId.get();
    this.proposalId.assertEquals(proposalId);

    // Define msg fields array with memberHash, vote and proposalId
    let msg: Field[] = [memberHash, vote, proposalId, ...this.address.toFields()];

    // Reconstruct signed message
    const msgHash: Field = Poseidon.hash(msg);

    // Verify Signature
    signature.verify(admin, [msgHash]).assertTrue();

    // Assert votes map root state
    const votesMerkleMapRoot: Field = this.votesMerkleMapRoot.get();
    this.votesMerkleMapRoot.assertEquals(votesMerkleMapRoot);

    // Verify pair using witness
    // TODO: Consider letting memebers override votes
    const [witnessRoot, witnessKey] = mapPath.computeRootAndKey(Field(0));
    votesMerkleMapRoot.assertEquals(witnessRoot, "Invalid witness / Already voted.");
    memberHash.assertEquals(witnessKey);

    const [newVotesMerkleMapRoot, ] = mapPath.computeRootAndKey(vote);
    this.votesMerkleMapRoot.set(newVotesMerkleMapRoot);

    // TODO: Introduce reducers in order to enable multiple vote actions in the same block
  }
}
