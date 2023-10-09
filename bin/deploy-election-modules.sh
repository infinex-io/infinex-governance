#!/bin/bash

function deployAndVerify() {
  cd "packages/$1"
  npx hardhat deploy --noConfirm --debug --network $NETWORK
  npx hardhat deploy:verify --network $NETWORK
  cd ..
}

deployAndVerify core-contributor-council
deployAndVerify ecosystem-council
deployAndVerify trader-council
deployAndVerify treasury-council

