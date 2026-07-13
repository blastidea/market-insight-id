// src/state.js
// Market State Engine v1.0
// Detect trade timing status
// READY / WAIT_RETRACE / MISSED / INVALID


function analyzeState(
  price,
  entry,
  atr
){


  let state = "INVALID";
  let reason = "No valid entry";


  if(
    !price ||
    !entry ||
    !entry.price ||
    !atr
  ){

    return {

      state,
      reason,

      distance:null,
      zone:null

    };

  }

  const currentPrice =
    Number(price);


  const entryPrice =
    Number(entry.price);



  const distance =
    Math.abs(
      currentPrice - entryPrice
    );



  const atrValue =
    Number(atr);


  // ==========================
  // DISTANCE CLASSIFICATION
  // ==========================
  if(
    distance <= atr * 0.5
  ){

    state = "READY";

    reason =
    "Price inside entry zone";

  }

  else if(
    distance <= atr * 2
  ){

    state = "WAIT_RETRACE";

    reason =
    "Price near entry zone waiting confirmation";

  }
  else if(
    distance <= atr * 3
  ){

    state = "MISSED";

    reason =
    "Price moved away from entry zone";

  }

  else {
    state = "MISSED";

    reason =
    "Price already left setup area";

  }





  return {

    state,

    reason,

    distance:
      Number(
        distance.toFixed(2)
      ),
    atr:
      Number(
        atrValue.toFixed(2)
      ),
    entry:
      Number(
        entryPrice.toFixed(2)
      )

  };

}

module.exports = {

  analyzeState

};
