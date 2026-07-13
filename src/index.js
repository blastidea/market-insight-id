const { getCandles } = require("./market");
const {
  calculateEMA,
  calculateRSI,
  calculateATR
} = require("./indicators");
const {
  analyzeStructure
} = require("./marketStructure");
const {
  analyzeBOS
} = require("./bos");
const {
  analyzeCHOCH
} = require("./choch");
const {
  analyzeLiquidity
} = require("./liquidity");
const {
  analyzeOrderBlock
} = require("./orderBlock");
const {
  analyzeFVG
} = require("./fvg");
const {
  analyzeZone
} = require("./zone");
const {
  analyzeConfluence
} = require("./confluence");
const {
  analyzeRisk
} = require("./risk");
const {
  analyzeExecution
} = require("./execution");
const {
  analyzeState
} = require("./state");

// ==========================
// KONFIGURASI
// ==========================
const CONFIG = {
  // Pengaturan Pasar
  symbol: 'IDR/USD',
  interval: '1h',
  
  // Pengaturan Indikator
  indicators: {
    ema: {
      fast: 20,
      slow: 50
    },
    rsi: {
      period: 14,
      overbought: 70,
      oversold: 30
    },
    atr: {
      period: 14
    }
  },
  
  // Pengaturan Risk Management
  risk: {
    maxRiskPerTrade: 0.02,      // 2% per trade
    minRiskReward: 1.5,
    maxLossPerDay: 0.05         // 5% per hari
  },
  
  // Pengaturan Sistem
  system: {
    autoUpdate: true,
    updateInterval: '1h',      // 60 detik
    minCandles: 50,
    logLevel: 'INFO'            // INFO, WARNING, ERROR, DEBUG
  }
};

// ==========================
// SISTEM LOGGING
// ==========================
function log(level, message, data = {}) {
  const timestamp = new Date().toLocaleString('id-ID', {
    timeZone: 'Asia/Jakarta'
  });
  
  const emoji = {
    'INFO': 'ℹ️',
    'WARNING': '⚠️',
    'WARNING': '⚠️',
    'ERROR': '❌',
    'SUCCESS': '✅',
    'DEBUG': '🔍',
    'TRADE': '💰'
  };
  
  const colors = {
    'INFO': '\x1b[36m',      // Cyan
    'WARNING': '\x1b[33m',   // Yellow
    'ERROR': '\x1b[31m',     // Red
    'SUCCESS': '\x1b[32m',   // Green
    'DEBUG': '\x1b[35m',     // Magenta
    'TRADE': '\x1b[33m'      // Yellow
  };
  
  const reset = '\x1b[0m';
  const color = colors[level] || '';
  
  // Cek log level
  const levels = {
    'DEBUG': 0,
    'INFO': 1,
    'WARNING': 2,
    'ERROR': 3,
    'TRADE': 4,
    'SUCCESS': 5
  };
  
  if (levels[level] < levels[CONFIG.system.logLevel]) {
    return;
  }
  
  console.log(
    `${color}${emoji[level] || '📌'} [${timestamp}] ${message}${reset}`
  );
  
  if (Object.keys(data).length > 0) {
    console.log(JSON.stringify(data, null, 2));
  }
}

// ==========================
// VALIDASI DATA
// ==========================
function validateData(data) {
  const issues = [];
  
  if (!data) {
    issues.push('Data tidak tersedia');
    return issues;
  }
  
  if (!data.history || data.history.length < CONFIG.system.minCandles) {
    issues.push(`Data tidak cukup. Minimal ${CONFIG.system.minCandles} candle diperlukan.`);
  }
  
  if (!data.latest) {
    issues.push('Data harga terakhir tidak tersedia.');
  }
  
  if (data.history) {
    const hasNullValues = data.history.some(c => 
      c.open == null || c.high == null || c.low == null || c.close == null
    );
    
    if (hasNullValues) {
      issues.push('Ada data harga yang hilang (null).');
    }
  }
  
  return issues;
}

