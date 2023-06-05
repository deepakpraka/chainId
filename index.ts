 import axios from 'axios';
 import Redis from 'ioredis';
import { createClient } from 'redis';
import dotenv from "dotenv";
dotenv.config();



 
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
  
    {url : 'https://cache.jup.ag/tokens',key:"solana"} ,
    {url : 'https://raw.githubusercontent.com/hippospace/aptos-coin-list/main/typescript/src/defaultList.mainnet.json',key:"aptos"} ,
    {url :'https://raw.githubusercontent.com/0xAnto/token-lists/main/polygon.json',key:"polygon"} ,
    {url :'https://raw.githubusercontent.com/0xAnto/token-lists/main/bsc.json',key:"binance"} ,
    {url : 'https://raw.githubusercontent.com/0xAnto/token-lists/main/ethereum.json',key:"ethereum"} ,
    {url : 'https://raw.githubusercontent.com/0xAnto/token-lists/main/klaytn.json',key:"klaytn"} ,
    {url : 'https://raw.githubusercontent.com/0xAnto/token-lists/main/fantom.json',key:"fantom"} ,
   ]
  
    
  // Function to fetch token list details from a specific URL
  async function fetchTokenListDetails(url: string) {
    try {
      const response = await axios.get(url);
      //console.log("Get :",response);

      const tokenListDetails = response.data;

      //console.log(tokenListDetails);

  
      //console.log(`Token list details for URL ${url}:`, tokenListDetails);
      return tokenListDetails; 
    } catch (error) {
      console.error(`Failed to fetch token list details from URL ${url}:`, error);
      return null; 
    }
  }
  

  // Fetch token list details from a specific URL and store in Redis
async function fetchAndStoreTokenListDetails(list: any) {
  const tokenListDetails = await fetchTokenListDetails(list.url);
  if (tokenListDetails) {
    await storeTokenListDetailsInRedis(list.key, tokenListDetails);
  } else {
   // console.error(`Failed to fetch token list details from URL ${url}.`);
  }
}

// Store token list details in Redis
async function storeTokenListDetailsInRedis(list: any, tokenListDetails: any) {
  try {
    const key = `tokenList:${list}`;
    const value = JSON.stringify(tokenListDetails);
    const result = await redisClient.set(key, value);
    // console.log(`Token list details for URL ${list} stored in Redis.`);
     
  } catch (error) {
    console.error(`Failed to store token list details for URL ${list} in Redis:`, error);
  }
}

// Fetch all token list details and store in Redis
async function fetchAllTokenListDetails(arg : number) {
  for (let i = 0; i < tokenListUrls_.length; i++) {
    await fetchAndStoreTokenListDetails(tokenListUrls_[i]);
      switch (tokenListUrls_[arg]){
        case tokenListUrls_[0] : {
           const test = await axios.get(tokenListUrls_[0].url)
           console.log("solana :",test)
          break;
        }
        case tokenListUrls_[1] : {
          const test = await axios.get(tokenListUrls_[1].url)
           console.log(test)
           break;
        }
          case tokenListUrls_[2] : {
            const test = await axios.get(tokenListUrls_[2].url)
            console.log("case 2 ", test)
            break;
        }
        case tokenListUrls_[3] : {
          const test = await axios.get(tokenListUrls_[3].url)
          console.log("case 3 ", test)
          break;
      }
      case tokenListUrls_[4] : {
        const test = await axios.get(tokenListUrls_[4].url)
        console.log("case 4 ", test)
        break;
    }
    case tokenListUrls_[5] : {
      const test = await axios.get(tokenListUrls_[5].url)
      console.log("case 5 ", test)
      break;
  }
  case tokenListUrls_[6] : {
    const test = await axios.get(tokenListUrls_[6].url)
    console.log("case 6 ", test)
    break;
    }
    default :
    console.log("There is no chain id (invalid case) ")
    
  }
}
}

fetchAllTokenListDetails(2);
// Retrieve token list details from Redis
async function retrieveTokenListDetailsFromRedis(list: any) {
  try {
    const key = `tokenList:${list}`;
   // console.log("key",key)
    const value = await redisClient.get(key);
   if (value) {
      const tokenListDetails = value;
      // console.log(`Token list details for URL ${url} retrieved from Redis:`, tokenListDetails);
      return tokenListDetails;
    } else {
     // console.log(`Token list details not found in Redis for URL ${url}.`);
      return null;
    }
  } catch (error) {
    console.error(`Failed to retrieve token list details from Redis for URL ${list}:`, error);
    return null;
  }
}

// Example usage
async function retrieveAllTokenListDetailsFromRedis() {
  for (let i = 0; i < tokenListUrls_.length; i++) {
    const url = tokenListUrls_[i];
    await retrieveTokenListDetailsFromRedis(url);
  }
}

retrieveAllTokenListDetailsFromRedis();
