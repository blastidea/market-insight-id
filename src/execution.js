// src/execution.js
// Execution Engine v1.2


function analyzeExecution(
  decision,
  orderBlock,
  liquidity,
  bos,
  choch,
  confluence,
  history,
  price,
  atr
){

  let status = "WAIT";

  let reason = [];

  let entry = null;

  let distance = null;



  // ==========================
  // BASIC CHECK
  // ==========================

  if(
    !decision ||
    !orderBlock
  ){

    return {

      status:"CANCEL",

      reason:"Missing setup",

      version:"1.2",

      timestamp:new Date().toISOString()

    };

  }



  if(
    orderBlock.status === "Not Found"
  ){

    return {

      status:"CANCEL",

      reason:"No valid order block",

      version:"1.2",

      timestamp:new Date().toISOString()

    };

  }



  // ==========================
  // ORDER BLOCK CHECK
  // ==========================


  if(
    decision.bias === "BEARISH"
  ){

    entry = orderBlock.low;


    distance =
    Math.abs(
      price - entry
    );



    if(
      price >= orderBlock.low &&
      price <= orderBlock.high
    ){

      reason.push(
        "Inside bearish OB"
      );


    }
    else if(
      distance <= atr * 3
    ){

      reason.push(
        "Near bearish OB"
      );


    }
    else{

      return {

        status:"WAIT",

        reason:"Waiting retracement to bearish OB",

        entry,

        distance,

        version:"1.2",

        timestamp:new Date().toISOString()

      };

    }

  }





  if(
    decision.bias === "BULLISH"
  ){


    entry = orderBlock.high;



    distance =
    Math.abs(
      price - entry
    );



    if(
      price >= orderBlock.low &&
      price <= orderBlock.high
    ){

      reason.push(
        "Inside bullish OB"
      );


    }
    else if(
      distance <= atr * 3
    ){

      reason.push(
        "Near bullish OB"
      );


    }
    else{

      return {

        status:"WAIT",

        reason:"Waiting retracement to bullish OB",

        entry,

        distance,

        version:"1.2",

        timestamp:new Date().toISOString()

      };

    }


  }





  // ==========================
  // BOS FILTER
  // ==========================


  if(
    !bos ||
    bos.status !== "Confirmed"
  ){

    return {

      status:"WAIT",

      reason:"Waiting BOS confirmation",

      version:"1.2",

      timestamp:new Date().toISOString()

    };

  }


  reason.push(
    "BOS confirmed"
  );





  // ==========================
  // LIQUIDITY FILTER
  // ==========================


  if(
    liquidity &&
    liquidity.type !== "None"
  ){

    reason.push(
      "Liquidity sweep detected"
    );


  }
  else{

    reason.push(
      "No liquidity sweep"
    );

  }





  // ==========================
  // CHOCH CHECK
  // ==========================


  if(
    choch &&
    choch.status === "Confirmed"
  ){

    reason.push(
      "CHOCH confirmed"
    );

  }





  // ==========================
  // CONFLUENCE FILTER
  // ==========================


  if(
    confluence &&
    confluence.confidence < 60
  ){

    return {

      status:"WAIT",

      reason:"Low confluence",

      version:"1.2",

      timestamp:new Date().toISOString()

    };

  }


  reason.push(
    "Confluence valid"
  );





  // ==========================
  // CANDLE CONFIRMATION
  // ==========================


  let candleConfirm = false;



  if(
    history &&
    history.length >= 2
  ){


    let last =
    history[0];


    let prev =
    history[1];



    // bearish rejection

    if(
      decision.bias === "BEARISH" &&
      last.close < last.open &&
      last.high > prev.high
    ){

      candleConfirm = true;

    }



    // bullish rejection

    if(
      decision.bias === "BULLISH" &&
      last.close > last.open &&
      last.low < prev.low
    ){

      candleConfirm = true;

    }


  }





  if(candleConfirm){

    reason.push(
      "Rejection candle confirmed"
    );


  }
  else{

    reason.push(
      "Waiting candle confirmation"
    );

  }





  // ==========================
  // FINAL STATUS
  // ==========================


  if(
    candleConfirm &&
    bos.status === "Confirmed"
  ){

    status="READY";

  }
  else{

    status="WAIT";

  }





  return {

    status,

    reason:
    reason.join(" | "),

    entry,

    distance,

    version:"1.2",

    timestamp:
    new Date().toISOString()

  };


}



module.exports = {

  analyzeExecution

};
