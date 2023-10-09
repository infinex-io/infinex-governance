#!/bin/bash

cd packages/core-tokens
npx hardhat run scripts/transfer.js --network $NETWORK
cd ..
