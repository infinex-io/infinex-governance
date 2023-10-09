#!/bin/bash

cd packages/core-tokens
npx hardhat run scripts/deploy.js --network $NETWORK
npx hardhat run scripts/verify.js --network $NETWORK
