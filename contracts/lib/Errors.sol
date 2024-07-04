// SPDX-License-Identifier: UNLICENSE
pragma solidity ^0.8.0;

library Errors {
    error UnSetUSDTAddress();
    error USDTAmountTooSmall();
    error GameAlreadyHasPlayer();
    error OnlyBankerCanExecute();
    error GameAlreadySettled();
    error ExecutePeriodExpired();
    error InvalidExecute();
    error ExecutePeriodNotExpired();
}