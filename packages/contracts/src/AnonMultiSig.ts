import {
  Field,
  SmartContract,
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
  Reducer,
  Struct,
  Circuit,
  CircuitString,
} from 'snarkyjs';

// TODO: Introduce adaptive tree height
class MyMerkleWitness extends MerkleWitness(8) {}

class VoteAction extends Struct({
  proposalId: Field,
  merkleMapRoot: Field,
  vote: Field,
}) {}

export class AnonMultiSig extends SmartContract {
  @state(Field) admin = State<Field>();
  @state(Field) membersTreeRoot = State<Field>();
  @state(Field) minimalQuorum = State<Field>();
  @state(Field) proposalId = State<Field>(); // Acts as a nonce in signing flow
  @state(Field) proposalHash = State<Field>();
  @state(Field) voteActionsHash = State<Field>();

  reducer = Reducer({ actionType: VoteAction });

  deploy(args: DeployArgs) {
    super.deploy(args);
    this.account.permissions.set({
      ...Permissions.default(),
      editState: Permissions.proofOrSignature(),
    });
  }

  /**
   * @notice Function to initialize 'AnonMultiSig' smart contract
   * @param admin is hash of initial administrator public key
   * @param membersTreeRoot is root of a merkle tree containing all members
   * @param minimalQuorum is minimal amount of votes needed to execute/cancel proposal
   */
  @method initialize(
    admin: Field,
    membersTreeRoot: Field,
    minimalQuorum: Field
  ) {
    // Set proper permissions for non-upgradeable decentralized voting
    this.account.permissions.set({
      ...Permissions.default(),
      send: Permissions.proof(),
      setDelegate: Permissions.proof(), // TODO: Introduce stake delegation for AnonMultiSig
      setPermissions: Permissions.impossible(), // Disable permission changes
      setVerificationKey: Permissions.impossible(), // Make contract non-upgradeable
      setZkappUri: Permissions.impossible(), // Make contract non-upgradeable
      setTokenSymbol: Permissions.impossible(),
    });

    // Set initial voteActionsHash
    this.voteActionsHash.set(Reducer.initialActionsHash);

    // Set root
    const currentMembersTreeRoot: Field = this.membersTreeRoot.get();
    this.membersTreeRoot.assertEquals(currentMembersTreeRoot);
    currentMembersTreeRoot.isZero().assertTrue();
    membersTreeRoot.isZero().assertFalse('Members tree root cannot be empty.');
    this.membersTreeRoot.set(membersTreeRoot);

    // Set admin
    const currentAdmin: Field = this.admin.get();
    this.admin.assertEquals(currentAdmin);
    currentAdmin.isZero().assertTrue();
    admin.isZero().assertFalse('Admin cannot be empty.');
    this.admin.set(admin);

    // Set minimal quorum
    const currentMinimalQuorum: Field = this.minimalQuorum.get();
    this.minimalQuorum.assertEquals(currentMinimalQuorum);
    currentMinimalQuorum.isZero().assertTrue();
    minimalQuorum.isZero().assertFalse('Minimal quorum cannot be empty.');
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
    currentAdmin.assertEquals(Poseidon.hash(oldAdmin.toFields()), 'Invalid old admin public key.');

    // Require that new admin is not empty
    newAdmin.isZero().assertFalse('Invalid new admin public key.');
    // Require new admin is different than the current one
    currentAdmin.equals(newAdmin).assertFalse('Admin public keys must be different.');

    // Define msg fields array with new admin
    let msg: Field[] = [
      newAdmin,
      ...expirationTimestamp.toFields(),
      ...this.address.toFields(),
    ];

    // Reconstruct signed message
    const msgHash: Field = Poseidon.hash(msg);

    // Make sure signature is valid
    signature.verify(oldAdmin, [msgHash]).assertTrue('Invalid signature.');

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
    this.verifyAdmin(admin);

    // Verify membership
    this.verifyMembership(memberHash, path);

    // Assert proposal hash state is empty
    const currentProposalHash: Field = this.proposalHash.get();
    this.proposalHash.assertEquals(currentProposalHash);
    currentProposalHash.isZero().assertTrue();

    // Assert new proposal hash is not empty field
    proposalHash.isZero().assertFalse();

    // Increase proposal nonce by 1
    const proposalId: Field = this.proposalId.get();
    this.proposalId.assertEquals(proposalId);
    const newProposalId: Field = proposalId.add(1);
    this.proposalId.set(newProposalId);

    // Dispatch initial root
    this.reducer.dispatch(
      new VoteAction({
        proposalId: newProposalId,
        merkleMapRoot: new MerkleMap().getRoot(),
        vote: Field(0),
      })
    );

    // Define msg fields array with memberHash, proposalHash and Id
    let msg: Field[] = [
      memberHash,
      proposalHash,
      newProposalId,
      ...this.address.toFields(),
    ];

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
    value: Field,
    vote: Field
  ) {
    // Verify admin
    this.verifyAdmin(admin);

    // Verify membership
    this.verifyMembership(memberHash, path);

    // Make sure vote is valid
    vote
      .equals(Field(1))
      .or(vote.equals(Field(2)))
      .assertTrue('Invalid vote value.');

    // Make sure vote is different than current witness value
    vote.equals(value).assertFalse('Invalid merkle witness value.');

    // Assert current proposal id
    const proposalId: Field = this.proposalId.get();
    this.proposalId.assertEquals(proposalId);

    // Define msg fields array with memberHash, vote and proposalId
    let msg: Field[] = [
      memberHash,
      vote,
      proposalId,
      ...this.address.toFields(),
    ];

    // Reconstruct signed message
    const msgHash: Field = Poseidon.hash(msg);

    // Verify Signature
    signature.verify(admin, [msgHash]).assertTrue();

    // Get current votes merkle map root
    const votesMerkleMapRoot = this.getVotesMerkleMapRoot();

    // Verify pair using witness
    const [witnessRoot, witnessKey] = mapPath.computeRootAndKey(value);
    votesMerkleMapRoot.assertEquals(witnessRoot, 'Invalid root.');
    memberHash.assertEquals(witnessKey, 'Invalid witness key.');

    // Get new merkle root
    const [newVotesMerkleMapRoot] = mapPath.computeRootAndKey(vote);

    // Dispatch new action
    this.reducer.dispatch(
      new VoteAction({ proposalId, merkleMapRoot: newVotesMerkleMapRoot, vote })
    );
  }

