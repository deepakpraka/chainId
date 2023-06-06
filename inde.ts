import axios from 'axios';
 import Redis from 'ioredis';
import { createClient } from 'redis';
import dotenv from "dotenv";
dotenv.config();

enum ChainId {
  SOLANA = 0,
  APTOS = 1,
  POLYGON = 2,
  BINANCE = 3,
  ETHEREUM = 4,
  KLAYTN = 5,
  FANTOM = 6,
}


 
 let redisClient = createClient()
redisClient.connect().then(()=>{
  console.log("connected")
}).catch(console.error)

 const tokenListUrls = [
  
   'https://cache.jup.ag/tokens' ,
    'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/typescript/src/defaultList.mainnet.json',
    'https://raw.githubusercontent.com/0xAnto/token-lists/main/polygon.json',
    'https://raw.githubusercontent.com/0xAnto/token-lists/main/bsc.json',
    'https://raw.githubusercontent.com/0xAnto/token-lists/main/ethereum.json',
    'https://raw.githubusercontent.com/0xAnto/token-lists/main/klaytn.json',
    'https://raw.githubusercontent.com/0xAnto/token-lists/main/fantom.json',
  ]
  const tokenListUrls_ = [
    { url: 'https://cache.jup.ag/tokens', key: ChainId.SOLANA },
    { url: 'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/typescript/src/defaultList.mainnet.json', key: ChainId.APTOS },
    { url: 'https://raw.githubusercontent.com/0xAnto/token-lists/main/polygon.json', key: ChainId.POLYGON },
    { url: 'https://raw.githubusercontent.com/0xAnto/token-lists/main/bsc.json', key: ChainId.BINANCE },
    { url: 'https://raw.githubusercontent.com/0xAnto/token-lists/main/ethereum.json', key: ChainId.ETHEREUM },
    { url: 'https://raw.githubusercontent.com/0xAnto/token-lists/main/klaytn.json', key: ChainId.KLAYTN },
    { url: 'https://raw.githubusercontent.com/0xAnto/token-lists/main/fantom.json', key: ChainId.FANTOM },
  ];
  
    
  // Function to fetch token list details from a specific URL
  async function fetchTokenListDetails(url: any) {
    try {
      const response = await axios.get(url);
      // console.log("Get :",response.data);

      const tokenListDetails = response.data;
      const transformeddetails = tokenListDetails.map((value: any )=>{
        //console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",value.chainId)
        return {
          address: value.address,
          chainId:value.chainId,
          symbol:value.symbol,
          logoURI:value.logoURI,
          coingecko_id:value.coingeckoId,
          decimals:value.decimals,
          

        }
      })
      

            console.log(`Token list details for URL ${url}:`, transformeddetails);
            return transformeddetails; 
          } catch (error) {
            console.error(`Failed to fetch token list details from URL ${url}:`, error);
            return null; 
          }
        }
        


//   // Fetch token list details from a specific URL and store in Redis
async function fetchAndStoreTokenListDetails(list: { url: string, key: ChainId }) {

  const tokenListDetails = await fetchTokenListDetails(list.url);
  if (tokenListDetails) {
    await storeTokenListDetailsInRedis(list.key, tokenListDetails);
  } else {
   // console.error(`Failed to fetch token list details from URL ${url}.`);
  }
}
    


// // Store token list details in Redis
async function storeTokenListDetailsInRedis(key: ChainId, tokenListDetails: any) {
  try {
    const redisKey = `tokenList:${key}`;

    const value = JSON.stringify(tokenListDetails);
    await redisClient.set(redisKey, value);

    // console.log(`Token list details for URL ${list} stored in Redis.`);
     
  } catch (error) {
    console.error(`Failed to store token list details for key ${key} in Redis:`, error);
  }

  }




// // Fetch all token list details and store in Redis
async function fetchAllTokenListDetails(arg : ChainId) {
  
    for (let i = 0; i < tokenListUrls_.length; i++) {
    await fetchAndStoreTokenListDetails(tokenListUrls_[i]);
if (arg === tokenListUrls_[i].key) {
  try {
    const response = await axios.get(tokenListUrls_[i].url);
    console.log(`Response for URL ${tokenListUrls_[i].url}:`, response.data);
  } catch (error) {
    console.error(`Failed to fetch data for URL ${tokenListUrls_[i].url}:`, error);
  }
}
}
}

//       switch (tokenListUrls_[arg]){
//         case tokenListUrls_[0] : {
//            const test = await axios.get(tokenListUrls_[0].url)
//           break;
//         }
//         case tokenListUrls_[1] : {
//           const test = await axios.get(tokenListUrls_[1].url)
//            break;
//         }
//           case tokenListUrls_[2] : {
//             const test = await axios.get(tokenListUrls_[2].url)
//             break;
//         }
//         case tokenListUrls_[3] : {
//           const test = await axios.get(tokenListUrls_[3].url)
//           break;
//       }
//       case tokenListUrls_[4] : {
//         const test = await axios.get(tokenListUrls_[4].url)
//         break;
//     }
//     case tokenListUrls_[5] : {
//       const test = await axios.get(tokenListUrls_[5].url)
//       break;
//   }
//   case tokenListUrls_[6] : {
//     const test = await axios.get(tokenListUrls_[6].url)
//     break;
//     }
//     default :
//     console.log("There is no chain id (invalid case) ")
    
//   }
// }
 //}
 fetchAllTokenListDetails(ChainId.ETHEREUM);
 

// // Retrieve token list details from Redis
// async function retrieveTokenListDetailsFromRedis(list: any) {
//   try {
//     const key = `tokenList:${list}`;
//    // console.log("key",key)
//     const value = await redisClient.get(key);
//    if (value) {
//       const tokenListDetails = value;
//       // console.log(`Token list details for URL ${url} retrieved from Redis:`, tokenListDetails);
//       return tokenListDetails;
//     } else {
//      // console.log(`Token list details not found in Redis for URL ${url}.`);
//       return null;
//     }
//   } catch (error) {
//     console.error(`Failed to retrieve token list details from Redis for URL ${list}:`, error);
//     return null;
//   }
// }
//       // Transform the token list details using the map function
      
// // Example usage
// async function retrieveAllTokenListDetailsFromRedis() {
//   for (let i = 0; i < tokenListUrls_.length; i++) {
//     const url = tokenListUrls_[i];
//     await retrieveTokenListDetailsFromRedis(url);
//   }
// }

// retrieveAllTokenListDetailsFromRedis();
