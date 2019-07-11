module.exports = {
  name: "区域",
  // getInputUrl: ret => ret.url,
  selector: `.m-filter .position dl:last-child [data-role="ershoufang"] div:last-child`,
  gather: () => {
    return [
      ...$(
        `.m-filter .position dl:last-child [data-role="ershoufang"] div:last-child a`
      ).map((_, { innerText, href }) => ({
        data: innerText,
        url: href,
        name: innerText
      }))
    ];
  },
  // getOutputs: (gatherResult, path, name) => {
  //   return output;
  // },
  effect: (output, path, name) => {
    console.log(
      `result : ${path
        .map(({ name }) => name)
        .join(" -> ")} | ${name}: [ ${output
        .map(({ name }) => name)
        .join(", ")} ]`
    );
  },
  timeout: 0
};
