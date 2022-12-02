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
  Circuit
} from 'snarkyjs';

export class AnonMultiSig extends SmartContract {

  @state(PublicKey) admin = State<PublicKey>();
  @state(Field) membersTreeRoot = State<Field>();
  @state(Field) numberOfMembers = State<Field>();
  @state(Field) minimalQuorum = State<Field>();
  @state(Field) currentProposalId = State<Field>();
  @state(Field) currentProposalHash = State<Field>();
  @state(Field) currentProposalVotes = State<Field>();
  
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
  @method initialize(admin: PublicKey, membersTreeRoot: Field, numberOfMembers: Field, minimalQuorum: Field) {
    // Set root
    const currentMembersTreeRoot: Field = this.membersTreeRoot.get();
    this.membersTreeRoot.assertEquals(currentMembersTreeRoot);
    currentMembersTreeRoot.assertEquals(Field(0));
    membersTreeRoot.assertGt(Field(0));
    this.membersTreeRoot.set(membersTreeRoot);

    // Set admin
    const currentAdmin: PublicKey = this.admin.get();
    this.admin.assertEquals(currentAdmin);
    currentAdmin.isEmpty().assertTrue();
    admin.isEmpty().assertFalse();
    this.admin.set(admin);

    // Set initial number of members
    const currentNumberOfMembers: Field = this.numberOfMembers.get();
    this.numberOfMembers.assertEquals(currentNumberOfMembers);
    currentNumberOfMembers.assertEquals(Field(0));
    numberOfMembers.assertGt(Field(0));
    numberOfMembers.assertLte(Field(182));
    this.numberOfMembers.set(Field(numberOfMembers));

    // Set minimal quorum
    const currentMinimalQuorum: Field = this.minimalQuorum.get();
    this.minimalQuorum.assertEquals(currentMinimalQuorum);
    currentMinimalQuorum.assertEquals(Field(0));
    minimalQuorum.assertGt(Field(0));
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
  @method setAdmin(newAdmin: PublicKey, signature: Signature, expirationTimestamp: UInt64) {
    // Get and assert current admin
    const currentAdmin: PublicKey = this.admin.get();
    this.admin.assertEquals(currentAdmin);

    // Require that new admin is not empty
    newAdmin.isEmpty().assertFalse();
    // Require new admin is different than the current one
    currentAdmin.equals(newAdmin).assertFalse();

    // Reconstruct signed message
    const msg: Field = CircuitString.fromString(
      newAdmin.toString().concat(expirationTimestamp.toString())
    ).hash();

    // Make sure signature is valid
    const isSignatureValid: Bool = signature.verify(currentAdmin, [msg]);
    isSignatureValid.assertTrue;

    // Require signature has not expired
    this.network.timestamp.assertBetween(UInt64.from(0), expirationTimestamp);

    // Set new admin
    this.admin.set(newAdmin);
  }

}