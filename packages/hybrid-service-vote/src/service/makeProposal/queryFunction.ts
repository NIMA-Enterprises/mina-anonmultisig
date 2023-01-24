import {
	getMakeProposalSignatureFromBackend,
	getMakeProposalWitnessFromBackend,
} from "backend-service-vote";
import {
	makeProposal as makeProposalContract,
	readStateFields,
} from "contract-service-anonmultisig";
import { signMessage } from "sign-service";
import { CircuitString, Field, Poseidon, PublicKey } from "snarkyjs";

const hardcodedPathAsObject = [
	{
		isLeft: true,
		sibling:
			"23018549125151146874832608887669070204369450261821386062945895982172304006916",
	},
	{
		isLeft: true,
		sibling:
			"8668339813318260132234794571259155386044964323701460753057328213701504228653",
	},
	{
		isLeft: true,
		sibling:
			"2447983280988565496525732146838829227220882878955914181821218085513143393976",
	},
	{
		isLeft: true,
		sibling:
			"544619463418997333856881110951498501703454628897449993518845662251180546746",
	},
	{
		isLeft: true,
		sibling:
			"20468198949394563802460512965219839480612000520504690501918527632215047268421",
	},
	{
		isLeft: true,
		sibling:
			"16556836945641263257329399459944072214107361158323688202689648863681494824075",
	},
	{
		isLeft: true,
		sibling:
			"15433636137932294330522564897643259724602670702144398296133714241278885195605",
	},
];

const signMakeProposal = async ({
	memberPublicKeyString,
	contractAddress,
}: {
	memberPublicKeyString: string;
	contractAddress: string;
}) => {
	const proposalHash: Field = CircuitString.fromString("Test1").hash();
	const memberHash = Poseidon.hash(
		PublicKey.fromBase58(memberPublicKeyString).toFields(),
	);
	const { proposalId } = await readStateFields({
		contractAddress,
	});

	const message = Poseidon.hash([
		memberHash,
		proposalHash,
		proposalId,
		...PublicKey.fromBase58(contractAddress).toFields(),
	]).toString();

	console.log({
		"where": "signMakeProposal",
		memberHash,
		proposalHash,
		proposalId,
		"PublicKey.fromBase58(contractAddress).toFields()":
			PublicKey.fromBase58(contractAddress).toFields(),
	});

	const signature = await signMessage({ message });

	return { signature, message, proposalHash, memberHash, proposalId };
};

const makeProposal = async ({
	memberPublicKeyString,
	contractAddress,
}: {
	memberPublicKeyString: string;
	contractAddress: string;
}) => {
	const { message, signature: clientSignature } = await signMakeProposal({
		memberPublicKeyString,
		contractAddress,
	});

	console.log({ clientSignature });

	const { signature: backendSignature } =
		await getMakeProposalSignatureFromBackend({
			signature: clientSignature,
			userAddress: memberPublicKeyString,
			message,
		});

	console.log({ clientSignature, backendSignature });

	const pathAsObject = await getMakeProposalWitnessFromBackend({
		memberSlot: 3,
		membersAsTreeHash: [
			"9794717151907877491130547487159084488860951500526287861484343000356746805262",
			"7184638548920122554848146653618293028991673482369627447784523928859087497580",
			"9890227877459599186545630513334637692696672008293094748028883479122359986285",
			"13967865996993149057597971750733889585078557392624882243815826449893072304183",
		],
	});

	await makeProposalContract({
		admin: "B62qrjGayCU1U4xAmzDfUVxMsf2FEuXNWn6VyuhDi5QuGUf7Ukh5gZ4",
		contractAddress,
		memberPkString: memberPublicKeyString,
		pathAsObject: pathAsObject.result.map(({ isLeft, sibling }) => ({
			isLeft,
			sibling: Field.fromJSON(sibling),
		})),
		signature: backendSignature,
	});
};

declare global {
	interface Window {
		makeProposal: typeof makeProposal;
	}
}

window.makeProposal = makeProposal;

export { makeProposal };
