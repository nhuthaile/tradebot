const chart = require("asciichart");
const fs = require("fs");

function drawChartV1() {
  const lines = fs.readFileSync("./trade_log_1.txt", "utf8").split("\n");
  const assets = [];

  for (const line of lines) {
    if (line.includes("P/L USDT:")) {
      const asset = line.replace("P/L USDT:  ", "").trim();
      assets.push(parseFloat(asset));
    }
  }
  console.clear();
  console.log(
    chart.plot(assets, {
      height: 30,
    })
  );
}

drawChartV1();

fs.watch("./trade_log_1.txt", (event, filename) => {
  if (event === "change") {
    drawChartV1();
  }
});
