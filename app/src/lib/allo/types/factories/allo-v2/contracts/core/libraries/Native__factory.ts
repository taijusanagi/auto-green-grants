/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../../common";
import type {
  Native,
  NativeInterface,
} from "../../../../../allo-v2/contracts/core/libraries/Native";

const _abi = [
  {
    inputs: [],
    name: "NATIVE",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b5060eb8061001f6000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c8063a0cf0aea14602d575b600080fd5b60336047565b604051603e9190609c565b60405180910390f35b73eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee81565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000608882605f565b9050919050565b609681607f565b82525050565b600060208201905060af6000830184608f565b9291505056fea2646970667358221220b2afa411d8e94eb7adee30d5f9a42af38ea98bcd85084e1efbfd3120e31936f664736f6c63430008130033";

type NativeConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: NativeConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Native__factory extends ContractFactory {
  constructor(...args: NativeConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<Native> {
    return super.deploy(overrides || {}) as Promise<Native>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): Native {
    return super.attach(address) as Native;
  }
  override connect(signer: Signer): Native__factory {
    return super.connect(signer) as Native__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): NativeInterface {
    return new utils.Interface(_abi) as NativeInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Native {
    return new Contract(address, _abi, signerOrProvider) as Native;
  }
}