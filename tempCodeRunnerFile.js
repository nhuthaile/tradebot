const ccxt = require("ccxt");
const moment = require("moment");

const fs = require("fs");
const myConsole = new console.Console(
  fs.createWriteStream("./trade_log_1.txt")
);

// const delay = import("delay");
const binance = new ccxt.binance({
  apiKey: "MlJF7IuEg2Gi3hxX1qDhmAn7KBINvFqXUNsBfrX9gLP1VSSW8pdNiLi12QIz7YtM",
  secret: "HFnO2JqHt1AC6FU21gouhaXBncrwALnGC1xvA1P9du38PJFJpw3YX392RKSZWydH",
});
binance.setSandboxMode(true);

async function printBalance(btcPrice) {
  const balance = await binance.fetchBalance();
  myConsole.log(
    `P/L USDT:  ${
      (balance.total.BTC - 0.91902) * btcPrice + balance.total.USDT - 14105
    }`
  );
  myConsole.log("");
  // myConsole.log(balance.total.BTC);
}

async function tick() {
  const price = await binance.fetchOHLCV("BTC/USDT", "1m", undefined, 5);
  const bPrice = price.map((price) => {
    return {
      timestamp: moment(price[0]).format(),
      open: price[1],
      high: price[2],
      Low: price[3],
      close: price[4],
      Volume: price[5],
    };
  });
  const averagePrice = bPrice.reduce((acc, price) => acc + price.close, 0) / 5;
  const lastPrice = bPrice[bPrice.length - 1].close;

  //   THUẬT TOÁN MUA CAO BÁN THẤP
  const takeAction = lastPrice > averagePrice ? "sell" : "buy";

  const TRADE_SIZE = 100;
  const quantity = 100 / lastPrice;

  const order = await binance.createMarketOrder(
    "BTC/USDT",
    takeAction,
    quantity
  );

  // =========IN KẾT QUẢ=====================
  // IN BALANCE
  printBalance(lastPrice);

  // IN KẾT QUẢ TRADE

  myConsole.log(`Action: ${takeAction}, Quantity: ${quantity}`);

  myConsole.log(`Average Price: ${averagePrice}, Last Price: ${lastPrice}`);

  myConsole.log(
    `${moment().format()}: ${takeAction} ${quantity} BTC at ${lastPrice}`
  );

  myConsole.log("++++++++++++@@@@@~~~^^~~~@@@@@+++++++++++++++");
}

async function main() {
  while (true) {
    await tick();
    // await delay(60 * 1000);
    await new Promise((resolve) => setTimeout(resolve, 60 * 1000));
  }
}

main();
