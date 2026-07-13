const axios = require("axios");

async function main() {
  try {
    const apiKey = process.env.TWELVE_API_KEY;

    console.log("=== Market Insight Indonesia ===");
    console.log("API Key:", apiKey ? "TERBACA" : "TIDAK TERBACA");

    if (!apiKey) {
      throw new Error("TWELVE_API_KEY tidak ditemukan.");
    }

    const url = `https://api.twelvedata.com/price?symbol=XAU/USD&apikey=${apiKey}`;

    const response = await axios.get(url);

    console.log("Response:");
    console.log(JSON.stringify(response.data, null, 2));

  } catch (err) {
    console.log("ERROR:");

    if (err.response) {
      console.log(JSON.stringify(err.response.data, null, 2));
    } else {
      console.log(err.message);
    }
  }
}

main();
