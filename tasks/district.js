module.exports = {
  name: "县/区",
  // getInputUrl: ret => ret.url,
  selector: `.m-filter .position dl:last-child [data-role="ershoufang"] div:first-child`,
  gather: () => {
    return [
      ...$(
        `.m-filter .position dl:last-child [data-role="ershoufang"] div:first-child a`
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
  timeout: 0,
  seeds: [
    {
      url: `https://su.ke.com/chengjiao/`,
      data: [],
      name: "苏州"
    }
  ]
};
