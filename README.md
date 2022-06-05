# ZED.RUN Breeding Alerts

### Overview

A Free & Open-source application to Monitor the ZED.RUN Stud Market. Using the PolygonScan API to pull transactional data from the Breeding Contract and decoding the input data using abi-decoder library to figure out what horses have been entered into the stud market before they are listed on Zed.RUN.

Once a horse has been listed that is within the Parameters specified in index.js it will output the Horse & Zed.RUN url to a discord channel of your choice using Webhook URLs.

You can run this on your own discord server or Join one I have setup for this specific application and potentially other Zed.RUN applications in the future.

If you want to change what horses are sent to the discord, you can edit the Global Variables:

`MaximumZNumber` & `Breed_Types` in Index.js

### Requirements

- Discord Webhook URL
- PolygonScan API Key
- Zed Run Bearer Token

### Installation

```- npm install
- Fill in .env variables
- node index.js
```
