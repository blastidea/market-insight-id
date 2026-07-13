function getPrices(candles) {
  return [...candles]
    .reverse()
    .map(c => ({
      open: Number(c.open),
      high: Number(c.high),
      low: Number(c.low),
      close: Number(c.close)
    }));
}

// =========================
// EMA
// =========================
function calculateEMA(candles, period) {

  if (!candles || !Array.isArray(candles)) {
    return null;
  }

  const prices = getPrices(candles).map(c => c.close);

  if (prices.length < period) {
    return null;
  }

  const multiplier = 2 / (period + 1);

  let ema =
    prices
      .slice(0, period)
      .reduce((sum, price) => sum + price, 0) / period;

  for (let i = period; i < prices.length; i++) {
    ema = ((prices[i] - ema) * multiplier) + ema;
  }

  return Number(ema.toFixed(5));
}

// =========================
// RSI
// =========================
function calculateRSI(candles, period = 14) {

  const prices = getPrices(candles).map(c => c.close);

  if (prices.length <= period) {
    return null;
  }

  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {

    const change = prices[i] - prices[i - 1];

    if (change > 0) {
      gains += change;
    } else {
      losses += Math.abs(change);
    }

  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  for (let i = period + 1; i < prices.length; i++) {

    const change = prices[i] - prices[i - 1];

    let gain = 0;
    let loss = 0;

    if (change > 0) {
      gain = change;
    } else {
      loss = Math.abs(change);
    }

    avgGain = ((avgGain * (period - 1)) + gain) / period;
    avgLoss = ((avgLoss * (period - 1)) + loss) / period;

  }

  if (avgLoss === 0) {
    return 100;
  }

  const rs = avgGain / avgLoss;

  const rsi = 100 - (100 / (1 + rs));

  return Number(rsi.toFixed(2));
}

// =========================
// ATR
// =========================
function calculateATR(candles, period = 14) {

  const data = getPrices(candles);

  if (data.length <= period) {
    return null;
  }

  let trs = [];

  for (let i = 1; i < data.length; i++) {

    const high = data[i].high;
    const low = data[i].low;
    const prevClose = data[i - 1].close;

    const tr = Math.max(
      high - low,
      Math.abs(high - prevClose),
      Math.abs(low - prevClose)
    );

    trs.push(tr);

  }

  let atr =
    trs
      .slice(0, period)
      .reduce((a, b) => a + b, 0) / period;

  for (let i = period; i < trs.length; i++) {
    atr = ((atr * (period - 1)) + trs[i]) / period;
  }

  return Number(atr.toFixed(5));
}

module.exports = {
  calculateEMA,
  calculateRSI,
  calculateATR
};
