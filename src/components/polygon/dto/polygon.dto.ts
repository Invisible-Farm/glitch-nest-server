import { SymbolName } from '../../../core/common/common.enums';

export class MintInput {
  fileInfoId: string;
  recipient: string;
  symbol: SymbolName;
}
export class MintResultOutput {
  fileInfoId: string;
  tokenId: string;
  txHash: string;
  symbol: SymbolName;
}
