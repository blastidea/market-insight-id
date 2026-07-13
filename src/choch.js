function analyzeCHOCH(currentPrice, market, bos) {

  let direction = "None";
  let level = null;
  let status = "Waiting";


  // ==========================
  // Bearish BOS sebelumnya
  // Cari potensi CHOCH Bullish
  // ==========================

  if (
    bos.direction === "Bearish" &&
    market.swingHigh
  ) {

    if (currentPrice > market.swingHigh.price) {

      direction = "Bullish";
      level = market.swingHigh.price;
      status = "Confirmed";

    }

  }



  // ==========================
  // Bullish BOS sebelumnya
  // Cari potensi CHOCH Bearish
  // ==========================

  if (
    bos.direction === "Bullish" &&
    market.swingLow
  ) {

    if (currentPrice < market.swingLow.price) {

      direction = "Bearish";
      level = market.swingLow.price;
      status = "Confirmed";

    }

  }



  return {

    direction,
    level,
    status

  };

}


module.exports = {
  analyzeCHOCH
};
