import {
  Field,
  SmartContract,
  UInt64,
  Bool,
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
  override: Bool,
}) {}

export class AnonMultiSigMock extends SmartContract {
  @state(Field) membersTreeRoot = State<Field>();
  @state(Field) minimalQuorum = State<Field>();
  @state(Field) proposalId = State<Field>(); // Acts as a nonce in signing flow
  @state(Field) proposalHash = State<Field>();
  @state(Field) voteActionState = State<Field>();

  reducer = Reducer({ actionType: VoteAction });

  deploy(args: DeployArgs) {
    super.deploy(args);
    this.account.permissions.set({
      ...Permissions.default(),
      editState: Permissions.proofOrSignature(),
    });
  }

  /**
   * @notice Mock method to enable reinitialization
   */
  @method reset() {
    const val: Field = Field(0);
    this.membersTreeRoot.set(val);
    this.minimalQuorum.set(val);
    this.proposalId.set(val);
    this.proposalHash.set(val);
  }

  /**
   * @notice Function to initialize 'AnonMultiSig' smart contract
   * @param membersTreeRoot is root of a merkle tree containing all members
   * @param minimalQuorum is minimal amount of votes needed to execute/cancel proposal
   */
  @method initialize(membersTreeRoot: Field, minimalQuorum: Field) {
    // Set proper permissions for non-upgradeable decentralized voting
    this.account.permissions.set({
      ...Permissions.default(),
      send: Permissions.proofOrSignature(),
      setDelegate: Permissions.proofOrSignature(), // TODO: Introduce stake delegation for AnonMultiSig
      setPermissions: Permissions.proofOrSignature(), // Disable permission changes
      setVerificationKey: Permissions.proofOrSignature(), // Make contract non-upgradeable
      setZkappUri: Permissions.proofOrSignature(),
      setTokenSymbol: Permissions.impossible(),
    });

    // Set initial voteActionState
    this.voteActionState.set(Reducer.initialActionState);

    // Set root
    const currentMembersTreeRoot: Field = this.membersTreeRoot.get();
    this.membersTreeRoot.assertEquals(currentMembersTreeRoot);
    currentMembersTreeRoot.equals(0).assertTrue();
    membersTreeRoot.equals(0).assertFalse('Members tree root cannot be empty.');
    this.membersTreeRoot.set(membersTreeRoot);

    // Set minimal quorum
    const currentMinimalQuorum: Field = this.minimalQuorum.get();
    this.minimalQuorum.assertEquals(currentMinimalQuorum);
    currentMinimalQuorum.equals(0).assertTrue();
    minimalQuorum.equals(0).assertFalse('Minimal quorum cannot be empty.');
    this.minimalQuorum.set(minimalQuorum);

    // Require zkApp signature
    this.requireSignature();
  }

