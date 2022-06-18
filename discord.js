require("dotenv").config();
const { Webhook } = require("discord-webhook-node");
const breedingAlertWebhook = new Webhook(process.env.WEBHOOK_URL);
const sendBreedingAlert = (
  name,
  genotype,
  url,
  kyh_horse_url,
  img,
  races,
  winrate,
  offspring,
  mating_price
) => {
  breedingAlertWebhook.setUsername("Breeding Alert");
  breedingAlertWebhook.setAvatar(img);
  breedingAlertWebhook.send(
    genotype +
      " " +
      name +
      " has entered the Stud Market at " +
      mating_price +
      "\n" +
      " (" +
      winrate +
      "% winrate over " +
      races +
      " races) " +
      url +
      " " +
      kyh_horse_url +
      "\n Offspring Winrate: " +
      offspring +
      "%"
  );
};

module.exports = {
  sendBreedingAlert,
};
