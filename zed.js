const axios = require("axios");

const getHorseInformation = async (id) => {
  const { data } = await axios(`https://api.zed.run/api/v1/horses/get/${id}`, {
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,zh-CN;q=0.7,zh;q=0.6",
      authorization: "", // Add your Zed.Run Bearer Token here from the Network tab.
      "if-modified-since": "Sat, 28 May 2022 07:26:25 GMT",
      "sec-ch-ua":
        '" Not A;Brand";v="99", "Chromium";v="101", "Google Chrome";v="101"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      Referer: "https://zed.run/",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
    body: null,
    method: "GET",
  });
  return data;
};

module.exports = {
  getHorseInformation,
};
