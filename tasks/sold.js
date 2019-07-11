const fs = require("fs");
const csv = require("fast-csv");
const { EOL } = require("os");
let totalCount = 0;

const ws = fs.createWriteStream(`./data/ke/su.csv`);
const csvStream = csv
  .parse()
  .pipe(ws)
  .on("error", error => console.error(error))
  .on("data", row => console.log("write", row))
  .on("end", rowCount => console.log(`Parsed ${rowCount} rows`));

module.exports = {
  name: "县/区",
  // getInputUrl: ret => ret.url,
  selector: `ul.listContent li .info div`,
  gather: () => {
    return [].slice.apply(
      // eslint-disable-next-line no-undef
      $(`ul.listContent li .info`).map((i, a) => {
        // eslint-disable-next-line no-undef
        const infoEl = $(a);
        return {
          title: infoEl.find(".title").text().replace(/\s/g,''),
          houseInfo: infoEl.find(".houseInfo").text().replace(/\s/g,''),
          dealDate: infoEl.find(".dealDate").text().replace(/\s/g,''),
          totalPrice: infoEl.find(".totalPrice").text().replace(/\s/g,''),
          positionInfo: infoEl.find(".positionInfo").text().replace(/\s/g,''),
          unitPrice: infoEl.find(".unitPrice").text().replace(/\s/g,''),
          dealHouseTxt: infoEl.find(".dealHouseTxt").text().replace(/\s/g,''),
          dealCycleTxt: infoEl.find(".dealCycleTxt").text().replace(/\s/g,''),
          dealHouseInfo: infoEl.find(".dealHouseInfo").text().replace(/\s/g,''),
          agentName: infoEl.find(".agent_name").text().replace(/\s/g,''),
        };
      })
    );
  },
  // getOutputs: (output, path, name) => {
  //   return output;
  // },
  effect: (output, path, name) => {
    output.forEach(row => {
      const csvRow = Object.assign(
        {
          "城市/": "苏州",
          "区/县": path[1].name,
          "区域/": path[2].name
        },
        row
      );
      const data = Object.values(csvRow).join(",") + EOL;
      csvStream.write(data);
    });
    console.log(
      `抓取成功并写入${output.length}行，共${(totalCount +=
        output.length)}条成交记录。`
    );
    return output;
  },
  timeout: 0
};
