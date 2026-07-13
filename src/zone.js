function analyzeZone(
  price,
  market,
  bos,
  atr,
  rsi,
  orderBlock,
  fvg
) {


  const high =
    market.swingHigh
      ? market.swingHigh.price
      : null;


  const low =
    market.swingLow
      ? market.swingLow.price
      : null;



  if (!high || !low) {

    return {
      zone: "Unknown",
      score: 0
    };

  }



  const range = high - low;


  const equilibrium =
    low + (range / 2);



  const fib618 =
    low + (range * 0.618);


  const fib382 =
    low + (range * 0.382);



  let zone = "Neutral";
  let location = "Inside Range";



  if (price > high) {

    zone = "Premium";
    location = "Above Range";

  }

  else if (price < low) {

    zone = "Below Discount Range";
    location = "Below Range";

  }

  else {

    if (price > equilibrium) {

      zone = "Premium";

    }

    else {

      zone = "Discount";

    }

  }



  let bias = "Neutral";


  if (
    zone === "Discount" ||
    zone === "Below Discount Range"
  ) {

    bias = "Potential BUY Reaction";

  }


  if (
    zone === "Premium" ||
    zone === "Above Range"
  ) {

    bias = "Potential SELL Reaction";

  }



  let score = 50;



  // ==========================
  // Zone Location
  // ==========================


  if (zone === "Below Discount Range") {

    score += 20;

  }


  if (zone === "Above Range") {

    score += 20;

  }



  // ==========================
  // RSI Context
  // ==========================


  if (rsi <= 30) {

    score += 15;

  }


  if (rsi >= 70) {

    score += 15;

  }



  // ==========================
  // BOS Context
  // ==========================


  if (bos) {


    if (
      bos.direction === "Bearish" &&
      zone.includes("Premium")
    ) {

      score += 20;

    }


    if (
      bos.direction === "Bullish" &&
      zone.includes("Discount")
    ) {

      score += 20;

    }


    if (
      bos.direction === "Bearish" &&
      zone.includes("Discount")
    ) {

      score -= 20;

    }


    if (
      bos.direction === "Bullish" &&
      zone.includes("Premium")
    ) {

      score -= 20;

    }

  }



  // ==========================
  // Order Block Context
  // ==========================


  if (orderBlock) {


    if (
      orderBlock.type === "Bearish" &&
      zone.includes("Discount")
    ) {

      score -= 10;

    }


    if (
      orderBlock.type === "Bullish" &&
      zone.includes("Discount")
    ) {

      score += 15;

    }

  }



  // ==========================
  // FVG Context
  // ==========================


  if (fvg) {


    if (
      fvg.type === "Bullish" &&
      zone.includes("Discount")
    ) {

      score += 15;

    }


    if (
      fvg.type === "Bearish" &&
      zone.includes("Premium")
    ) {

      score += 15;

    }

  }




  // ==========================
  // Extended Move
  // ==========================


  const distance =
    Math.abs(price - equilibrium);



  if (atr) {


    if (distance > atr * 5) {

      score += 10;

    }

  }



  if (score > 95)
    score = 95;


  if (score < 5)
    score = 5;



  return {

    zone,

    location,

    bias,


    high,

    low,


    equilibrium,


    fib618,

    fib382,


    price,


    distance:
      Number(distance.toFixed(2)),


    score

  };

}



module.exports = {
  analyzeZone
};
