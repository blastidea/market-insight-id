const axios = require("axios");

async function main() {
  try {
    const apiKey = process.env.TWELVE_API_KEY;

    console.log("API Key:", apiKey ? "TERBACA" : "TIDAK TERBACA");

    const url = `https://api.twelvedata.com/price?symbol=XAU/USD&apikey=${apiKey}`;

    const response = await axios.get(url);

    console.log("Response:");
    console.log(response.data);

  } catch (err) {
    if (err.response) {
      console.log(err.response.data);
    } else {
      console.log(err.message);
    }
  }
}

main();
