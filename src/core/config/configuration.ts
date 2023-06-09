import * as dotenv from 'dotenv';
import * as fs from 'fs';

const envPath = `.env`;
let data = process.env;

export default () => {
  try {
    if (fs.existsSync(envPath)) {
      data = dotenv.parse(fs.readFileSync(envPath));
    }
    const envs = {
      serverPort: parseInt(data.SERVER_PORT, 10),
      networkInfo: {
        polygonNetwork: data.POLYGON_NETWORK,
        polygonChainId: data.POLYGON_CHAIN_ID,
        polygonNodeUrl: data.POLYGON_NODE_URL,
        gftAddress: data.GFT_ADDRESS,
        iftAddress: data.IFT_ADDRESS,
        psbtAddress: data.PSBT_ADDRESS,
      },
      ownerInfo: {
        ownerAddress: data.OWNER_ADDRESS,
        ownerPriv: data.OWNER_PRIV,
      },
    };
    return envs;
  } catch (e) {
    console.log(`Configuration error: ${e.toString()}`);
  }
};
