# AutoGreenGrants

## Description

**AutoGreenGrants** is an innovative grants platform designed to automate the process of:

- Distributing payouts to participants.
- Purchasing carbon credits while providing attestation to participants.

Driven by our mission to enhance the sustainability of grant distribution, we aim to establish a prominent, environment-friendly presence in the grants ecosystem.

![screenshot-1](./docs/screenshot-1.png)

## Live Application

https://auto-green-grants.vercel.app/

## Pitch Deck

https://docs.google.com/presentation/d/17jKICQBJbGnaEfGOp6Mx8G_FzpP4d6v-yA-tHc5fuFE/edit?usp=sharing

## Demo Video

https://youtu.be/3Y7JkqFiOgw

## How It Works

![how-it-works](./docs/how-it-works.png)

### Allo Protocol

- **Functionality:** AutoGreenGrants is built on the Allo Protocol. This protocol manages various tasks such as profile creation, pool establishment, registration, reviewing, and the entire life cycle of the grant payout.
- **Carbon Credit Integration:** We've incorporated the purchase of carbon credits into Allo Protocol's `DirectGrantsSimpleStrategy`. A designated portion of the grant payout is automatically directed to the Carbon Credit provider.

#### PoC of Allo Protocol

https://github.com/taijusanagi/auto-green-grants/blob/main/contracts/test/Allo.ts

#### Implementation in UI

https://github.com/taijusanagi/auto-green-grants/blob/main/app/src/pages/index.tsx

### CO2.Storage and IPFS

- **Carbon Credit Data Storage:** When purchasing carbon credits, the transactional data—comprising the hash and pool info—is securely stored in CO2.Storage. This allows for transparent tracking of the positive environmental impacts contributed by participants.
- **Metadata & IPFS:** Allo Protocol necessitates metadata for operations like profile creation, pool setup, recipient registration, milestone setting, etc. These metadata operations utilize IPFS hashes and are stored via web3.storage.

### Hypercert

- **Attestation:** We employ Hypercert for attestation purposes. A generated Hypercert encapsulates the CO2.Storage asset ID, enabling a more flexible tracking system that's also verifiable on-chain.
- **Reputation-based Reviewing:** The attestation feature can be leveraged to execute reputation-based reviews within the Allo Protocol, potentially revolutionizing the grants ecosystem.

### Drip

- **Team Payout Distribution:** AutoGreenGrants has integrated Drip to facilitate the equitable distribution of payouts among team members. User can input drip smart contract address as Allo protocol's recipient.

- **Hypercert Integration** The Hypercert attestation is sent to contributers so if contributers enabled Drip recipient in the application, the Hypercert is sent to the Drip List members.

### BAT

- **Payment Token:** The BAT token has been integrated and is used as the platform's payment token.

## Tx Reference

### Payout with Allo

https://goerli.etherscan.io/tx/0xb5638bb691c93e9706c2bf7051c2c640335274e0d417cca9dd2004c24a529ff9

### Purchase Carbon Credit

https://goerli.etherscan.io/tx/0x34f4896054522940ecb8a3dff82d392689bd04039fb0835f168112fe075e3c6a

### Mint Hypercert

https://goerli.etherscan.io/tx/0x3d48d325b8c94c99ec61f1c25eebdb03cd7b0b528b87946fc128b9a9e86ce78a

## Other Reference

### CO2 Storage Asset ID

https://co2.storage/assets/bafyreihhflkfkucyqtxy7uremqutlj4tokni4l46twqzxorvudwoylhq7q

### Minted Hypercert

https://testnet.hypercerts.org/app/view#claimId=0x822f17a9a5eecfd66dbaff7946a8071c265d1d07-4147361488032397992691609715378390961225728

## Disclaimer

- Drip and BAT is integrated in frontend, but not tested well because of the Testnet limitation.
