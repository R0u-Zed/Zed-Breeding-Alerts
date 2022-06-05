//Imports
require("dotenv").config();
const axios = require("axios");
const Web3Utils = require("web3-utils");
const abiDecoder = require("abi-decoder");
const { sendBreedingAlert } = require("./discord");
const { getHorseInformation } = require("./zed");
const abi = require("./abi.json");
abiDecoder.addABI(abi);

// Globals
const breedingContractAddress = "0x7adbced399630dd11a97f2e2dc206911167071ae";
const mainnet_url = "https://api.polygonscan.com/";
const zed_url = "https://zed.run/racehorse/";
const kyh_url = "https://knowyourhorses.com/horses/";
const checkedTransactions = [];
const MaximumZNumber = 3;
const Breed_Types = ["genesis"];

// Get List of Transactions from Breeding Contract.
const getTransactions = async (address) => {
  // Polygon URL (Offset is how many transactions to pull each time)
  const url = `${mainnet_url}/api?module=account&action=txlist&address=${address}&sort=desc&page=1&offset=100&apikey=${process.env.POLYGON_SCAN_API_KEY}`;
  const { data } = await axios.get(url);
  // Check Transactions for STUD Barn related Tx's
  const studTransactions = checkForStud(data);
};

// Check Transactions for Horses entering the Stud Barn.
const checkForStud = async (transactions) => {
  const studTransactions = [];
  for (transaction of transactions.result) {
    //Check Transaction hasn't already been seen.
    if (
      checkedTransactions.filter((x) => x.hash === transaction.hash).length ===
      0
    ) {
      // Decode the Input Data using the Breeding ABI Contract. Taken from Zed.run Source Files.
      const decode_data = abiDecoder.decodeMethod(transaction.input);
      if (decode_data !== undefined) {
        // Check if Method is equal to Entering Stud Barn.
        if (decode_data.params[1].value.includes("0x0cf414c8")) {
          // Isolate the Decoded Horse ID from input data
          const horse_id_encoded = decode_data.params[1].value.substring(
            69,
            74
          );
          // Convert decoded Horse ID to Hex & then Convert to ID.
          const horse_id = Web3Utils.hexToNumber("0x" + horse_id_encoded);
          // Search the Horse Info on Zed API
          const horse_data = await getHorseInformation(horse_id);
          const horse_url = zed_url + horse_id;
          const kyh_horse_url = kyh_url + horse_id;
          // Remove the Z to check the Genotype
          const genotype = horse_data.genotype.replace("Z", "");
          // If the Genotype is Below 3 && The horse is a genesis. Post the Breeding Alert.
          if (
            genotype < MaximumZNumber &&
            Breed_Types.includes(horse_data.breed_type)
          ) {
            sendBreedingAlert(
              horse_data.hash_info.name,
              horse_url,
              kyh_horse_url
            );
          }
        }
      }
    }
    checkedTransactions.push(transaction);
  }
  return studTransactions;
};
async function main() {
  // Get new Blockchain Transactions every 10 Seconds.
  setInterval(async () => {
    console.log("Checking for new Transactions");
    const transactions = await getTransactions(breedingContractAddress);
  }, 30000);
}

main();
