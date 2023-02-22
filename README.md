# Delta Protocol

# What is Delta?

Delta is a protocol that offers DeFi access to everyone through a set of products that serves as onramps from a legacy financial system to the future of natively-digital capital coordination. In essence, Delta offers more capital-efficient features to your assets. In particular, we provide the following features: 

1. Institution-grade DeFi lending & borrowing protocol
2. DeFi Risk Transfer protocol


## 1. Lending & Borrowing

We envision a future where multiple tokens are deployed on the Mantle Testnet, competing with each other. However, one of the biggest drawbacks to this is that not all these assets would be supported on third-party lending & borrowing protocols such as [Aave](https://aave.com/) and [Compound](https://compound.finance/) (or similar). Delta solves this problem by introducing an institution-grade DeFi borrowing and lending protocol featuring ***permissioned*** and ***permissionless*** liquidity pools exclusively for these assets.

* The ***permissionless***/***Open*** pool is open & public, allowing anyone to lending and borrow tokens at high APYs.

* The ***permissioned***/***Verified*** pool is KYC-restricted. It is tailored for institutional clients, solving the friction points of capital, connectivity and control and enabling their participation in the emerging on-chain structured financial product yields of DeFi.


### Why not use use Aave or Compound? 

See above. Also, Delta offers higher APYs, and attracts greater CeFi adoption into the DeFi and Mantle ecosystem.


### Some points

1. Borrowers pay 0.1% of the borrowed amount as an "origination" fee, which is added to the total borrow amount in its respective token.
2. Liquidations carry a 10% fee paid directly to the liquidator.
3. All transactions occur on the [Mantle Testnet](https://explorer.testnet.mantle.xyz/).


## 2. DeFi Risk Transfer / Insurance


Insurance on Delta is not exactly "insurance" in the traditional P2P Insurance Model; rather, we introduce a novel concept: *P2P Risk Transfer*. It is a combination of P2P Insurance, seniority-based promises, and DeFi specifics. In other words, you may think of it as a decentralized risk hedging protocol based on tranched insurance. 

The general idea is that we pools assets from third-party protocols (like Aave and Compound), and allow users to split the pool redemption rights into two tranches: *A* and *B*. If any of the third-party protocols suffer losses during the insurance period, those losses will be primarily borne by the B-tranche holders. A-tranche holders will only be negatively affected if 50% or more of the pooled funds are irrecoverable, or if both protocols become temporarily illiquid and face (partial) losses. We effectively split the redemption rights into a riskier and less risky version and allow the market for A- and B- tranches to determine the fair risk premium in line with the users’ expectations.
