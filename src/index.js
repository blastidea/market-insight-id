const axios = require("axios");

const API_KEY = process.env.TWELVE_API_KEY;

async function getGoldPrice() {
  try {
    const url = `https://api.twelvedata.com/price?symbol=XAU/USD&apikey=${API_KEY}`;

    const response = await axios.get(url);

    console.log("=== Market Insight Indonesia ===");
    console.log("System Running...");
    console.log("XAU/USD Price:", response.data.price);
    console.log("Data Engine OK");
  } catch (error) {
    console.error("ERROR:", error.response?.data || error.message);
  }
}

getGoldPrice();main();

