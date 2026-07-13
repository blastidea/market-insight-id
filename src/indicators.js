function calculateEMA(candles, period) {

  if (!candles || !Array.isArray(candles)) {
    return null;
  }

  // Twelve Data mengirim candle terbaru di index 0.
  // Dibalik supaya dihitung dari candle paling lama.
  const prices = [...candles]
    .reverse()
    .map(c => Number(c.close))
    .filter(price => Number.isFinite(price));

  if (prices.length < period) {
    return null;
  }

  const multiplier = 2 / (period + 1);

  // SMA awal
  let ema =
    prices
      .slice(0, period)
      .reduce((sum, price) => sum + price, 0) / period;

  // Hitung EMA
  for (let i = period; i < prices.length; i++) {
    ema = ((prices[i] - ema) * multiplier) + ema;
  }

  return Number(ema.toFixed(5));
}

module.exports = {
  calculateEMA
};
