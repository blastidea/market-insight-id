const https = require("https");

function getPrice() {
  return new Promise((resolve, reject) => {
    https.get(
      "https://api.binance.com/api/v3/ticker/price?symbol=PAXGUSDT",
      (res) => {
        let data = "";

        res.on("data", chunk => {
          data += chunk;
        });

        res.on("end", () => {
          try {
            const json = JSON.parse(data);
            resolve(json.price);
          } catch (err) {
            reject(err);
          }
        });
      }
    ).on("error", reject);
  });
}

async function main() {
  console.log("=== Market Insight Indonesia ===");
  console.log("System Running...");

  const price = await getPrice();

  console.log("XAUUSD Price:", price);
  console.log("Data Engine OK");
}

main();

