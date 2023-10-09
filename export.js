const glob = require('glob');
const path = require('path');
const { constant } = require('case');

const network = process.env.NETWORK;
const files = glob.sync(
  path.join(__dirname, 'packages/*/deployments', network, '/official/*.json')
);

console.log(
  files
    .map((file) => {
      return (
        constant(/packages\/([^/]+)\//.exec(file)[1]) +
        '=' +
        Object.values(require(file).contracts).find((value) => {
          return value.isProxy;
        })?.deployedAddress
      );
    })
    .concat(
      Object.entries(
        require(path.join(__dirname, 'packages/core-tokens/deployment.' + network + '.json'))
      ).map(([key, value]) => constant(key) + '=' + value.address)
    )
    .join('\n')
);
