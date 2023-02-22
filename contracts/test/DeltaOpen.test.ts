import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { expect } from 'chai'
import { BigNumber, ContractFactory, Wallet } from 'ethers'
import { ethers } from 'hardhat'
import { bn, fp, toBNDecimals, divCeil } from '../common/numbers'


describe("DeltaOpen", () => {
    let sender
    let daiOracle
    let usdtOracle
    let usdcOracle
    let DAI
    let USDT 
    let USDC
    let rewardControl
    let deltaOpen
    let chainlink
    let rateModel 
    let result

    const MAX_UINT256 = "115792089237316195423570985008687907853269984665640564039457584007913129639935"

    async function approve(asset: any, amount: number) {
        await asset.connect(sender).approve(deltaOpen.address, format(amount + 2))
    }

    beforeEach(async () => {
        ;[sender] = await ethers.getSigners()
    })

    describe("Deployment", () => {
        it("Oracles", async () => {
            const Oracle = await ethers.getContractFactory("MockAggregatorV3")
            daiOracle = await Oracle.deploy(18)
            usdtOracle = await Oracle.deploy(18)
            usdcOracle = await Oracle.deploy(6)
        })

        it("Chainlink", async () => {
            const ChainLink = await ethers.getContractFactory("ChainLink")
            chainlink = await ChainLink.deploy()
        })

        it("RTokens", async () => {
            const MockERC20 = await ethers.getContractFactory("MockERC20")
            DAI = await MockERC20.deploy("DAI", "DAI", 18)
            USDT = await MockERC20.deploy("USDT", "USDT", 18)
            USDC = await MockERC20.deploy("USDC", "USDC", 6)
        })

        it("DeltaOpen", async () => {
            const DeltaOpenFactory = await ethers.getContractFactory("DeltaOpen")
            deltaOpen = await DeltaOpenFactory.deploy(
                chainlink.address, // oracle
                (.5 * 10**18).toString()
            )
        })

        it("Reward Control", async () => {
            const RewardControl = await ethers.getContractFactory("RewardControl")
            rewardControl = await RewardControl.deploy(
                deltaOpen.address, // deltaVerified
                deltaOpen.address, // deltaOpen
                deltaOpen.address, // dltAddress
            )
        })

        it("Interest Rate Models", async () => {
            const RateModel = await ethers.getContractFactory("RateModel")
            rateModel = await RateModel.deploy(
                100, // MinRate
                2000, // HealthyMinUR
                100, // HealthyMinRate
                3000, // MaxRate
                8000, // HealthyMaxUR 
                400, //  HealthyMaxRate
            )
        })
    })


    describe("Setup", () => {
        it("Set Reward control", async () => {
            await deltaOpen.connect(sender).setRewardControlAddress(rewardControl.address)
        })


        it("Add Chainlink assets", async () => {
            await chainlink.connect(sender).addAsset(DAI.address,  daiOracle.address)
            await chainlink.connect(sender).addAsset(USDT.address, usdtOracle.address)
            await chainlink.connect(sender).addAsset(USDC.address, usdcOracle.address)
        })


        it("Get asset prices", async () => {
            result = await chainlink.connect(sender).getAssetPrice(USDC.address)
            expect(result[0].toString()).to.equal(format(1, 6))
            expect(result[1].toString()).to.equal("6")

            result = await chainlink.connect(sender).getAssetPrice(USDT.address)
            expect(result[0].toString()).to.equal(format(1))
            expect(result[1].toString()).to.equal("18")

            result = await chainlink.connect(sender).getAssetPrice(DAI.address)
            expect(result[0].toString()).to.equal(format(1))
            expect(result[1].toString()).to.equal("18")
        })


        it("Mint assets", async () => {
            await DAI.connect(sender).mint(sender.address,  format(1000000))
            await USDT.connect(sender).mint(sender.address, format(1000000))
            await USDC.connect(sender).mint(sender.address, format(1000000, 6))
        })


        it("Approve DeltaOpen", async () => {
            await DAI.connect(sender).approve(deltaOpen.address,  MAX_UINT256)
            await USDT.connect(sender).approve(deltaOpen.address, MAX_UINT256)
            await USDC.connect(sender).approve(deltaOpen.address, MAX_UINT256)
        })
    })


    describe("Tests", () => {
        it("Support Market", async () => {
            await deltaOpen.connect(sender)._supportMarket(DAI.address,  rateModel.address)
            await deltaOpen.connect(sender)._supportMarket(USDT.address, rateModel.address)
            await deltaOpen.connect(sender)._supportMarket(USDC.address, rateModel.address)
        })

        
        it("Supply / Lend", async () => {
            // Lend DAI
            await deltaOpen.connect(sender).supply(DAI.address, format(500))
            await deltaOpen.connect(sender).supply(DAI.address, format(500))


            // result = await deltaOpen.connect(sender).getAccountLiquidity(sender.address)
            // expect(result).to.equal(format(500))

            // result = await deltaOpen.connect(sender).getSupplyBalance(sender.address, DAI.address)
            // expect(result).to.equal(format(500))

            // result = await deltaOpen.connect(sender).getBorrowBalance(sender.address, DAI.address)
            // expect(result).to.equal(format(0))

            await deltaOpen.connect(sender).supply(DAI.address, format(9000))
        })
        


        it("Borrow", async () => {
            const collateralRatio = +(await deltaOpen.connect(sender).collateralRatio()) / 1e18

            await new Promise(resolve => setTimeout(resolve, 5000));

            const supplyBalance = +fromDecimals(await deltaOpen.connect(sender).getSupplyBalance(sender.address, DAI.address))
            console.debug("Supply balance:", supplyBalance)
            const supplyBalanceWithInterest = +fromDecimals(await deltaOpen.connect(sender).getSupplyBalanceWithInterest(sender.address, DAI.address))
            console.debug("Supply balance with interest:", supplyBalanceWithInterest)
            // let supplyBalance = +fromDecimals((await deltaOpen.connect(sender).getSupplyBalance(sender.address, DAI.address))[1])
            // let borrowBalance = +fromDecimals((await deltaOpen.connect(sender).getBorrowBalance(sender.address, DAI.address))[1])
            // console.debug("Supply balance:", supplyBalance)

            await deltaOpen.connect(sender).borrow(DAI.address, format(1200))

            // const maxBorrow = supplyBalance / collateralRatio
            // console.debug("Max borrow:", maxBorrow)
            // const borrowLimit = (borrowBalance / maxBorrow) * 100
            // console.debug("Borrow limit:", borrowLimit)

            // await new Promise(resolve => setTimeout(resolve, 5000));

            const borrowBalance = +fromDecimals(await deltaOpen.connect(sender).getBorrowBalance(sender.address, DAI.address))
            console.debug("Borrow balance:", borrowBalance)
            const borrowBalanceWithInterest = +fromDecimals(await deltaOpen.connect(sender).getBorrowBalanceWithInterest(sender.address, DAI.address))
            console.debug("Borrow balance with interest:", borrowBalanceWithInterest)
            

            // result = await deltaOpen.connect(sender).getBorrowBalance(sender.address, DAI.address)
            // expect(result).to.equal(format(100.1))


            // async function doSomeStuff() {
            //     while(true) {
                    // await new Promise(resolve => setTimeout(resolve, 5000));
            //         // supplyBalance = +fromDecimals((await deltaOpen.connect(sender).getSupplyBalance(sender.address, DAI.address))[1])
            //         // borrowBalance = +fromDecimals((await deltaOpen.connect(sender).getBorrowBalance(sender.address, DAI.address))[1])

            //         // console.debug(">>> ", { supplyBalance, borrowBalance })
            //         // console.debug(">>> ", { supplyBalance })
            //     }
            // }
            // await doSomeStuff()
            

            // result = await deltaOpen.connect(sender).getBorrowBalance(sender.address, USDT.address)
            // expect(result).to.equal(format(0))
        })
    })
})


function format(amount: number | string, decimals: number = 18) {
    return bn(`${amount}e${decimals}`).toString()
}

function fromDecimals(amount: any) {
    return ethers.utils.formatEther(amount.toString()).toString()
}