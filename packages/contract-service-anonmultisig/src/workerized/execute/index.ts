import { generateExecuteMessageHash } from "./steps/1/generateExecuteMessageHash";
import { signMessage } from "./steps/2/signMessage";
import { generateTxProof } from "./steps/3/generateTxProof";
import { sendTx } from "./steps/4/sendTx";

const step1 = { generateExecuteMessageHash };
const step2 = { signMessage };
const step3 = { generateTxProof };
const step4 = { sendTx };

const execute = { step1, step2, step3, step4 };

export { execute };
export * from "./withoutSteps";
