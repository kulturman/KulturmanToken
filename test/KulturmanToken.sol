// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {KulturmanToken} from "../src/KulturmanToken.sol";

contract CounterTest is Test {
    KulturmanToken public kulturmanToken;

    function setUp() public {
        kulturmanToken = new KulturmanToken();
    }
}
