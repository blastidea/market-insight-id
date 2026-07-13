function analyzeZone(
  price,
  market
) {


  if (
    !market.swingHigh ||
    !market.swingLow
  ) {

    return {

      zone: "Unknown",
      score: 0

    };

  }


  const high = Number(
    market.swingHigh.price
  );


  const low = Number(
    market.swingLow.price
  );


  const range = high - low;


  const equilibrium =
    low + (range / 2);


  const fib618 =
    low + (range * 0.618);


  const fib382 =
    low + (range * 0.382);



  let zone = "Equilibrium";


  let bias = "Neutral";


  let score = 50;



  // =========================
  // Outside Range Detection
  // =========================


  if (price > high) {

    zone = "Above Premium Range";

    bias = "Potential SELL Zone";

    score = 60;


  }
  else if (price < low) {

    zone = "Below Discount Range";

    bias = "Potential Reversal BUY";

    score = 65;


  }

  // =========================
  // Inside Range
  // =========================

  else {


    if (price >= fib618) {

      zone = "Premium";

      bias = "SELL Area";

      score = 80;


    }

    else if (price <= fib382) {

      zone = "Discount";

      bias = "BUY Area";

      score = 80;


    }

    else {

      zone = "Equilibrium";

      bias = "Wait";

      score = 50;

    }

  }



  return {


    zone,

    bias,


    high,

    low,


    equilibrium,


    fib618,

    fib382,


    score


  };


}


module.exports = {
  analyzeZone
};
