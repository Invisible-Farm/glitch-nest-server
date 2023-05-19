import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BigNumber, ethers } from 'ethers';
import { createAlchemyWeb3 } from '@alch/alchemy-web3';
import * as path from 'path';
import * as fs from 'fs';
import { Token } from 'quickswap-sdk';

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

    // this.GFT = new Token(this.networkInfo.polygonChainId, this.networkInfo.gftAddress, 18, 'GFT', 'ITSBLOC');
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
}
