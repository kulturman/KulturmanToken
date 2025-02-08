const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule('KulturmanTokenModule', m => {
    const contract = m.contract('KulturmanToken');

    return { contract };
});