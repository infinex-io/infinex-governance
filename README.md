# synthetix-v3

[![codecov](https://codecov.io/gh/Synthetixio/synthetix-v3/branch/main/graph/badge.svg)](https://codecov.io/gh/Synthetixio/synthetix-v3)

| Package              | Coverage                                                                                                                                                           |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| core-js              | [![codecov](https://codecov.io/gh/Synthetixio/synthetix-v3/branch/main/graph/badge.svg?flag=core-js)](https://codecov.io/gh/Synthetixio/synthetix-v3)              |
| core-contracts       | [![codecov](https://codecov.io/gh/Synthetixio/synthetix-v3/branch/main/graph/badge.svg?flag=core-contracts)](https://codecov.io/gh/Synthetixio/synthetix-v3)       |
| core-modules         | [![codecov](https://codecov.io/gh/Synthetixio/synthetix-v3/branch/main/graph/badge.svg?flag=core-modules)](https://codecov.io/gh/Synthetixio/synthetix-v3)         |
| deployer             | [![codecov](https://codecov.io/gh/Synthetixio/synthetix-v3/branch/main/graph/badge.svg?flag=deployer)](https://codecov.io/gh/Synthetixio/synthetix-v3)             |
| synthetix-main       | [![codecov](https://codecov.io/gh/Synthetixio/synthetix-v3/branch/main/graph/badge.svg?flag=synthetix-main)](https://codecov.io/gh/Synthetixio/synthetix-v3)       |
| spartan-council      | [![codecov](https://codecov.io/gh/Synthetixio/synthetix-v3/branch/main/graph/badge.svg?flag=spartan-council)](https://codecov.io/gh/Synthetixio/synthetix-v3)      |
| grants-council       | [![codecov](https://codecov.io/gh/Synthetixio/synthetix-v3/branch/main/graph/badge.svg?flag=grants-council)](https://codecov.io/gh/Synthetixio/synthetix-v3)       |
| treasury-council     | [![codecov](https://codecov.io/gh/Synthetixio/synthetix-v3/branch/main/graph/badge.svg?flag=treasury-council)](https://codecov.io/gh/Synthetixio/synthetix-v3)     |
| ambassador-council   | [![codecov](https://codecov.io/gh/Synthetixio/synthetix-v3/branch/main/graph/badge.svg?flag=ambassador-council)](https://codecov.io/gh/Synthetixio/synthetix-v3)   |
| synthetix-governance | [![codecov](https://codecov.io/gh/Synthetixio/synthetix-v3/branch/main/graph/badge.svg?flag=synthetix-governance)](https://codecov.io/gh/Synthetixio/synthetix-v3) |


```bash
# deploys the governance proxy
ETHERSCAN_API_KEY= DEPLOYER_PRIVATE_KEY= NETWORK_ENDPOINT= npx hardhat deploy --network goerli
# verifies some contracts
ETHERSCAN_API_KEY= DEPLOYER_PRIVATE_KEY= NETWORK_ENDPOINT= npx hardhat deploy:verify --network goerli
# deploys the surrounding contracts
ETHERSCAN_API_KEY= DEPLOYER_PRIVATE_KEY= NETWORK_ENDPOINT= npx hardhat run scripts/deploy.js --network goerli
# verify the surrounding contracts
ETHERSCAN_API_KEY= DEPLOYER_PRIVATE_KEY= NETWORK_ENDPOINT= npx hardhat run scripts/verify.js --network goerli
# initialises the governance
ETHERSCAN_API_KEY= DEPLOYER_PRIVATE_KEY= NETWORK_ENDPOINT= npx hardhat run scripts/initialise.js --network goerli

# interacts with a deployment
ETHERSCAN_API_KEY= DEPLOYER_PRIVATE_KEY= NETWORK_ENDPOINT= npx hardhat interact --network goerli
```