  /**
   * @notice Function to cancel active proposal
   * @dev Cancel is possible only when >= minimalQuorum of members has voted against the proposal
   * @param admin is public key of contract administrator
   * @param memberHash is hash of user public key who's membership needs to be verified
   * @param path is proof of user belonging in the members tree
   * @param signature is administrator's confirmation signature
   */
  @method cancel(
    admin: PublicKey,
    memberHash: Field,
    path: MyMerkleWitness,
    signature: Signature
  ) {
    // Assert minimal quorum has voted in favor of canceling the proposal
    this.assertVotesAndSetActionsHash(Field(2));

    // Verify admin
    this.verifyAdmin(admin);

    // Verify membership
    this.verifyMembership(memberHash, path);

    // Assert current proposal id
    const proposalId: Field = this.proposalId.get();
    this.proposalId.assertEquals(proposalId);

    // Define msg fields array with memberHash, vote and proposalId
    let msg: Field[] = [
      memberHash,
      proposalId,
      ...CircuitString.fromString('cancel').toFields(),
      ...this.address.toFields(),
    ];

    // Reconstruct signed message
    const msgHash: Field = Poseidon.hash(msg);

    // Verify Signature
    signature.verify(admin, [msgHash]).assertTrue('Invalid signature.');

    // Empty the proposal hash state
    this.proposalHash.set(Field(0));
  }

  @method execute() {
    // Assert minimal quorum has voted in favor of proposal execution
    this.assertVotesAndSetActionsHash(Field(1));

    // Empty the proposal hash state
    this.proposalHash.set(Field(0));
  }

  /**
   * @notice Function to verify admin
   * @param admin public key to be verified
   */
  verifyAdmin(admin: PublicKey) {
    const contractAdmin: Field = this.admin.get();
    this.admin.assertEquals(contractAdmin);
    contractAdmin.assertEquals(Poseidon.hash(admin.toFields()), 'Invalid admin public key.');
  }

  /**
   * @notice Function to verify membership in a tree
   * @param memberHash member public key hash
   * @param path merkle witness for the member
   */
  verifyMembership(memberHash: Field, path: MyMerkleWitness) {
    // Assert current root
    const membersTreeRoot: Field = this.membersTreeRoot.get();
    this.membersTreeRoot.assertEquals(membersTreeRoot);
    // Assert member being part of the tree
    path.calculateRoot(memberHash).assertEquals(membersTreeRoot, 'Invalid witness.');
  }

  /**
   * @notice Function to assert votes and set new voteActionsHash
   * @dev Called by cancel and execute functions
   * @param voteType value of vote that is in favor of action we want to make
   */
  assertVotesAndSetActionsHash(voteType: Field) {
    // Assert minimalQuorum
    const minimalQuorum = this.minimalQuorum.get();
    this.minimalQuorum.assertEquals(minimalQuorum);

    // Get vote count and latest actions hash
    const [votes, newVoteActionsHash] = this.countVotes(voteType);

    // Assert >= minimal quorum has voted in favor of your action
    votes.assertGte(minimalQuorum, "Minimal quorum not reached.");

    // Set new vote actions hash
    this.voteActionsHash.set(newVoteActionsHash);
  }

  /**
   * @notice Function to count over the votes of an active proposal
   * @param voteType value of vote that is in favor of action we want to make
   */
  countVotes(voteType: Field): Field[] {
    let voteActionsHash = this.voteActionsHash.get();
    this.voteActionsHash.assertEquals(voteActionsHash);

    let { state: voteCounter, actionsHash: newVoteActionsHash } =
      this.reducer.reduce(
        this.reducer.getActions({ fromActionHash: voteActionsHash }),
        Field,
        (state: Field, action: VoteAction) => {
          const increment = Circuit.if(
            action.vote.equals(voteType),
            Field(1),
            Field(0)
          );
          return state.add(increment);
        },
        { state: Field(0), actionsHash: voteActionsHash }
      );
    return [voteCounter, newVoteActionsHash];
  }

  /**
   * @notice Function to get the valid/latest merkle map root of active proposal votes
   * @returns current merkle map root of active proposal votes
   */
  getVotesMerkleMapRoot(): Field {
    let voteActionsHash = this.voteActionsHash.get();
    this.voteActionsHash.assertEquals(voteActionsHash);

    const { state: votesMerkleMapRoot } = this.reducer.reduce(
      this.reducer.getActions({ fromActionHash: voteActionsHash }),
      Field,
      (state: Field, action: VoteAction) => {
        return action.merkleMapRoot;
      },
      { state: new MerkleMap().getRoot(), actionsHash: voteActionsHash }
    );

    return votesMerkleMapRoot;
  }
}
