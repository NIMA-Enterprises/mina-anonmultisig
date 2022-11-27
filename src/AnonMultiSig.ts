import {
  Field,
  SmartContract,
  Bool,
  state,
  State,
  method,
  DeployArgs,
  Permissions,
  PrivateKey,
  Signature,
  PublicKey,
  Circuit,
  CircuitString
} from 'snarkyjs';

export class AnonMultiSig extends SmartContract {
  @state(Field) num = State<Field>();
  @state(Field) nonce = State<Field>();
  @state(Field) root = State<Field>();
  @state(PublicKey) admin = State<PublicKey>();
  
  deploy(args: DeployArgs) {
    super.deploy(args);
    this.setPermissions({
      ...Permissions.default(),
      editState: Permissions.proofOrSignature(),
    });
  }

  @method init(zkappKey: PrivateKey) {
    super.init(zkappKey);
    this.num.set(Field(1));
    this.requireSignature();
  }

  @method setAdmin(admin: PublicKey) {
    const currentAdmin: PublicKey = this.admin.get();
    this.admin.assertEquals(currentAdmin);
    this.admin.set(Circuit.if(currentAdmin.isEmpty(), admin, currentAdmin));
    this.requireSignature();
  }

  // Make sure admin signed the update value
  @method update(signature: Signature, num: Field) {
    // Make sure admin is set
    const admin = this.admin.get();
    this.admin.assertEquals(admin);
    const isAdminSet: Bool = admin.isEmpty();
    isAdminSet.assertTrue;
    // Secure states
    const currentStateNum: Field = this.num.get();
    this.num.assertEquals(currentStateNum);
    const currentStateNonce: Field = this.nonce.get();
    this.nonce.assertEquals(currentStateNonce);
    // Compute signed message
    const msg: CircuitString = CircuitString.fromString(num.toString().concat(currentStateNonce.toString()));
    const msgHash: Field = msg.hash();
    // Verify signature
    const success = signature.verify(admin, msgHash.toFields());
    success.assertTrue;
    // Set new states
    this.nonce.set(currentStateNonce.add(1));
    this.num.set(num);
  }
}
