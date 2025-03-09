// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {KulturmanToken} from "../src/KulturmanToken.sol";

contract CounterScript is Script {
    KulturmanToken public kulturmanToken;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        kulturmanToken = new KulturmanToken();

        vm.stopBroadcast();
    }
}
