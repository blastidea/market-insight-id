function analyzeZone(
  market,
  price
) {

  if (
    !market ||
    !market.swingHigh ||
    !market.swingLow
  ) {

    return {

      zone: "Unknown",
      high: null,
      low: null,
      equilibrium: null,
      fib618: null,
      fib382: null,
      score: 0

    };

  }


  const high =
    Number(market.swingHigh.price);


  const low =
    Number(market.swingLow.price);



  if (high <= low) {

    return {

      zone: "Unknown",
      high,
      low,
      equilibrium: null,
      fib618: null,
      fib382: null,
      score: 0

    };

  }



  const range =
    high - low;



  // Fibonacci

  const fib618 =
    high - (range * 0.618);


  const fib500 =
    high - (range * 0.5);


  const fib382 =
    high - (range * 0.382);



  let zone = "Equilibrium";

  let score = 50;



  // ==========================
  // Discount Area
  // bawah 50%
  // ==========================

  if (
    price < fib500
  ) {

    zone = "Discount";
    score += 20;

  }



  // ==========================
  // Premium Area
  // atas 50%
  // ==========================

  else if (
    price > fib500
  ) {

    zone = "Premium";
    score += 20;

  }



  // dekat golden zone

  if (
    price >= fib618 &&
    price <= fib382
  ) {

    score += 20;

  }



  return {

    zone,

    high,

    low,

    equilibrium: fib500,

    fib618,

    fib382,

    score

  };


}



module.exports = {

  analyzeZone

};
