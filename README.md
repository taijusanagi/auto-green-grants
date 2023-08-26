# AutoGreenGrants

![screenshot-1](./docs/screenshot-1.png)

## Description

AutoGreenGrants is a grants platform which automates

- Payout to participants
- Purchase carbon credit with attestation to participants

Our motivation is to be a sustainable grants provider, and build environment frendly reputation in grants ecosystem.

## Live App

https://greengrant.vercel.app/

## Demo Video

TBD

## Pitch Deck

TBD

## How It Works

### Allo Protocol

- AutoGreenGrants is built on Allo Protocol for creating profile, creating pool, registration, reviwing, payout, each life cycle of grants. In this hackathon we spent most of the times on analysing how Allo system works.

- AutoGreenGrants integrates purchacing carbon credit with Allo Protocol's DirectGrantsSimpleStrategy, and certain amount of grants payout goes to Carbon Credit provider automatically.

### CO2.Storage and IPFS

- AutoGreenGrants integrats purchasing carbon credit and carbon credit data is stored with purchasing transaction hash and pool info in CO2.Storage, it allows tracking positive impact of participants to environment within grants ecosystem.

- Allo Protocol requires metadata for creating profile, creating pool, registering recipient, set milestones, submit milestone, and it takes IPFS hash, so all metadata is stored using web3.storage.

### Hypercert

- AutoGreenGrants provides attestation using Hypercert, create Hypercert contains CO2.Storage asset ID, it makes tracking positive impact of participants more flexible and on-chain verifiable.

- Reviewing can utilize attestation to make reputation-based reviewing in Allo Protocol, and this is potencial impact on grants ecosystem.

### Drip

- AutoGreenGrants integrates Drip to split payout among team member.

### BAT

- AutoGreenGrants integrates BAT token as payment token.
