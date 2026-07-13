// ==========================
// RISK ENGINE
// ==========================

const risk = analyzeRisk(
  decision,
  orderBlock,
  market,
  fvg,
  Number(last.close),
  atr14
);

console.log("");
console.log("RISK ENGINE");
console.log("----------------------------");

console.log("Action        :", risk.action);
console.log("Reason        :", risk.reason);
console.log("Risk Level    :", risk.riskLevel);

console.log("");

console.log(
  "Entry         :",
  risk.entry ?? "-"
);

console.log(
  "Stop Loss     :",
  risk.stopLoss ?? "-"
);

console.log("");

console.log(
  "Target TP1    :",
  risk.target?.tp1 ?? "-"
);

console.log(
  "Target TP2    :",
  risk.target?.tp2 ?? "-"
);

console.log(
  "Target TP3    :",
  risk.target?.tp3 ?? "-"
);

console.log("");

console.log(
  "Risk Reward   :",
  risk.riskReward > 0
    ? risk.riskReward
    : "-"
);

// ==========================
// STATE ENGINE
// ==========================

// DEBUG - Cek isi risk
console.log("");
console.log("DEBUG - risk.entry:", JSON.stringify(risk.entry, null, 2));
console.log("DEBUG - risk:", JSON.stringify(risk, null, 2));

// Perbaikan untuk STATE ENGINE
let entryData = null;

// Cek apakah risk.entry ada
if (risk.entry) {
  // Jika risk.entry adalah object dan memiliki property price
  if (typeof risk.entry === 'object' && risk.entry.price) {
    entryData = risk.entry;
  } 
  // Jika risk.entry adalah angka atau string
  else if (typeof risk.entry === 'number' || typeof risk.entry === 'string') {
    entryData = { price: Number(risk.entry) };
  }
  // Jika risk.entry adalah object tanpa property price
  else if (typeof risk.entry === 'object') {
    // Coba ambil nilai pertama yang valid
    const values = Object.values(risk.entry);
    const firstValid = values.find(v => typeof v === 'number' && !isNaN(v));
    if (firstValid) {
      entryData = { price: Number(firstValid) };
    }
  }
}

// Jika masih null, gunakan default dari orderBlock atau market
if (!entryData) {
  // Coba ambil dari orderBlock
  if (orderBlock && orderBlock.high && orderBlock.low) {
    const midPrice = (Number(orderBlock.high) + Number(orderBlock.low)) / 2;
    entryData = { price: midPrice };
  } 
  // Atau dari market
  else if (market && market.swingLow) {
    entryData = { price: Number(market.swingLow.price) };
  }
  // Atau gunakan current price
  else {
    entryData = { price: Number(last.close) };
  }
}

const state = analyzeState(
  Number(last.close),
  entryData,
  atr14
);

console.log("");
console.log("STATE ENGINE");
console.log("----------------------------");

console.log(
  "State         :",
  state.state
);

console.log(
  "Reason        :",
  state.reason
);

console.log(
  "Distance      :",
  state.distance
);

console.log(
  "ATR           :",
  state.atr
);

console.log(
  "Entry         :",
  state.entry
);

// ==========================
// Execution Engine
// ==========================

const execution = analyzeExecution(
  decision,
  risk,
  orderBlock,
  liquidity,
  bos,
  choch,
  data.history,
  Number(last.close),
  atr14,
  state
);

console.log("");
console.log("EXECUTION ENGINE");
console.log("----------------------------");

console.log("Status      :", execution.status ?? "-");
console.log("Direction   :", execution.direction ?? "-");
console.log("Entry       :", execution.entry ?? "-");
console.log("Stop Loss   :", execution.stopLoss ?? "-");
console.log("Target      :", execution.target ?? "-");
console.log("Risk Reward :", execution.riskReward ?? "-");
console.log(
  "Confidence  :",
  execution.confidence != null
    ? execution.confidence + "%"
    : "-"
);
console.log("Reason      :", execution.reason ?? "-");
console.log("Version     :", execution.version ?? "-");

console.log("");
console.log("Trade Plan");
console.log("----------------------------");

console.log("Entry         :", execution.entry ?? "-");
console.log("Stop Loss     :", execution.stopLoss ?? "-");
console.log("Target        :", execution.target ?? "-");
console.log(
  "Risk Reward   :",
  execution.riskReward > 0
    ? execution.riskReward
    : "-"
);
