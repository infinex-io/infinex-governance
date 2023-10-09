#!/bin/bash

function initialise() {
  cd "packages/$1"
  npx hardhat initialise --no-confirm --network $NETWORK
  cd ../../
}

initialise core-contributor-council
initialise ecosystem-council
initialise trader-council
initialise treasury-council

