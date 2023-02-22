import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { expect } from 'chai'
import { BigNumber, ContractFactory, Wallet } from 'ethers'
import { ethers } from 'hardhat'
import { bn, fp, toBNDecimals, divCeil } from '../common/numbers'


describe("DeltaInsurance", () => {
    let sender
    let aave
    let icy
    let insurance
    let DAI
    let aDAI

    const MAX_UINT256 = "115792089237316195423570985008687907853269984665640564039457584007913129639935"


    beforeEach(async () => {
        ;[sender] = await ethers.getSigners()
    })

    
    describe("Deployment", () => {
        it("Mocks", async () => {
            const MockAave = await ethers.getContractFactory("MockAave")
            const MockICY = await ethers.getContractFactory("MockICY")
            aave = await MockAave.deploy()
            icy = await MockICY.deploy()
        })


        it("RTokens", async () => {
            const MockERC20 = await ethers.getContractFactory("MockERC20")
            DAI = await MockERC20.deploy("DAI", "DAI", 18)
            aDAI = await MockERC20.deploy("aDAI", "aDAI", 18)
        })


        it("Insurance", async () => {
            const Insurance = await ethers.getContractFactory("DeltaInsurance")
            insurance = await Insurance.deploy(
                aave.address,
                aDAI.address,
                icy.address
            )
        })
    })


    describe("Setup", () => {
        it("Mint DAI", async () => {
            await DAI.connect(sender).mint(sender.address, format(1000000))
        })


        it("Approve DAI", async () => {
            // await DAI.connect(sender).approve(insurance.address, MAX_UINT256)
        })
    })


    describe("Tests", () => {
        it("Split Risk", async () => {
            await DAI.connect(sender).approve(insurance.address, format(100))
            await insurance.connect(sender).splitRisk(DAI.address, format(100))
            await new Promise(resolve => setTimeout(resolve, 5000))
            const result = await insurance.connect(sender).getInsuranceBalances(sender.address) 
            console.log("Split:", result)
        })

        it("Invest", async () => {
            await insurance.connect(sender).invest(DAI.address)
        })

        it("Divest", async () => {
            await insurance.connect(sender).invest(DAI.address)
        })

        it("Claim", async () => {
            const result = await insurance.connect(sender).getInsuranceBalances(sender.address) 
            console.log("Claim:", result)
            await insurance.connect(sender).claimAll(DAI.address)
        })
    })
})


function format(amount: number | string, decimals: number = 18) {
    return bn(`${amount}e${decimals}`).toString()
}

function fromDecimals(amount: any) {
    return ethers.utils.formatEther(amount.toString()).toString()
}