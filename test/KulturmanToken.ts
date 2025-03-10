import {expect} from 'chai';
import hre from "hardhat";
import {Signer} from "ethers";
import {KulturmanToken} from "../typechain-types";


describe("KulturmanToken", function () {
    let contract: KulturmanToken;
    let contractOwnerInitialBalance = 1_000_000n;
    let contractOwner: Signer;

    beforeEach(async () => {
        contract = await hre.ethers.deployContract('KulturmanToken');
        contractOwner = (await hre.ethers.getSigners())[0];
    })

    describe('BalanceOf', () => {
        it('It returns the correct balance', async () => {
            const [owner, anAddress] = await hre.ethers.getSigners();

            expect(await contract.balanceOf(owner.address)).to.eq(contractOwnerInitialBalance);
            expect(await contract.balanceOf(anAddress.address)).to.eq(0);
        })
    })

    describe('Transfer', () => {
        it('Transfer succeeds token when sender has enough balance', async () => {
            const [sender, receiver] = await hre.ethers.getSigners();
            const amountToSend = 50_000n;

            await expect(contract.transfer(receiver.address, amountToSend)).to.emit(contract, 'Transfer')
                .withArgs(sender, receiver.address, amountToSend);

            expect(await contract.balanceOf(sender.address)).to.equal(contractOwnerInitialBalance - amountToSend);
            expect(await contract.balanceOf(receiver.address)).to.equal(amountToSend);
        })

        it('0 amount transfer should also succeed', async () => {
            const [sender, receiver] = await hre.ethers.getSigners();

            await expect(contract.transfer(receiver.address, 0)).to.emit(contract, 'Transfer').withArgs(sender, receiver.address, 0);
            expect(await contract.balanceOf(sender.address)).to.equal(contractOwnerInitialBalance);
            expect(await contract.balanceOf(receiver.address)).to.equal(0);
        })

        it('Transfer fails when sender has not enough balance', async () => {
            const [sender, receiver] = await hre.ethers.getSigners();
            await expect(contract.connect(sender).transfer(receiver.address, contractOwnerInitialBalance * 2n))
                .to.be.revertedWith('Not enough tokens');
            expect(await contract.balanceOf(sender.address)).to.equal(contractOwnerInitialBalance);
            expect(await contract.balanceOf(receiver.address)).to.equal(0);
        })
    })

    describe('Approve', () => {
        it('Approve should emit Approval event', async () => {
            const [owner, spender] = await hre.ethers.getSigners();
            const amountToApprove = 1000n;

            await expect(contract.approve(spender.address, amountToApprove)).to.emit(contract, 'Approval')
                .withArgs(owner.address, spender.address, amountToApprove);
        })

        it('Approve should update allowance', async () => {
            const [owner, spender] = await hre.ethers.getSigners();
            const amountToApprove = 1000n;

            await contract.approve(spender.address, amountToApprove);
            expect(await contract.allowance(owner.address, spender.address)).to.equal(amountToApprove);
        })
    })

    describe('TransferFrom', () => {
        it('Fails if sender does not have allowance over given address', async () => {
            const [sender , receiver] = await hre.ethers.getSigners();

            await expect(contract.transferFrom(sender.address, receiver.address, 1000n)).to.be.revertedWith('Allowance exceeded');
        })

        it('Transfer fails when sender has not enough balance', async () => {
            const [_, sender, receiver] = await hre.ethers.getSigners();
            await expect(contract.transferFrom(sender.address, receiver, 2))
                .to.be.revertedWith('Not enough tokens');
            expect(await contract.balanceOf(sender.address)).to.equal(0);
            expect(await contract.balanceOf(receiver.address)).to.equal(0);
        })

        it('Transfer succeeds and emit event if sender has allowance and enough tokens', async () => {
            const [contractOwner, sender, receiver] = await hre.ethers.getSigners();
            //This allows sender to spend 2 tokens on behalf of contractOwner
            await contract.connect(contractOwner).approve(sender, 2);

            await expect(contract.connect(sender).transferFrom(contractOwner.address, receiver, 2))
                .to.emit(contract, 'Transfer').withArgs(contractOwner.address, receiver.address, 2);

            expect(await contract.balanceOf(contractOwner.address)).to.equal(contractOwnerInitialBalance - 2n);
            expect(await contract.balanceOf(receiver.address)).to.equal(2);
        })
    })
})