// ==========================
// ANALISIS UTAMA
// ==========================
async function analyzeMarket() {
  try {
    log('INFO', '🚀 Memulai analisis pasar...');
    
    // Ambil data
    const data = await getCandles();
    
    if (data.status === "error") {
      log('ERROR', 'Gagal mengambil data', { error: data });
      return null;
    }
    
    // Validasi data
    const validationIssues = validateData(data);
    if (validationIssues.length > 0) {
      validationIssues.forEach(issue => {
        log('WARNING', issue);
      });
      return null;
    }
    
    const last = data.latest;
    const history = data.history;
    
    log('SUCCESS', 'Data berhasil diambil', {
      symbol: data.symbol,
      interval: data.interval,
      candles: data.candles,
      price: last.close
    });
    
    // ==========================
    // HEADER
    // ==========================
    console.log("");
    console.log("\x1b[36m═══════════════════════════════════════════════════════════\x1b[0m");
    console.log("\x1b[1m\x1b[33m            📊 MARKET INSIGHT INDONESIA                \x1b[0m");
    console.log("\x1b[36m═══════════════════════════════════════════════════════════\x1b[0m");
    console.log(`\x1b[37mSymbol      :\x1b[0m ${data.symbol}`);
    console.log(`\x1b[37mInterval    :\x1b[0m ${data.interval}`);
    console.log(`\x1b[37mCandles     :\x1b[0m ${data.candles}`);
    console.log(`\x1b[37mWaktu       :\x1b[0m ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}`);
    console.log("\x1b[36m───────────────────────────────────────────────────────────\x1b[0m");
    
    // ==========================
    // REALTIME PRICE
    // ==========================
    console.log("");
    console.log("\x1b[1m\x1b[33m💰 REALTIME PRICE\x1b[0m");
    console.log("\x1b[36m───────────────────────────────────────────────────────────\x1b[0m");
    console.log(`\x1b[37mPrice       :\x1b[0m \x1b[1m${Number(last.close).toFixed(4)}\x1b[0m`);
    
    // Perubahan harga
    if (history.length > 1) {
      const priceChange = Number(last.close) - Number(history[1].close);
      const priceChangePercent = (priceChange / Number(history[1].close)) * 100;
      const arrow = priceChange >= 0 ? '🟢' : '🔴';
      console.log(`\x1b[37mChange      :\x1b[0m ${arrow} ${priceChange >= 0 ? '+' : ''}${priceChange.toFixed(4)} (${priceChangePercent >= 0 ? '+' : ''}${priceChangePercent.toFixed(2)}%)`);
    }
    
    // ==========================
    // LATEST CANDLE
    // ==========================
    console.log("");
    console.log("\x1b[1m\x1b[33m🕯️ LATEST CANDLE\x1b[0m");
    console.log("\x1b[36m───────────────────────────────────────────────────────────\x1b[0m");
    console.log(`\x1b[37mDatetime    :\x1b[0m ${last.datetime}`);
    console.log(`\x1b[37mOpen        :\x1b[0m ${Number(last.open).toFixed(4)}`);
    console.log(`\x1b[37mHigh        :\x1b[0m ${Number(last.high).toFixed(4)}`);
    console.log(`\x1b[37mLow         :\x1b[0m ${Number(last.low).toFixed(4)}`);
    console.log(`\x1b[37mClose       :\x1b[0m \x1b[1m${Number(last.close).toFixed(4)}\x1b[0m`);
    
    // Body dan Wick
    const body = Math.abs(Number(last.close) - Number(last.open));
    const upperWick = Number(last.high) - Math.max(Number(last.open), Number(last.close));
    const lowerWick = Math.min(Number(last.open), Number(last.close)) - Number(last.low);
    const totalRange = Number(last.high) - Number(last.low);
    
    console.log(`\x1b[37mBody        :\x1b[0m ${body.toFixed(4)} (${totalRange > 0 ? ((body/totalRange)*100).toFixed(1) : 0}%)`);
    console.log(`\x1b[37mUpper Wick  :\x1b[0m ${upperWick.toFixed(4)} (${totalRange > 0 ? ((upperWick/totalRange)*100).toFixed(1) : 0}%)`);
    console.log(`\x1b[37mLower Wick  :\x1b[0m ${lowerWick.toFixed(4)} (${totalRange > 0 ? ((lowerWick/totalRange)*100).toFixed(1) : 0}%)`);
    
    // Candle type
    const candleType = Number(last.close) > Number(last.open) ? '🟢 BULLISH' : '🔴 BEARISH';
    console.log(`\x1b[37mType        :\x1b[0m ${candleType}`);
    
    // ==========================
    // HISTORY CHECK
    // ==========================
    console.log("");
    console.log("\x1b[1m\x1b[33m📜 HISTORY CHECK\x1b[0m");
    console.log("\x1b[36m───────────────────────────────────────────────────────────\x1b[0m");
    console.log(`\x1b[37mOldest Close :\x1b[0m ${Number(history[history.length - 1].close).toFixed(4)}`);
    console.log(`\x1b[37mNewest Close :\x1b[0m ${Number(history[0].close).toFixed(4)}`);
    
    const totalChange = Number(history[0].close) - Number(history[history.length - 1].close);
    const totalChangePercent = (totalChange / Number(history[history.length - 1].close)) * 100;
    console.log(`\x1b[37mTotal Change :\x1b[0m ${totalChange >= 0 ? '+' : ''}${totalChange.toFixed(4)} (${totalChangePercent >= 0 ? '+' : ''}${totalChangePercent.toFixed(2)}%)`);
    
    // ==========================
    // INDICATOR ENGINE
    // ==========================
    const ema20 = calculateEMA(history, CONFIG.indicators.ema.fast);
    const ema50 = calculateEMA(history, CONFIG.indicators.ema.slow);
    const rsi14 = calculateRSI(history, CONFIG.indicators.rsi.period);
    const atr14 = calculateATR(history, CONFIG.indicators.atr.period);
    
    console.log("");
    console.log("\x1b[1m\x1b[33m📊 INDICATORS\x1b[0m");
    console.log("\x1b[36m───────────────────────────────────────────────────────────\x1b[0m");
    console.log(`\x1b[37mEMA${CONFIG.indicators.ema.fast}        :\x1b[0m ${Number(ema20).toFixed(4)}`);
    console.log(`\x1b[37mEMA${CONFIG.indicators.ema.slow}        :\x1b[0m ${Number(ema50).toFixed(4)}`);
    console.log(`\x1b[37mRSI${CONFIG.indicators.rsi.period}       :\x1b[0m ${Number(rsi14).toFixed(2)}`);
    console.log(`\x1b[37mATR${CONFIG.indicators.atr.period}       :\x1b[0m ${Number(atr14).toFixed(4)}`);
    
    // Trend
    let trend = "Sideways";
    let trendColor = '\x1b[37m';
    if (ema20 > ema50) {
      trend = "Bullish 📈";
      trendColor = '\x1b[32m';
    } else if (ema20 < ema50) {
      trend = "Bearish 📉";
      trendColor = '\x1b[31m';
    }
    console.log(`\x1b[37mTrend       :\x1b[0m ${trendColor}${trend}\x1b[0m`);
    
    // EMA Crossover
    const emaCross = ema20 > ema50 ? 'Golden Cross (Bullish)' : ema20 < ema50 ? 'Death Cross (Bearish)' : 'No Crossover';
    console.log(`\x1b[37mEMA Signal  :\x1b[0m ${emaCross}`);
    
    // ==========================
    // MARKET STATUS
    // ==========================
    console.log("");
    console.log("\x1b[1m\x1b[33m📈 MARKET STATUS\x1b[0m");
    console.log("\x1b[36m───────────────────────────────────────────────────────────\x1b[0m");
    
    let momentum = "Neutral";
    let momentumColor = '\x1b[37m';
    if (rsi14 >= CONFIG.indicators.rsi.overbought) {
      momentum = "Overbought";
      momentumColor = '\x1b[31m';
    } else if (rsi14 <= CONFIG.indicators.rsi.oversold) {
      momentum = "Oversold";
      momentumColor = '\x1b[32m';
    }
    console.log(`\x1b[37mMomentum    :\x1b[0m ${momentumColor}${momentum}\x1b[0m`);
    
    let bias = "Neutral";
    let biasColor = '\x1b[37m';
    if (trend.includes("Bullish")) {
      bias = "Bullish";
      biasColor = '\x1b[32m';
    } else if (trend.includes("Bearish")) {
      bias = "Bearish";
      biasColor = '\x1b[31m';
    }
    console.log(`\x1b[37mBias        :\x1b[0m ${biasColor}${bias}\x1b[0m`);
    
    let action = "Wait Confirmation";
    let actionColor = '\x1b[37m';
    if (trend.includes("Bullish") && rsi14 > 50 && rsi14 < 70) {
      action = "Look for BUY 🟢";
      actionColor = '\x1b[32m';
    } else if (trend.includes("Bearish") && rsi14 > 30 && rsi14 < 50) {
      action = "Look for SELL 🔴";
      actionColor = '\x1b[31m';
    }
    console.log(`\x1b[37mAction      :\x1b[0m ${actionColor}${action}\x1b[0m`);
    
    // ==========================
    // MARKET STRUCTURE
    // ==========================
    const market = analyzeStructure(history, atr14);
    
    console.log("");
    console.log("\x1b[1m\x1b[33m🏗️ MARKET STRUCTURE\x1b[0m");
    console.log("\x1b[36m───────────────────────────────────────────────────────────\x1b[0m");
    
    console.log(`\x1b[37mLast High   :\x1b[0m ${market.swingHigh ? Number(market.swingHigh.price).toFixed(4) : '-'}`);
    console.log(`\x1b[37mPrev High   :\x1b[0m ${market.prevHigh ? Number(market.prevHigh.price).toFixed(4) : '-'}`);
    console.log("");
    console.log(`\x1b[37mLast Low    :\x1b[0m ${market.swingLow ? Number(market.swingLow.price).toFixed(4) : '-'}`);
    console.log(`\x1b[37mPrev Low    :\x1b[0m ${market.prevLow ? Number(market.prevLow.price).toFixed(4) : '-'}`);
    console.log("");
    console.log(`\x1b[37mHigh Count  :\x1b[0m ${market.totalSwingHigh}`);
    console.log(`\x1b[37mLow Count   :\x1b[0m ${market.totalSwingLow}`);
    console.log("");
    
    let structureColor = '\x1b[37m';
    if (market.structure === 'UPTREND') structureColor = '\x1b[32m';
    else if (market.structure === 'DOWNTREND') structureColor = '\x1b[31m';
    console.log(`\x1b[37mStructure   :\x1b[0m ${structureColor}${market.structure}\x1b[0m`);
    console.log(`\x1b[37mBias        :\x1b[0m ${market.bias}`);
    
    // ==========================
    // RECENT SWING HIGHS
    // ==========================
    console.log("");
    console.log("\x1b[1m\x1b[33m📈 RECENT SWING HIGHS\x1b[0m");
    console.log("\x1b[36m───────────────────────────────────────────────────────────\x1b[0m");
    
    const recentHighs = market.swingHighs.slice(-5).reverse();
    if (recentHighs.length > 0) {
      recentHighs.forEach((item, index) => {
        console.log(`  ${index + 1}. ${Number(item.price).toFixed(4)} | ${item.datetime}`);
      });
    } else {
      console.log("  Tidak ada data swing high");
    }
    
    // ==========================
    // RECENT SWING LOWS
    // ==========================
    console.log("");
    console.log("\x1b[1m\x1b[33m📉 RECENT SWING LOWS\x1b[0m");
    console.log("\x1b[36m───────────────────────────────────────────────────────────\x1b[0m");
    
    const recentLows = market.swingLows.slice(-5).reverse();
    if (recentLows.length > 0) {
      recentLows.forEach((item, index) => {
        console.log(`  ${index + 1}. ${Number(item.price).toFixed(4)} | ${item.datetime}`);
      });
    } else {
      console.log("  Tidak ada data swing low");
    }
    
    // ==========================
    // BREAK OF STRUCTURE (BOS)
    // ==========================
    const bos = analyzeBOS(
      Number(last.close),
      market,
      atr14
    );
    
    console.log("");
    console.log("\x1b[1m\x1b[33m🔨 BREAK OF STRUCTURE (BOS)\x1b[0m");
    console.log("\x1b[36m───────────────────────────────────────────────────────────\x1b[0m");
    
    let bosColor = '\x1b[37m';
    if (bos.direction === 'BULLISH') bosColor = '\x1b[32m';
    else if (bos.direction === 'BEARISH') bosColor = '\x1b[31m';
    
    console.log(`\x1b[37mDirection   :\x1b[0m ${bosColor}${bos.direction || '-'}\x1b[0m`);
    console.log(`\x1b[37mLevel       :\x1b[0m ${bos.level ? Number(bos.level).toFixed(4) : '-'}`);
    console.log(`\x1b[37mStatus      :\x1b[0m ${bos.status || '-'}`);
    console.log(`\x1b[37mStrength    :\x1b[0m ${bos.strength || '-'}`);
    
    // ==========================
    // CHOCH
    // ==========================
    const choch = analyzeCHOCH(
      Number(last.close),
      market,
      bos
    );
    
    console.log("");
    console.log("\x1b[1m\x1b[33m🔄 CHANGE OF CHARACTER (CHOCH)\x1b[0m");
    console.log("\x1b[36m───────────────────────────────────────────────────────────\x1b[0m");
    
    let chochColor = '\x1b[37m';
    if (choch.direction === 'BULLISH') chochColor = '\x1b[32m';
    else if (choch.direction === 'BEARISH') chochColor = '\x1b[31m';
    
    console.log(`\x1b[37mDirection   :\x1b[0m ${chochColor}${choch.direction || '-'}\x1b[0m`);
    console.log(`\x1b[37mLevel       :\x1b[0m ${choch.level ? Number(choch.level).toFixed(4) : '-'}`);
    console.log(`\x1b[37mStatus      :\x1b[0m ${choch.status || '-'}`);
    
    // ==========================
    // LIQUIDITY
    // ==========================
    const liquidity = analyzeLiquidity(
      history,
      market,
      bos,
      atr14
    );
    
    console.log("");
    console.log("\x1b[1m\x1b[33m💧 LIQUIDITY SWEEP\x1b[0m");
    console.log("\x1b[36m───────────────────────────────────────────────────────────\x1b[0m");
    
    let liquidityColor = '\x1b[37m';
    if (liquidity.type === 'BUY') liquidityColor = '\x1b[32m';
    else if (liquidity.type === 'SELL') liquidityColor = '\x1b[31m';
    
    console.log(`\x1b[37mType        :\x1b[0m ${liquidityColor}${liquidity.type || '-'}\x1b[0m`);
    console.log(`\x1b[37mLevel       :\x1b[0m ${liquidity.level ? Number(liquidity.level).toFixed(4) : '-'}`);
    console.log(`\x1b[37mStatus      :\x1b[0m ${liquidity.status || '-'}`);
    console.log(`\x1b[37mStrength    :\x1b[0m ${liquidity.strength || '-'}`);
    console.log(`\x1b[37mCandle      :\x1b[0m ${liquidity.candle || '-'}`);
    
    // ==========================
    // ORDER BLOCK
    // ==========================
    const orderBlock = analyzeOrderBlock(
      history,
      bos,
      atr14
    );
    
    console.log("");
    console.log("\x1b[1m\x1b[33m📦 ORDER BLOCK\x1b[0m");
    console.log("\x1b[36m───────────────────────────────────────────────────────────\x1b[0m");
    
    let obColor = '\x1b[37m';
    if (orderBlock.type === 'BULLISH') obColor = '\x1b[32m';
    else if (orderBlock.type === 'BEARISH') obColor = '\x1b[31m';
    
    console.log(`\x1b[37mType        :\x1b[0m ${obColor}${orderBlock.type || '-'}\x1b[0m`);
    console.log(`\x1b[37mZone High   :\x1b[0m ${Number(orderBlock.high).toFixed(4)}`);
    console.log(`\x1b[37mZone Low    :\x1b[0m ${Number(orderBlock.low).toFixed(4)}`);
    console.log(`\x1b[37mStatus      :\x1b[0m ${orderBlock.status || '-'}`);
    console.log(`\x1b[37mMitigation  :\x1b[0m ${orderBlock.mitigation || '-'}`);
    console.log(`\x1b[37mStrength    :\x1b[0m ${orderBlock.strength || '-'}`);
    console.log(`\x1b[37mScore       :\x1b[0m ${orderBlock.score || 0}%`);
    console.log(`\x1b[37mDistance    :\x1b[0m ${orderBlock.distance || '-'}`);
    console.log(`\x1b[37mDatetime    :\x1b[0m ${orderBlock.datetime || '-'}`);
    console.log(`\x1b[37mQuality     :\x1b[0m ${orderBlock.quality || '-'}`);
    console.log(`\x1b[37mZone Size   :\x1b[0m ${orderBlock.zoneSize || '-'}`);
    console.log(`\x1b[37mLocation    :\x1b[0m ${orderBlock.location || '-'}`);
    console.log(`\x1b[37mAge         :\x1b[0m ${orderBlock.age || '-'}`);
    console.log(`\x1b[37mFVG         :\x1b[0m ${orderBlock.fvg || '-'}`);
    console.log(`\x1b[37mFVG Strength:\x1b[0m ${orderBlock.fvgStrength || '-'}`);
    
    // ==========================
    // FAIR VALUE GAP
    // ==========================
    const fvg = analyzeFVG(
      history,
      atr14
    );
    
    console.log("");
    console.log("\x1b[1m\x1b[33m🔲 FAIR VALUE GAP (FVG)\x1b[0m");
    console.log("\x1b[36m───────────────────────────────────────────────────────────\x1b[0m");
    
    let fvgColor = '\x1b[37m';
    if (fvg.type === 'BULLISH') fvgColor = '\x1b[32m';
    else if (fvg.type === 'BEARISH') fvgColor = '\x1b[31m';
    
    console.log(`\x1b[37mType        :\x1b[0m ${fvgColor}${fvg.type || '-'}\x1b[0m`);
    console.log(`\x1b[37mHigh        :\x1b[0m ${fvg.high ? Number(fvg.high).toFixed(4) : '-'}`);
    console.log(`\x1b[37mLow         :\x1b[0m ${fvg.low ? Number(fvg.low).toFixed(4) : '-'}`);
    console.log(`\x1b[37mStatus      :\x1b[0m ${fvg.status || '-'}`);
    console.log(`\x1b[37mFilled      :\x1b[0m ${fvg.filled || '-'}`);
    console.log(`\x1b[37mStrength    :\x1b[0m ${fvg.strength || '-'}`);
    console.log(`\x1b[37mScore       :\x1b[0m ${fvg.score || 0}%`);
    console.log(`\x1b[37mDatetime    :\x1b[0m ${fvg.datetime || '-'}`);
    
    // ==========================
    // MARKET ZONE
    // ==========================
    const zone = analyzeZone(
      Number(last.close),
      market,
      bos,
      atr14,
      rsi14,
      orderBlock,
      fvg
    );
    
    console.log("");
    console.log("\x1b[1m\x1b[33m📍 MARKET ZONE\x1b[0m");
    console.log("\x1b[36m───────────────────────────────────────────────────────────\x1b[0m");
    
    let zoneColor = '\x1b[37m';
    if (zone.zone === 'BULLISH') zoneColor = '\x1b[32m';
    else if (zone.zone === 'BEARISH') zoneColor = '\x1b[31m';
    
    console.log(`\x1b[37mZone        :\x1b[0m ${zoneColor}${zone.zone || '-'}\x1b[0m`);
    console.log(`\x1b[37mLocation    :\x1b[0m ${zone.location || '-'}`);
    console.log(`\x1b[37mBias        :\x1b[0m ${zone.bias || '-'}`);
    console.log("");
    console.log(`\x1b[37mHigh        :\x1b[0m ${Number(zone.high).toFixed(4)}`);
    console.log(`\x1b[37mLow         :\x1b[0m ${Number(zone.low).toFixed(4)}`);
    console.log(`\x1b[37mEquilibrium :\x1b[0m ${Number(zone.equilibrium).toFixed(4)}`);
    console.log("");
    console.log(`\x1b[37mFib 0.618   :\x1b[0m ${Number(zone.fib618).toFixed(4)}`);
    console.log(`\x1b[37mFib 0.382   :\x1b[0m ${Number(zone.fib382).toFixed(4)}`);
    console.log("");
    console.log(`\x1b[37mDistance    :\x1b[0m ${zone.distance || '-'}`);
    console.log(`\x1b[37mScore       :\x1b[0m ${zone.score || 0}%`);
    
    // ==========================
    // AI CONFLUENCE
    // ==========================
    const decision = analyzeConfluence(
      trend,
      rsi14,
      bos,
      choch,
      liquidity,
      orderBlock,
      fvg,
      zone,
      atr14
    );
    
    console.log("");
    console.log("\x1b[1m\x1b[33m🤖 AI MARKET DECISION\x1b[0m");
    console.log("\x1b[36m───────────────────────────────────────────────────────────\x1b[0m");
    console.log(`\x1b[37mBullish Score :\x1b[0m ${decision.bullishScore || 0}%`);
    console.log(`\x1b[37mBearish Score :\x1b[0m ${decision.bearishScore || 0}%`);
    
    let biasDecisionColor = '\x1b[37m';
    if (decision.bias === 'BULLISH') biasDecisionColor = '\x1b[32m';
    else if (decision.bias === 'BEARISH') biasDecisionColor = '\x1b[31m';
    
    console.log(`\x1b[37mBias          :\x1b[0m ${biasDecisionColor}${decision.bias || '-'}\x1b[0m`);
    console.log(`\x1b[37mSetup         :\x1b[0m ${decision.setup || '-'}`);
    
    let confidenceColor = '\x1b[37m';
    if (decision.confidence >= 70) confidenceColor = '\x1b[32m';
    else if (decision.confidence >= 50) confidenceColor = '\x1b[33m';
    else confidenceColor = '\x1b[31m';
    
    console.log(`\x1b[37mConfidence    :\x1b[0m ${confidenceColor}${decision.confidence || 0}%\x1b[0m`);
    
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
    console.log("\x1b[1m\x1b[33m🛡️ RISK ENGINE\x1b[0m");
    console.log("\x1b[36m───────────────────────────────────────────────────────────\x1b[0m");
    
    let riskColor = '\x1b[37m';
    if (risk.riskLevel === 'LOW') riskColor = '\x1b[32m';
    else if (risk.riskLevel === 'MEDIUM') riskColor = '\x1b[33m';
    else if (risk.riskLevel === 'HIGH') riskColor = '\x1b[31m';
    
    console.log(`\x1b[37mAction        :\x1b[0m ${risk.action || '-'}`);
    console.log(`\x1b[37mReason        :\x1b[0m ${risk.reason || '-'}`);
    console.log(`\x1b[37mRisk Level    :\x1b[0m ${riskColor}${risk.riskLevel || '-'}\x1b[0m`);
    console.log("");
    console.log(`\x1b[37mEntry         :\x1b[0m ${risk.entry ? Number(risk.entry).toFixed(4) : '-'}`);
    console.log(`\x1b[37mStop Loss     :\x1b[0m ${risk.stopLoss ? Number(risk.stopLoss).toFixed(4) : '-'}`);
    console.log("");
    console.log(`\x1b[37mTarget TP1    :\x1b[0m ${risk.target?.tp1 ? Number(risk.target.tp1).toFixed(4) : '-'}`);
    console.log(`\x1b[37mTarget TP2    :\x1b[0m ${risk.target?.tp2 ? Number(risk.target.tp2).toFixed(4) : '-'}`);
    console.log(`\x1b[37mTarget TP3    :\x1b[0m ${risk.target?.tp3 ? Number(risk.target.tp3).toFixed(4) : '-'}`);
    console.log("");
    console.log(`\x1b[37mRisk Reward   :\x1b[0m ${risk.riskReward > 0 ? risk.riskReward.toFixed(2) : '-'}`);
    
    // ==========================
    // STATE ENGINE
    // ==========================
    const state = analyzeState(
      Number(last.close),
      risk.entry,
      atr14
    );
    
    console.log("");
    console.log("\x1b[1m\x1b[33m🔄 STATE ENGINE\x1b[0m");
    console.log("\x1b[36m───────────────────────────────────────────────────────────\x1b[0m");
    
    let stateColor = '\x1b[37m';
    if (state.state === 'ENTER' || state.state === 'HOLD') stateColor = '\x1b[32m';
    else if (state.state === 'EXIT') stateColor = '\x1b[31m';
    
    console.log(`\x1b[37mState         :\x1b[0m ${stateColor}${state.state || '-'}\x1b[0m`);
    console.log(`\x1b[37mReason        :\x1b[0m ${state.reason || '-'}`);
    console.log(`\x1b[37mDistance      :\x1b[0m ${state.distance || '-'}`);
    console.log(`\x1b[37mATR           :\x1b[0m ${state.atr ? Number(state.atr).toFixed(4) : '-'}`);
    console.log(`\x1b[37mEntry         :\x1b[0m ${state.entry ? Number(state.entry).toFixed(4) : '-'}`);
    
    // ==========================
    // EXECUTION ENGINE
    // ==========================
    const execution = analyzeExecution(
      decision,
      risk,
      orderBlock,
      liquidity,
      bos,
      choch,
      history,
      Number(last.close),
      atr14,
      state
    );
    
    console.log("");
    console.log("\x1b[1m\x1b[33m⚡ EXECUTION ENGINE\x1b[0m");
    console.log("\x1b[36m───────────────────────────────────────────────────────────\x1b[0m");
    
    let execColor = '\x1b[37m';
    if (execution.status === 'READY' || execution.status === 'EXECUTED') execColor = '\x1b[32m';
    else if (execution.status === 'REJECTED') execColor = '\x1b[31m';
    
    console.log(`\x1b[37mStatus        :\x1b[0m ${execColor}${execution.status || '-'}\x1b[0m`);
    
    let directionColor = '\x1b[37m';
    if (execution.direction === 'BUY') directionColor = '\x1b[32m';
    else if (execution.direction === 'SELL') directionColor = '\x1b[31m';
    
    console.log(`\x1b[37mDirection     :\x1b[0m ${directionColor}${execution.direction || '-'}\x1b[0m`);
    console.log(`\x1b[37mEntry         :\x1b[0m ${execution.entry ? Number(execution.entry).toFixed(4) : '-'}`);
    console.log(`\x1b[37mStop Loss     :\x1b[0m ${execution.stopLoss ? Number(execution.stopLoss).toFixed(4) : '-'}`);
    console.log(`\x1b[37mTarget        :\x1b[0m ${execution.target ? Number(execution.target).toFixed(4) : '-'}`);
    console.log(`\x1b[37mRisk Reward   :\x1b[0m ${execution.riskReward > 0 ? execution.riskReward.toFixed(2) : '-'}`);
    console.log(`\x1b[37mConfidence    :\x1b[0m ${execution.confidence != null ? execution.confidence + '%' : '-'}`);
    console.log(`\x1b[37mReason        :\x1b[0m ${execution.reason || '-'}`);
    console.log(`\x1b[37mVersion       :\x1b[0m ${execution.version || '-'}`);
    
    // ==========================
    // TRADE PLAN
    // ==========================
    console.log("");
    console.log("\x1b[1m\x1b[33m📋 TRADE PLAN\x1b[0m");
    console.log("\x1b[36m───────────────────────────────────────────────────────────\x1b[0m");
    console.log(`\x1b[37mEntry         :\x1b[0m ${execution.entry ? Number(execution.entry).toFixed(4) : '-'}`);
    console.log(`\x1b[37mStop Loss     :\x1b[0m ${execution.stopLoss ? Number(execution.stopLoss).toFixed(4) : '-'}`);
    console.log(`\x1b[37mTarget        :\x1b[0m ${execution.target ? Number(execution.target).toFixed(4) : '-'}`);
    console.log(`\x1b[37mRisk Reward   :\x1b[0m ${execution.riskReward > 0 ? execution.riskReward.toFixed(2) : '-'}`);
    
    // ==========================
    // RINGKASAN
    // ==========================
    console.log("");
    console.log("\x1b[36m═══════════════════════════════════════════════════════════\x1b[0m");
    console.log("\x1b[1m\x1b[33m📊 RINGKASAN ANALISIS\x1b[0m");
    console.log("\x1b[36m═══════════════════════════════════════════════════════════\x1b[0m");
    console.log(`\x1b[37m🕐 Waktu      :\x1b[0m ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}`);
    console.log(`\x1b[37m📈 Symbol     :\x1b[0m ${data.symbol}`);
    console.log(`\x1b[37m💰 Harga      :\x1b[0m ${Number(last.close).toFixed(4)}`);
    console.log(`\x1b[37m📊 Bias       :\x1b[0m ${biasColor}${bias}\x1b[0m`);
    console.log(`\x1b[37m🎯 Setup      :\x1b[0m ${decision.setup || '-'}`);
    console.log(`\x1b[37m📊 Confidence :\x1b[0m ${confidenceColor}${decision.confidence || 0}%\x1b[0m`);
    console.log(`\x1b[37m⚡ Momentum   :\x1b[0m ${momentumColor}${momentum}\x1b[0m`);
    console.log(`\x1b[37m📉 Trend      :\x1b[0m ${trendColor}${trend}\x1b[0m`);
    console.log("");
    console.log("\x1b[1m\x1b[33m🛡️ RISK MANAGEMENT\x1b[0m");
    console.log("\x1b[36m───────────────────────────────────────────────────────────\x1b[0m");
    console.log(`\x1b[37mRisk Level :\x1b[0m ${riskColor}${risk.riskLevel || '-'}\x1b[0m`);
    console.log(`\x1b[37mEntry      :\x1b[0m ${risk.entry ? Number(risk.entry).toFixed(4) : '-'}`);
    console.log(`\x1b[37mStop Loss  :\x1b[0m ${risk.stopLoss ? Number(risk.stopLoss).toFixed(4) : '-'}`);
    console.log(`\x1b[37mTP1        :\x1b[0m ${risk.target?.tp1 ? Number(risk.target.tp1).toFixed(4) : '-'}`);
    console.log(`\x1b[37mTP2        :\x1b[0m ${risk.target?.tp2 ? Number(risk.target.tp2).toFixed(4) : '-'}`);
    console.log(`\x1b[37mTP3        :\x1b[0m ${risk.target?.tp3 ? Number(risk.target.tp3).toFixed(4) : '-'}`);
    console.log(`\x1b[37mRisk/Reward:\x1b[0m ${risk.riskReward > 0 ? risk.riskReward.toFixed(2) : '-'}`);
    console.log("");
    console.log("\x1b[1m\x1b[33m🚀 EKSEKUSI\x1b[0m");
    console.log("\x1b[36m───────────────────────────────────────────────────────────\x1b[0m");
    console.log(`\x1b[37mStatus     :\x1b[0m ${execColor}${execution.status || 'Tidak ada sinyal'}\x1b[0m`);
    console.log(`\x1b[37mAlasan     :\x1b[0m ${execution.reason || '-'}`);
    console.log(`\x1b[37mEntry      :\x1b[0m ${execution.entry ? Number(execution.entry).toFixed(4) : '-'}`);
    console.log(`\x1b[37mStop Loss  :\x1b[0m ${execution.stopLoss ? Number(execution.stopLoss).toFixed(4) : '-'}`);
    console.log(`\x1b[37mTarget     :\x1b[0m ${execution.target ? Number(execution.target).toFixed(4) : '-'}`);
    console.log(`\x1b[37mRisk/Reward:\x1b[0m ${execution.riskReward > 0 ? execution.riskReward.toFixed(2) : '-'}`);
    console.log("\x1b[36m═══════════════════════════════════════════════════════════\x1b[0m");
    
    // ==========================
    // NOTIFIKASI SINYAL
    // ==========================
    if (execution.status === 'READY' && decision.confidence >= 70) {
      log('TRADE', '🚀 SINYAL TRADE DITEMUKAN!', {
        direction: execution.direction,
        entry: Number(execution.entry).toFixed(4),
        stopLoss: Number(execution.stopLoss).toFixed(4),
        target: Number(execution.target).toFixed(4),
        riskReward: execution.riskReward.toFixed(2),
        confidence: decision.confidence + '%'
      });
    }
    
    log('SUCCESS', '✅ Analisis selesai');
    
    return {
      data,
      indicators: { ema20, ema50, rsi14, atr14 },
      market,
      bos,
      choch,
      liquidity,
      orderBlock,
      fvg,
      zone,
      decision,
      risk,
      state,
      execution,
      trend,
      momentum,
      bias,
      action
    };
    
  } catch (err) {
    log('ERROR', 'Terjadi error dalam analisis', {
      message: err.message,
      stack: err.stack
    });
    
    if (err.response) {
      log('ERROR', 'Detail API Error', {
        status: err.response.status,
        data: err.response.data
      });
    }
    
    return null;
  }
}

