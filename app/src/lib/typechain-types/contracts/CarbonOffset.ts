/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "../common";

export interface CarbonOffsetInterface extends utils.Interface {
  functions: {
    "purchase()": FunctionFragment;
    "recipient()": FunctionFragment;
  };

  getFunction(nameOrSignatureOrTopic: "purchase" | "recipient"): FunctionFragment;

  encodeFunctionData(functionFragment: "purchase", values?: undefined): string;
  encodeFunctionData(functionFragment: "recipient", values?: undefined): string;

  decodeFunctionResult(functionFragment: "purchase", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "recipient", data: BytesLike): Result;

  events: {
    "Purchase(address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Purchase"): EventFragment;
}

export interface PurchaseEventObject {
  _buyer: string;
  _amount: BigNumber;
}
export type PurchaseEvent = TypedEvent<[string, BigNumber], PurchaseEventObject>;

export type PurchaseEventFilter = TypedEventFilter<PurchaseEvent>;

export interface CarbonOffset extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: CarbonOffsetInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined,
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(eventFilter?: TypedEventFilter<TEvent>): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(eventFilter: TypedEventFilter<TEvent>): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    purchase(overrides?: PayableOverrides & { from?: PromiseOrValue<string> }): Promise<ContractTransaction>;

    recipient(overrides?: CallOverrides): Promise<[string]>;
  };

  purchase(overrides?: PayableOverrides & { from?: PromiseOrValue<string> }): Promise<ContractTransaction>;

  recipient(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    purchase(overrides?: CallOverrides): Promise<void>;

    recipient(overrides?: CallOverrides): Promise<string>;
  };

  filters: {
    "Purchase(address,uint256)"(_buyer?: PromiseOrValue<string> | null, _amount?: null): PurchaseEventFilter;
    Purchase(_buyer?: PromiseOrValue<string> | null, _amount?: null): PurchaseEventFilter;
  };

  estimateGas: {
    purchase(overrides?: PayableOverrides & { from?: PromiseOrValue<string> }): Promise<BigNumber>;

    recipient(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    purchase(overrides?: PayableOverrides & { from?: PromiseOrValue<string> }): Promise<PopulatedTransaction>;

    recipient(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}