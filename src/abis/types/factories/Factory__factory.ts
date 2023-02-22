/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { Factory, FactoryInterface } from "../Factory";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
    ],
    name: "TokenCreated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
    ],
    name: "deployToken",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class Factory__factory {
  static readonly abi = _abi;
  static createInterface(): FactoryInterface {
    return new utils.Interface(_abi) as FactoryInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Factory {
    return new Contract(address, _abi, signerOrProvider) as Factory;
  }
}
