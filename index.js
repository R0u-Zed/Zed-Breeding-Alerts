const Web3 = require("web3");
const web3 = new Web3(
  "" // Add your Alchemy URL here.
);
// Functions
const { getHorseInformation } = require("./zed");
const { sendBreedingAlert } = require("./discord");
// Constants
const zed_url = "https://zed.run/racehorse/";
const kyh_url = "https://knowyourhorses.com/horses/";
const Breed_Types = ["genesis", "legendary", "exclusive"];
const win_rate = 0.15;
const number_of_races = 50;
// Web3 ETH Subscribe to Pending Transaction Events.
const subscription = web3.eth.subscribe(
  "logs",
  {
    address: "0x7adbced399630dd11a97f2e2dc206911167071ae", // Breeding Contract Address
    topics: [
      "0x597b23690eff5a748e9caeb1673aca23d360fa4591de869f7dfd0ce30408e0b5", // Enter into Stud
    ],
  },
  async function (error, logs) {
    if (error) {
      console.log(error);
    }
    if (logs) {
      // Decode the Log Data
      const decodedLog = web3.eth.abi.decodeLog(
        [
          {
            type: "uint256",
            name: "horseid",
          },
          { type: "uint256", name: "matingPrice" },
          { type: "uint256", name: "duration" },
          { type: "uint256", name: "timestamp" },
        ],
        logs.data,
        logs.topics
      );
      console.log(decodedLog);
      checkHorseData(decodedLog);
    }
  }
);

const checkHorseData = async (log_data) => {
  // Poll the ZED API for Horse Data.
  const zed_data = await getHorseInformation(log_data.horseid);
  const zed_horse_url = zed_url + log_data.horseid;
  const horse_race_count = zed_data.number_of_races;
  const horse_win_count = zed_data.career.first;
  const horse_win_rate = parseFloat(horse_win_count / horse_race_count).toFixed(
    2
  );
  const converted_win_rate = parseFloat(horse_win_rate * 100).toFixed(2);
  const kyh_horse_url = kyh_url + log_data.horseid;
  // Remove the Z to check the Genotype
  let genotype = zed_data.genotype.replace("Z", "");
  // Figure out the Mating Price
  let mating_price = web3.utils.fromWei(log_data.matingPrice);
  if (
    (genotype < 3 && zed_data.breed_type === "genesis") ||
    (genotype < 11 &&
      Breed_Types.includes(zed_data.breed_type) &&
      horse_race_count > number_of_races &&
      horse_win_rate > win_rate)
  ) {
    return sendBreedingAlert(
      zed_data.hash_info.name,
      zed_data.genotype,
      zed_horse_url,
      kyh_horse_url,
      zed_data.img_url,
      horse_race_count,
      converted_win_rate,
      zed_data.offspring_win_rate,
      mating_price
    );
  }
};
