module.exports = {
  name: "页数",
  // getInputUrl: ret => ret.url,
  selector: `.page-box.house-lst-page-box`,
  gather: () => {
    return JSON.parse($(`.page-box.house-lst-page-box`).attr("page-data"));
  },
  getOutputs: (gatherResult, path, name) => {
    const { totalPage } = gatherResult;
    const seeds = [];
    for (let i = 1; i <= totalPage; i++) {
      seeds.push({ url: `${path[path.length - 1].url}pg${i}/`, name: i });
    }
    return seeds;
  },
  effect: (output, path, name) => {
    console.log(
      `result : ${path.map(({ name }) => name).join(" -> ")} | ${name}: [ ${
        output.length
      } ]`
    );
  },
  timeout: 0
};
