const { expect } = require('chai');
const { ethers } = require("hardhat");

describe("KulturmanToken", function() {
    let contract;
    let contractOwnerInitialBalance = 1_000_000n;
    let contractOwner;

    beforeEach(async () => {
        contract = await ethers.deployContract('KulturmanToken');
        contractOwner = (await ethers.getSigners())[0];
    })

    describe('BalanceOf', () => {
        it('It returns the correct balance', async () => {
            const [owner, anAddress] = await ethers.getSigners();

            expect(await contract.balanceOf(owner.address)).to.eq(contractOwnerInitialBalance);
            expect(await contract.balanceOf(anAddress.address)).to.eq(0);
        })
    })

    describe('Transfer', () => {
        it('Transfer succeeds token when sender has enough balance', async () => {
            const [sender, receiver] = await ethers.getSigners();
            const amountToSend = 50_000n;

            await expect(contract.transfer(receiver.address, amountToSend)).to.emit(contract, 'Transfer')
                .withArgs(sender, receiver.address, amountToSend);

            expect(await contract.balanceOf(sender.address)).to.equal(contractOwnerInitialBalance - amountToSend);
            expect(await contract.balanceOf(receiver.address)).to.equal(amountToSend);
        })

        it('Transfer fails when sender has not enough balance', async () => {
            const [sender, receiver] = await ethers.getSigners();
            await expect(contract.connect(sender).transfer(receiver.address, contractOwnerInitialBalance * 2n))
                .to.be.revertedWith('Not enough tokens');
            expect(await contract.balanceOf(sender.address)).to.equal(contractOwnerInitialBalance);
            expect(await contract.balanceOf(receiver.address)).to.equal(0);
        })
    })
})