#!/bin/bash

function deployAndVerify() {
  cd "packages/$1"
  print $(pwd)
  npx hardhat deploy --no-confirm --network $NETWORK
  npx hardhat deploy:verify --network $NETWORK
  cd ../../
}

deployAndVerify core-contributor-council
deployAndVerify ecosystem-council
deployAndVerify trader-council
deployAndVerify treasury-council

