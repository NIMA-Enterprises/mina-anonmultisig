import { generateVoteMessageHash } from "./steps/1/generateVoteMessageHash";
import { signMessage } from "./steps/2/signMessage";
import { generateTxProof } from "./steps/3/generateTxProof";
import { sendTx } from "./steps/4/sendTx";

const step1 = { generateVoteMessageHash };
const step2 = { signMessage };
const step3 = { generateTxProof };
const step4 = { sendTx };

const vote = { step1, step2, step3, step4 };

export { vote };

export * from "./withoutSteps";
