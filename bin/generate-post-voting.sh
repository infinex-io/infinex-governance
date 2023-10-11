#!/bin/bash

rm tx.csv

function generate() {
  cd "packages/$1"
  npx hardhat post-voting --no-confirm --network $NETWORK
  cd ../../
}

generate core-contributor-council
generate ecosystem-council
generate trader-council
generate treasury-council

