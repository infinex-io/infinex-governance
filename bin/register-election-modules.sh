#!/bin/bash

rm tx.csv

function register() {
  cd "packages/$1"
  npx hardhat register --no-confirm --network $NETWORK
  cd ../../
}

register core-contributor-council
register ecosystem-council
register trader-council
register treasury-council

