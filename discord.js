require("dotenv").config();
const { Webhook } = require("discord-webhook-node");

const breedingAlertWebhook = new Webhook(process.env.WEBHOOK_URL);

const sendBreedingAlert = (horse_id, url, kyh_horse_url) => {
  breedingAlertWebhook.setUsername("Breeding Alert");
  breedingAlertWebhook.setAvatar(
    "https://lh3.googleusercontent.com/8Uz1h-kSgt5hOI7t9Xzf8wtH9Q3G5VEY_oUhJBqUP-XWP17qHeEOufcFWY7SV-Sx5jSYOTCG73fMG0otrXuEEteRD_rM_jm2YZt5bg4=w600"
  );
  breedingAlertWebhook.send(
    horse_id + " has entered the Stud Market." + " " + url + " " + kyh_horse_url
  );
};

module.exports = {
  sendBreedingAlert,
};