  /**
   * @notice Function to make new proposal / initiate new voting session
   * @param member is user public key who's membership needs to be verified
   * @param path is proof of user belonging in the members tree
   * @param signature is administrator's confirmation signature
   * @param proposalHash is identification hash of proposed action
   */
  @method makeProposal(
    member: PublicKey,
    path: MyMerkleWitness,
    signature: Signature,
    proposalHash: Field
  ) {
    // Compute member PK hash
    const memberHash: Field = Poseidon.hash(member.toFields());

    // Verify membership
    this.verifyMembership(memberHash, path);

    // Assert proposal hash state is empty
    const currentProposalHash: Field = this.proposalHash.get();
    this.proposalHash.assertEquals(currentProposalHash);
    currentProposalHash.equals(0).assertTrue();

    // Assert new proposal hash is not empty field
    proposalHash.equals(0).assertFalse();

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
        override: Bool(false),
      })
    );

    // Define msg fields array with memberHash, proposalHash and Id
    let msg: Field[] = [
      proposalHash,
      newProposalId,
      ...CircuitString.fromString('propose').toFields(),
      ...this.address.toFields(),
    ];

    // Reconstruct signed message
    const msgHash: Field = Poseidon.hash(msg);

    // Verify Signature
    signature.verify(member, [msgHash]).assertTrue('Invalid signature.');

    // Set new proposal hash
    this.proposalHash.set(proposalHash);
  }

  /**
   * @notice Function to instantiate a vote on active proposal
   * @param member is user public key who's membership needs to be verified
   * @param path is proof of user belonging in the members tree
   * @param signature is administrator's confirmation signature
   * @param vote is users support for current proposal for/true or against/false
   */
  @method vote(
    member: PublicKey,
    path: MyMerkleWitness,
    signature: Signature,
    mapPath: MerkleMapWitness,
    value: Field,
    vote: Field
  ) {
    // Assert active proposal existance
    this.assertActiveProposal();

    // Compute member PK hash
    const memberHash: Field = Poseidon.hash(member.toFields());

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
      vote,
      proposalId,
      ...CircuitString.fromString('vote').toFields(),
      ...this.address.toFields(),
    ];

    // Reconstruct signed message
    const msgHash: Field = Poseidon.hash(msg);

    // Verify Signature
    signature.verify(member, [msgHash]).assertTrue('Invalid signature.');

    // Get current votes merkle map root
    const votesMerkleMapRoot = this.getVotesMerkleMapRoot();

    // Verify pair using witness
    const [witnessRoot, witnessKey] = mapPath.computeRootAndKey(value);
    votesMerkleMapRoot.assertEquals(witnessRoot, 'Invalid root.');
    memberHash.assertEquals(witnessKey, 'Invalid witness key.');

    // Get new merkle root
    const [newVotesMerkleMapRoot] = mapPath.computeRootAndKey(vote);

    // If previous value was not zero consider the vote overriden
    const override: Bool = Circuit.if(
      value.equals(Field(1)).or(value.equals(Field(2))),
      Bool(true),
      Bool(false)
    );

    // Dispatch new action
    this.reducer.dispatch(
      new VoteAction({
        proposalId,
        merkleMapRoot: newVotesMerkleMapRoot,
        vote,
        override,
      })
    );
  }

  /**
   * @notice Function to cancel active proposal
   * @dev Cancel is possible only when >= minimalQuorum of members has voted against the proposal
   * @param member is user public key who's membership needs to be verified
   * @param path is proof of user belonging in the members tree
   * @param signature is administrator's confirmation signature
   */
  @method cancel(
    member: PublicKey,
    path: MyMerkleWitness,
    signature: Signature
  ) {
    // Assert active proposal existance
    this.assertActiveProposal();

    // Assert minimal quorum has voted in favor of canceling the proposal
    this.assertVotesAndSetActionsHash(Field(2));

    // Compute member PK hash
    const memberHash: Field = Poseidon.hash(member.toFields());

    // Verify membership
    this.verifyMembership(memberHash, path);

    // Assert current proposal id
    const proposalId: Field = this.proposalId.get();
    this.proposalId.assertEquals(proposalId);

    // Define msg fields array with memberHash, vote and proposalId
    let msg: Field[] = [
      proposalId,
      ...CircuitString.fromString('cancel').toFields(),
      ...this.address.toFields(),
    ];

    // Reconstruct signed message
    const msgHash: Field = Poseidon.hash(msg);

    // Verify Signature
    signature.verify(member, [msgHash]).assertTrue('Invalid signature.');

    // Empty the proposal hash state
    this.proposalHash.set(Field(0));
  }

  /**
   * @notice Function to execute active proposal
   * @dev Execution is possible only when >= minimalQuorum of members has voted for the proposal
   * @param member is user public key who's membership needs to be verified
   * @param path is proof of user belonging in the members tree
   * @param signature is administrator's confirmation signature
   * @param to account receiving proposed funds
   * @param amount proposed funds
   */
  @method execute(
    member: PublicKey,
    path: MyMerkleWitness,
    signature: Signature,
    to: PublicKey,
    amount: UInt64
  ) {
    // Assert minimal quorum has voted in favor of proposal execution
    this.assertVotesAndSetActionsHash(Field(1));

    // Compute member PK hash
    const memberHash: Field = Poseidon.hash(member.toFields());

    // Verify membership
    this.verifyMembership(memberHash, path);

    // Assert current proposal id
    const proposalId: Field = this.proposalId.get();
    this.proposalId.assertEquals(proposalId);

    // Define msg fields array with memberHash, vote and proposalId
    let msg: Field[] = [
      proposalId,
      ...CircuitString.fromString('execute').toFields(),
      ...this.address.toFields(),
    ];

    // Reconstruct signed message
    const msgHash: Field = Poseidon.hash(msg);

    // Verify Signature
    signature.verify(member, [msgHash]).assertTrue('Invalid signature.');

    // Assert proposalHash
    const proposalHash: Field = this.proposalHash.get();
    this.proposalHash.assertEquals(proposalHash);
    proposalHash.equals(0).assertFalse();

    // Assert provided proposal data
    const computedProposalHash = Poseidon.hash([
      ...to.toFields(),
      ...amount.toFields(),
    ]);
    this.proposalHash.assertEquals(computedProposalHash);

    // Make sure contract has enough balance
    this.account.balance.assertBetween(amount, UInt64.MAXINT());

    // Make proposed transaction
    this.send({ to, amount });

    // Empty the proposal hash state
    this.proposalHash.set(Field(0));
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
    path
      .calculateRoot(memberHash)
      .assertEquals(membersTreeRoot, 'Invalid witness.');
  }

  /**
   * @notice Function to assert votes and set new voteActionState
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
    votes.assertGreaterThanOrEqual(
      minimalQuorum,
      'Minimal quorum not reached.'
    );

    // Set new vote actions hash
    this.voteActionState.set(newVoteActionsHash);
  }

  /**
   * @notice Function to count over the votes of an active proposal
   * @param voteType value of vote that is in favor of action we want to make
   */
  countVotes(voteType: Field): Field[] {
    let voteActionState = this.voteActionState.get();
    this.voteActionState.assertEquals(voteActionState);

    const reverseVote = Circuit.if(
      voteType.equals(Field(1)),
      Field(2),
      Field(1)
    );

    let { state: voteCounter, actionState: newVoteActionsHash } =
      this.reducer.reduce(
        this.reducer.getActions({ fromActionState: voteActionState }),
        Field,
        (state: Field, action: VoteAction) => {
          return Circuit.if(
            action.vote.equals(voteType),
            state.add(Field(1)),
            Circuit.if(
              action.vote
                .equals(reverseVote)
                .and(action.override.equals(Bool(true))),
              state.sub(Field(1)),
              state
            )
          );
        },
        { state: Field(0), actionState: voteActionState }
      );
    return [voteCounter, newVoteActionsHash];
  }

  /**
   * @notice Function to get the valid/latest merkle map root of active proposal votes
   * @returns current merkle map root of active proposal votes
   */
  getVotesMerkleMapRoot(): Field {
    let voteActionState = this.voteActionState.get();
    this.voteActionState.assertEquals(voteActionState);

    const { state: votesMerkleMapRoot } = this.reducer.reduce(
      this.reducer.getActions({ fromActionState: voteActionState }),
      Field,
      (state: Field, action: VoteAction) => {
        return action.merkleMapRoot;
      },
      { state: new MerkleMap().getRoot(), actionState: voteActionState }
    );

    return votesMerkleMapRoot;
  }

  /**
   * @notice Function to make sure that an active proposal exists
   */
  assertActiveProposal() {
    let proposalHash = this.proposalHash.get();
    this.proposalHash.assertEquals(proposalHash);
    proposalHash.equals(0).assertFalse();
  }
}