// ==========================
// SISTEM AUTO-UPDATE
// ==========================
let running = true;
let lastResult = null;

async function mainLoop() {
  console.clear();
  log('INFO', '🚀 Memulai Market Insight Indonesia');
  log('INFO', `📊 Mode: ${CONFIG.system.autoUpdate ? 'Auto-Update' : 'Single Run'}`);
  log('INFO', `⏱️ Interval: ${CONFIG.system.updateInterval/1000} detik`);
  log('INFO', `📈 Symbol: ${CONFIG.symbol}`);
  log('INFO', `📊 Interval: ${CONFIG.interval}`);
  console.log("");
  
  while (running) {
    const startTime = Date.now();
    
    try {
      const result = await analyzeMarket();
      if (result) {
        lastResult = result;
      }
    } catch (err) {
      log('ERROR', 'Error dalam main loop', {
        message: err.message
      });
    }
    
    if (!CONFIG.system.autoUpdate) {
      break;
    }
    
    const elapsed = Date.now() - startTime;
    const waitTime = Math.max(CONFIG.system.updateInterval - elapsed, 5000);
    
    log('INFO', `⏳ Menunggu ${Math.round(waitTime/1000)} detik untuk update berikutnya...`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
    
    // Clear console untuk update berikutnya (opsional)
    // console.clear();
  }
}

// ==========================
// GRACEFUL SHUTDOWN
// ==========================
process.on('SIGINT', () => {
  running = false;
  console.log("");
  log('WARNING', '🛑 Menerima sinyal shutdown...');
  log('WARNING', '📊 Menyimpan state terakhir...');
  
  // Simpan hasil terakhir jika perlu
  if (lastResult) {
    log('INFO', '💾 State terakhir disimpan');
  }
  
  log('SUCCESS', '✅ Sistem dimatikan dengan aman');
  process.exit(0);
});

process.on('SIGTERM', () => {
  running = false;
  console.log("");
  log('WARNING', '🛑 Menerima sinyal termination...');
  process.exit(0);
});

// ==========================
// HANDLE UNCAUGHT EXCEPTIONS
// ==========================
process.on('uncaughtException', (err) => {
  log('ERROR', '💥 Uncaught Exception!', {
    message: err.message,
    stack: err.stack
  });
});

process.on('unhandledRejection', (reason, promise) => {
  log('ERROR', '💥 Unhandled Rejection!', {
    reason: reason,
    promise: promise
  });
});

// ==========================
// JALANKAN
// ==========================
if (require.main === module) {
  mainLoop().catch(err => {
    log('ERROR', '💥 Fatal error di main loop', {
      message: err.message,
      stack: err.stack
    });
    process.exit(1);
  });
}

// ==========================
// EXPORT UNTUK TESTING
// ==========================
module.exports = {
  analyzeMarket,
  validateData,
  CONFIG,
  mainLoop
};
