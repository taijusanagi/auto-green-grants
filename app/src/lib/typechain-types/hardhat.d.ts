/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import { FactoryOptions, HardhatEthersHelpers as HardhatEthersHelpersBase } from "@nomiclabs/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "Initializable",
      signerOrOptions?: ethers.Signer | FactoryOptions,
    ): Promise<Contracts.Initializable__factory>;
    getContractFactory(
      name: "IERC20Upgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions,
    ): Promise<Contracts.IERC20Upgradeable__factory>;
    getContractFactory(
      name: "AccessControl",
      signerOrOptions?: ethers.Signer | FactoryOptions,
    ): Promise<Contracts.AccessControl__factory>;
    getContractFactory(
      name: "IAccessControl",
      signerOrOptions?: ethers.Signer | FactoryOptions,
    ): Promise<Contracts.IAccessControl__factory>;
    getContractFactory(
      name: "ERC165",
      signerOrOptions?: ethers.Signer | FactoryOptions,
    ): Promise<Contracts.ERC165__factory>;
    getContractFactory(
      name: "IERC165",
      signerOrOptions?: ethers.Signer | FactoryOptions,
    ): Promise<Contracts.IERC165__factory>;
    getContractFactory(
      name: "Allo",
      signerOrOptions?: ethers.Signer | FactoryOptions,
    ): Promise<Contracts.Allo__factory>;
    getContractFactory(
      name: "Anchor",
      signerOrOptions?: ethers.Signer | FactoryOptions,
    ): Promise<Contracts.Anchor__factory>;
    getContractFactory(
      name: "IAllo",
      signerOrOptions?: ethers.Signer | FactoryOptions,
    ): Promise<Contracts.IAllo__factory>;
    getContractFactory(
      name: "IRegistry",
      signerOrOptions?: ethers.Signer | FactoryOptions,
    ): Promise<Contracts.IRegistry__factory>;
    getContractFactory(
      name: "IStrategy",
      signerOrOptions?: ethers.Signer | FactoryOptions,
    ): Promise<Contracts.IStrategy__factory>;
    getContractFactory(
      name: "Native",
      signerOrOptions?: ethers.Signer | FactoryOptions,
    ): Promise<Contracts.Native__factory>;
    getContractFactory(
      name: "Transfer",
      signerOrOptions?: ethers.Signer | FactoryOptions,
    ): Promise<Contracts.Transfer__factory>;
    getContractFactory(
      name: "Registry",
      signerOrOptions?: ethers.Signer | FactoryOptions,
    ): Promise<Contracts.Registry__factory>;
    getContractFactory(
      name: "BaseStrategy",
      signerOrOptions?: ethers.Signer | FactoryOptions,
    ): Promise<Contracts.BaseStrategy__factory>;
    getContractFactory(
      name: "DirectGrantsSimpleStrategy",
      signerOrOptions?: ethers.Signer | FactoryOptions,
    ): Promise<Contracts.DirectGrantsSimpleStrategy__factory>;
    getContractFactory(
      name: "CarbonOffset",
      signerOrOptions?: ethers.Signer | FactoryOptions,
    ): Promise<Contracts.CarbonOffset__factory>;
    getContractFactory(
      name: "Ownable",
      signerOrOptions?: ethers.Signer | FactoryOptions,
    ): Promise<Contracts.Ownable__factory>;
    getContractFactory(
      name: "ERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions,
    ): Promise<Contracts.ERC20__factory>;
    getContractFactory(
      name: "CREATE3",
      signerOrOptions?: ethers.Signer | FactoryOptions,
    ): Promise<Contracts.CREATE3__factory>;
    getContractFactory(
      name: "SafeTransferLib",
      signerOrOptions?: ethers.Signer | FactoryOptions,
    ): Promise<Contracts.SafeTransferLib__factory>;

    getContractAt(name: "Initializable", address: string, signer?: ethers.Signer): Promise<Contracts.Initializable>;
    getContractAt(
      name: "IERC20Upgradeable",
      address: string,
      signer?: ethers.Signer,
    ): Promise<Contracts.IERC20Upgradeable>;
    getContractAt(name: "AccessControl", address: string, signer?: ethers.Signer): Promise<Contracts.AccessControl>;
    getContractAt(name: "IAccessControl", address: string, signer?: ethers.Signer): Promise<Contracts.IAccessControl>;
    getContractAt(name: "ERC165", address: string, signer?: ethers.Signer): Promise<Contracts.ERC165>;
    getContractAt(name: "IERC165", address: string, signer?: ethers.Signer): Promise<Contracts.IERC165>;
    getContractAt(name: "Allo", address: string, signer?: ethers.Signer): Promise<Contracts.Allo>;
    getContractAt(name: "Anchor", address: string, signer?: ethers.Signer): Promise<Contracts.Anchor>;
    getContractAt(name: "IAllo", address: string, signer?: ethers.Signer): Promise<Contracts.IAllo>;
    getContractAt(name: "IRegistry", address: string, signer?: ethers.Signer): Promise<Contracts.IRegistry>;
    getContractAt(name: "IStrategy", address: string, signer?: ethers.Signer): Promise<Contracts.IStrategy>;
    getContractAt(name: "Native", address: string, signer?: ethers.Signer): Promise<Contracts.Native>;
    getContractAt(name: "Transfer", address: string, signer?: ethers.Signer): Promise<Contracts.Transfer>;
    getContractAt(name: "Registry", address: string, signer?: ethers.Signer): Promise<Contracts.Registry>;
    getContractAt(name: "BaseStrategy", address: string, signer?: ethers.Signer): Promise<Contracts.BaseStrategy>;
    getContractAt(
      name: "DirectGrantsSimpleStrategy",
      address: string,
      signer?: ethers.Signer,
    ): Promise<Contracts.DirectGrantsSimpleStrategy>;
    getContractAt(name: "CarbonOffset", address: string, signer?: ethers.Signer): Promise<Contracts.CarbonOffset>;
    getContractAt(name: "Ownable", address: string, signer?: ethers.Signer): Promise<Contracts.Ownable>;
    getContractAt(name: "ERC20", address: string, signer?: ethers.Signer): Promise<Contracts.ERC20>;
    getContractAt(name: "CREATE3", address: string, signer?: ethers.Signer): Promise<Contracts.CREATE3>;
    getContractAt(name: "SafeTransferLib", address: string, signer?: ethers.Signer): Promise<Contracts.SafeTransferLib>;

    // default types
    getContractFactory(name: string, signerOrOptions?: ethers.Signer | FactoryOptions): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.utils.BytesLike,
      signer?: ethers.Signer,
    ): Promise<ethers.ContractFactory>;
    getContractAt(nameOrAbi: string | any[], address: string, signer?: ethers.Signer): Promise<ethers.Contract>;
  }
}