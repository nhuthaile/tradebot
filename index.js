const ccxt = require("ccxt");
const moment = require("moment");
// const delay = import("delay");
// import delay from "delay";
const binance = new ccxt.binance({
  apiKey: "MlJF7IuEg2Gi3hxX1qDhmAn7KBINvFqXUNsBfrX9gLP1VSSW8pdNiLi12QIz7YtM",
  secret: "HFnO2JqHt1AC6FU21gouhaXBncrwALnGC1xvA1P9du38PJFJpw3YX392RKSZWydH",
});
binance.setSandboxMode(true);

// async function printBalance() {
//   const balance = await binance.fetchBalance();
//   console.log(`P/L BTC:  ${balance.BTC.total - 1}`);
//   console.log(`P/L USDT: ${balance.free.USDT - 14105}`);
//   console.log("~~~~~~~~~~*^*~~~~~~~~~~~");
// }

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
  // const takeAction = "buy";

  const TRADE_SIZE = 100;
  const quantity = 100 / lastPrice;
  // const quantity = 0.9;

  const order = await binance.createMarketOrder(
    "BTC/USDT",
    takeAction,
    quantity
  );

  // GỌI ĐẾN BALANCE

  const balance = await binance.fetchBalance();

  // =========IN KẾT QUẢ=====================
  console.log(
    `P/L USDT:  ${
      (balance.BTC.total - 1) * lastPrice + balance.free.USDT - 14105
    }`
  );
  // console.log(`P/L USDT: ${balance.free.USDT - 14105}`);

  console.log(`Action: ${takeAction}, Quantity: ${quantity}`);

  console.log(`Average Price: ${averagePrice}, Last Price: ${lastPrice}`);

  console.log(
    `${moment().format()}: ${takeAction} ${quantity} BTC at ${lastPrice}`
  );

  console.log("++++++++++++@@@@@~~~^^~~~@@@@@+++++++++++++++");
}

async function main() {
  while (true) {
    await tick();
    // await delay(60 * 1000);
    await new Promise((resolve) => setTimeout(resolve, 60 * 1000));
  }
}

main();

// printBalance();
