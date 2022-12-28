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
  CircuitString,
  MerkleWitness,
  Poseidon,
  Encoding
} from 'snarkyjs';

class MyMerkleWitness extends MerkleWitness(8) {}

export class AnonMultiSig extends SmartContract {

  @state(Field) admin = State<Field>();
  @state(Field) membersTreeRoot = State<Field>();
  @state(Field) numberOfMembers = State<Field>();
  @state(Field) minimalQuorum = State<Field>();
  @state(Field) proposalId = State<Field>();
  @state(Field) proposalHash = State<Field>();
  @state(Field) proposalVotes = State<Field>();
  
  deploy(args: DeployArgs) {
    super.deploy(args);
    this.setPermissions({
      ...Permissions.default(),
      editState: Permissions.proofOrSignature(),
      // setVerificationKey: Permissions.impossible() // Make contract non-upgradeable
    });
  }

  /**
   * @notice Function to initialize 'AnonMultiSig' smart contract
   * @param admin is public key of initial administrator
   * @param membersTreeRoot is root of a merkle tree containing all members
   * @param numberOfMembers is number of members contained in the tree
   * @param minimalQuorum is minimal amount of votes needed to execute/cancel proposal
   * @dev 182 is maximum number of votes that can be fit into single word of memory
   */
  @method initialize(admin: Field, membersTreeRoot: Field, numberOfMembers: Field, minimalQuorum: Field) {
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

    // Set initial number of members
    const currentNumberOfMembers: Field = this.numberOfMembers.get();
    this.numberOfMembers.assertEquals(currentNumberOfMembers);
    currentNumberOfMembers.isZero().assertTrue();
    numberOfMembers.isZero().assertFalse();
    numberOfMembers.assertLte(Field(182));
    this.numberOfMembers.set(Field(numberOfMembers));

    // Set minimal quorum
    const currentMinimalQuorum: Field = this.minimalQuorum.get();
    this.minimalQuorum.assertEquals(currentMinimalQuorum);
    currentMinimalQuorum.isZero().assertTrue();
    minimalQuorum.isZero().assertFalse();
    minimalQuorum.assertLt(numberOfMembers);
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
  @method setAdmin(oldAdmin: PublicKey, newAdmin: Field, signature: Signature, expirationTimestamp: UInt64) {
    // Get and assert current admin
    const currentAdmin: Field = this.admin.get();
    this.admin.assertEquals(currentAdmin);
    currentAdmin.assertEquals(CircuitString.fromString(oldAdmin.toBase58()).hash());

    // Require that new admin is not empty
    newAdmin.isZero().assertFalse();
    // Require new admin is different than the current one
    currentAdmin.equals(newAdmin).assertFalse();

    // Reconstruct signed message
    const msg: Field = Poseidon.hash(
      Encoding.stringToFields(
        newAdmin.toString().concat(expirationTimestamp.toString()).concat(this.address.toBase58())
      )
    );

    // Make sure signature is valid
    const isSignatureValid: Bool = signature.verify(oldAdmin, [msg]);
    isSignatureValid.assertTrue();

    // Require signature has not expired
    this.network.timestamp.assertBetween(UInt64.from(0), expirationTimestamp);

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
  @method makeProposal(admin: PublicKey, memberHash: Field, path: MyMerkleWitness, signature: Signature, proposalHash: Field) {
    // Verify admin
    const contractAdmin: Field = this.admin.get();
    this.admin.assertEquals(contractAdmin);
    contractAdmin.assertEquals(CircuitString.fromString(admin.toBase58()).hash());

    // Assert current root
    const membersTreeRoot: Field = this.membersTreeRoot.get();
    this.membersTreeRoot.assertEquals(membersTreeRoot);

    // Assert member being part of the tree
    path.calculateRoot(memberHash).assertEquals(membersTreeRoot);

    // Assert votes state is empty
    const proposalVotes: Field = this.proposalVotes.get();
    this.proposalVotes.assertEquals(proposalVotes);
    proposalVotes.isZero().assertTrue();

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

    // Reconstruct signed message
    const msg: Field = Poseidon.hash(
      Encoding.stringToFields(
        memberHash.toString().concat(proposalHash.toString()).concat(newProposalId.toString()).concat(this.address.toBase58())
      )
    );

    // Verify Signature
    signature.verify(admin, [msg]).assertTrue();

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
  @method vote(admin: PublicKey, memberHash: Field, path: MyMerkleWitness, signature: Signature, vote: Field) {
    // Verify admin
    const contractAdmin: Field = this.admin.get();
    this.admin.assertEquals(contractAdmin);
    contractAdmin.assertEquals(CircuitString.fromString(admin.toBase58()).hash());

    // Assert current root
    const membersTreeRoot: Field = this.membersTreeRoot.get();
    this.membersTreeRoot.assertEquals(membersTreeRoot);

    // Assert member being part of the tree
    path.calculateRoot(memberHash).assertEquals(membersTreeRoot);

    // Assert current proposal id
    const proposalId: Field = this.proposalId.get();
    this.proposalId.assertEquals(proposalId);

    // Reconstruct signed message
    const msg: Field = Poseidon.hash(
      Encoding.stringToFields(
        memberHash.toString().concat(vote.toString()).concat(proposalId.toString()).concat(this.address.toBase58())
      )
    );

    // Verify Signature
    signature.verify(admin, [msg]).assertTrue();

    // Assert current votes state
    const proposalVotes: Field = this.proposalVotes.get();
    this.proposalVotes.assertEquals(proposalVotes);

    // TODO: Check if user already voted

    // TODO: Assign vote value to specific bit pair in votes state

    // TODO: Introduce reducers in order to enable multiple vote actions in the same block

    // Set new proposal hash
    this.proposalVotes.set(proposalVotes);
  }
}