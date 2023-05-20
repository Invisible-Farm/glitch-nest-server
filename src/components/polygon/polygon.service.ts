import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BigNumber, ethers } from 'ethers';
import { createAlchemyWeb3 } from '@alch/alchemy-web3';
import * as path from 'path';
import * as fs from 'fs';
import { Token } from 'quickswap-sdk';
import { getCurDateString, sendPostRequest2 } from "../../core/utils/utils";
import { SymbolName } from '../../core/common/common.enums';
import { MintInput, MintResultOutput } from "./dto/polygon.dto";

@Injectable()
export class PolygonService {
  private readonly networkInfo: any;
  private readonly polygonProvider: any;
  private readonly alchWeb3: any;
  private readonly erc721Iface: any;
  private readonly gftContract: any;
  private readonly iftContract: any;
  private readonly psbtContract: any;
  private readonly GFT: Token;
  private readonly IFT: Token;
  private readonly PSBT: Token;
  private readonly ownerInfo: any;
  constructor(private readonly configService: ConfigService) {
    this.networkInfo = configService.get('networkInfo');
    this.polygonProvider = new ethers.providers.JsonRpcProvider(
      this.networkInfo.polygonNodeUrl,
    );
    this.alchWeb3 = createAlchemyWeb3(this.networkInfo.polygonNodeUrl);

    const erc721JsonPath = path.join('src/abis/ERC721.json');
    if (!fs.existsSync(erc721JsonPath)) {
      console.log(`${erc721JsonPath} does not exist.`);
    }
    const { abi: erc721abi } = JSON.parse(fs.readFileSync(erc721JsonPath).toString());
    this.erc721Iface = new ethers.utils.Interface(erc721abi);

    this.gftContract = new ethers.Contract(this.networkInfo.gftAddress, erc721abi, this.polygonProvider);
    this.iftContract = new ethers.Contract(this.networkInfo.iftAddress, erc721abi, this.polygonProvider);
    this.psbtContract = new ethers.Contract(this.networkInfo.psbtAddress, erc721abi, this.polygonProvider);

    // this.GFT = new Token(this.networkInfo.polygonChainId, this.networkInfo.gftAddress, 18, 'GFT', 'gft');
    this.ownerInfo = configService.get('ownerInfo');
  }
  async getBalance() {
    const gftName = await this.gftContract.name();
    const iftName = await this.iftContract.name();
    const psbtName = await this.psbtContract.name();
    console.log(`
    gftName: ${gftName}
    iftName: ${iftName}
    psbtName: ${psbtName}
    `);
    return { value: 123 };
  }
  async mint({ fileInfoId, symbol, recipient }: MintInput) {
    console.log(`==== NFT Mint start: ${getCurDateString()} ====`);
    const from = this.ownerInfo.ownerAddress;
    const privateKey = this.ownerInfo.ownerPriv;

    const valueBN = BigNumber.from(0);
    const data = this.erc721Iface.encodeFunctionData('mint', [recipient]);
    let txHash = '';
    // GFT
    if (symbol === SymbolName.GFT) {
      txHash = await this.sendNftTx(this.alchWeb3, from, this.networkInfo.gftAddress, privateKey, valueBN, data, fileInfoId, symbol);
    }
    // IFT
    else if (symbol === SymbolName.IFT) {
      txHash = await this.sendNftTx(this.alchWeb3, from, this.networkInfo.iftAddress, privateKey, valueBN, data, fileInfoId, symbol);
    }
    // PSBT
    else if (symbol === SymbolName.PSBT) {
      txHash = await this.sendNftTx(this.alchWeb3, from, this.networkInfo.psbtAddress, privateKey, valueBN, data, fileInfoId, symbol);
    } else {
      console.log(`symbol(${symbol}) does not supported`);
    }
    return { txHash };
  }

  async sendNftTx(web3, from, to, priv, valueBN, data, fileInfoId, symbol) {
    try {
      const estimatedGas = await web3.eth.estimateGas({ from, to, value: valueBN.toString(), data });
      const price = await web3.eth.getMaxPriorityFeePerGas();

      const addTip50gwei = ethers.utils.parseUnits('50', 'gwei');
      const addedPrice = BigNumber.from(price).add(addTip50gwei);
      console.log(`estimatedGas: ${estimatedGas + 20_000}, maxPriorityFeePerGas: ${ethers.utils.formatUnits(price, 'gwei')} gwei, addedPrice: ${ethers.utils.formatUnits(addedPrice, 'gwei')} gwei, value: ${ethers.utils.formatEther(valueBN)} MATIC`);
      const fields = {
        type: 2,
        gas: estimatedGas + 20_000,
        maxPriorityFeePerGas: addedPrice.toString(),
        from,
        to,
        value: valueBN.toString(),
        data,
      };
      console.log('field:', fields);

      const signedTx = await this.signTx(web3, from, priv, fields);
      console.log('txHash:', signedTx.transactionHash);
      web3.eth.sendSignedTransaction(signedTx.rawTransaction)
        .then((res) => {
          console.log(`${getCurDateString()} sendNftTx:: fileInfoId: ${fileInfoId} txHash: ${res.transactionHash}, gasUsded: ${res.gasUsed}, status: ${res.status}`);
          let tokenId = '';
          for (const log of res.logs) {
            if (log.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef') { // Transfer event
              tokenId = parseInt(String(Number(log.topics[3]))).toString();
              break;
            }
          }
          const statusChangeUrl = `http://1.234.5.209:10010/polygon/mint`;
          const mintResultOutput: MintResultOutput = {
            fileInfoId,
            tokenId,
            txHash: signedTx.transactionHash,
            symbol,
          };
          sendPostRequest2(statusChangeUrl, mintResultOutput);
          console.log(`==== NFT Mint end  : ${getCurDateString()} ====`);
        })
        .catch((e) => {
          console.log('sendSignedTransaction catch', e.toString());
        });
      return signedTx.transactionHash;
    } catch (e) {
      console.log(e.toString());
      throw e;
    }
  }
  async signTx(web3, from, priv, fields = {}) {
    try {
      const nonce = await web3.eth.getTransactionCount(from, 'latest');
      console.log(`nonce: ${nonce.toString(10)}`);
      const transaction = {
        nonce: nonce,
        ...fields,
      };
      return await web3.eth.accounts.signTransaction(transaction, priv);
    } catch (e) {
      console.log(e.toString());
      throw e;
    }
  }
  async test() {
    return { a: 'a' };
  }
}
