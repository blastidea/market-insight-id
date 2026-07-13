function analyzeZone(
  price,
  market,
  bos,
  atr
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

    location = "Above Range";
    zone = "Premium";

  }

  else if (price < low) {

    location = "Below Range";
    zone = "Below Discount Range";

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

    bias = "Potential Reversal BUY";

  }


  if (
    zone === "Premium" ||
    zone === "Above Range"
  ) {

    bias = "Potential SELL Area";

  }



  // distance ke equilibrium

  const distance =
    Number(
      Math.abs(price - equilibrium)
      .toFixed(2)
    );



  // score engine

  let score = 50;


  if (bos) {

    if (
      bos.direction === "Bearish" &&
      zone.includes("Premium")
    ) {

      score += 25;

    }


    if (
      bos.direction === "Bullish" &&
      zone.includes("Discount")
    ) {

      score += 25;

    }

  }



  if (atr) {

    if (distance > atr * 3) {

      score -= 10;

    }

  }


  if (score > 95)
    score = 95;


  if (score < 0)
    score = 0;



  return {


    zone,

    location,

    bias,


    high,

    low,


    equilibrium,


    fib618,

    fib382,


    distance,


    score,


    range,


    price

  };


}



module.exports = {
  analyzeZone
};
