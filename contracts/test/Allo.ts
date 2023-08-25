import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import {
  ALLO_CORE_ADDRESS,
  ALLO_REGISTRY_ADDRESS,
  utils,
  Allo__factory,
  Registry__factory,
  Anchor__factory,
  DirectGrantsSimpleStrategy__factory,
} from "../lib/allo";

describe("Allo", function () {
  const provider = ethers.provider;

  async function fixture() {
    const alloCore = Allo__factory.connect(ALLO_CORE_ADDRESS, provider);
    const alloRegistry = Registry__factory.connect(ALLO_REGISTRY_ADDRESS, provider);
    const [poolOwner, recipient] = await ethers.getSigners();
    return {
      alloCore,
      alloRegistry,
      poolOwner,
      recipient,
    };
  }

  describe("Test", function () {
    it("Deployment with Forked", async function () {
      const { alloCore, alloRegistry } = await loadFixture(fixture);
      expect(alloCore.address).to.equal(ALLO_CORE_ADDRESS);
      expect(await alloCore.getRegistry()).to.equal(ALLO_REGISTRY_ADDRESS);
      expect(alloRegistry.address).to.equal(ALLO_REGISTRY_ADDRESS);
      expect(await alloRegistry.ALLO_OWNER()).to.equal(utils.ALLO_OWNER);
    });

    it("Know basic flow of Allo protocol with DirectGrantsSimpleStrategy", async function () {
      const { alloCore, alloRegistry, poolOwner, recipient } = await loadFixture(fixture);

      // Mock metadata for now
      const dummyMetadata = {
        protocol: 1,
        pointer: "bafybeia4khbew3r2mkflyn7nzlvfzcb3qpfeftz5ivpzfwn77ollj47gqi",
      };

      console.log("PoolOwner: createProfile for pool creator");
      const createPoolCreatorProfileTx = await alloRegistry
        .connect(poolOwner)
        .createProfile(0, "Pool Creator Profile", { ...dummyMetadata }, poolOwner.address, []);
      const createPoolCreatorProfileReceipt = await createPoolCreatorProfileTx.wait();
      const poolCreatorProfileId =
        createPoolCreatorProfileReceipt.events?.[createPoolCreatorProfileReceipt.events.length - 1].args?.profileId;
      const poolCreatorAlloAnchorAddress =
        createPoolCreatorProfileReceipt.events?.[createPoolCreatorProfileReceipt.events.length - 1].args?.anchor;
      const poolCreatorAlloAnchor = Anchor__factory.connect(poolCreatorAlloAnchorAddress, provider);

      console.log("Recipient: createProfile for recipient");
      const createRecipientProfileTx = await alloRegistry
        .connect(recipient)
        .createProfile(0, "Recipient Profile", dummyMetadata, recipient.address, []);
      const createRecipientProfileReceipt = await createRecipientProfileTx.wait();
      const recipientProfileId =
        createRecipientProfileReceipt.events?.[createRecipientProfileReceipt.events.length - 1].args?.profileId;
      const recipientAlloAnchorAddress =
        createRecipientProfileReceipt.events?.[createRecipientProfileReceipt.events.length - 1].args?.anchor;
      const recipientAlloAnchor = Anchor__factory.connect(recipientAlloAnchorAddress, provider);

      console.log("PoolOwner: deploy DirectGrantsSimpleStrategy");
      const DirectGrantsSimpleStrategy = await ethers.getContractFactory("DirectGrantsSimpleStrategy");
      const directGrantsSimpleStrategy = await DirectGrantsSimpleStrategy.connect(poolOwner).deploy(
        ALLO_CORE_ADDRESS,
        "DirectGrantsSimpleStrategy"
      );
      await directGrantsSimpleStrategy.deployed();

      console.log("PoolOwner: createPoolWithCustomStrategy");
      const grantAmount = ethers.utils.parseEther("1");
      const createPoolTx = await alloCore.connect(poolOwner).createPoolWithCustomStrategy(
        poolCreatorProfileId,
        directGrantsSimpleStrategy.address,
        // Encode data for (bool _registryGating, bool _metadataRequired, bool _grantAmountRequired)
        ethers.utils.defaultAbiCoder.encode(["bool", "bool", "bool"], [true, false, false]),
        "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        grantAmount,
        { ...dummyMetadata },
        [],
        { value: grantAmount }
      );

      const createPoolRecipt = await createPoolTx.wait();
      const poolId = createPoolRecipt.events?.[createPoolRecipt.events.length - 1].args?.poolId;
      const strategyAddress = createPoolRecipt.events?.[createPoolRecipt.events.length - 1].args?.strategy;
      const strategy = DirectGrantsSimpleStrategy__factory.connect(strategyAddress, provider);
      expect(await strategy.getPoolAmount()).to.equal(grantAmount);

      console.log("Recipient: registerRecipient");
      await alloCore.connect(recipient).registerRecipient(
        poolId,
        // Encode data for (address recipientId, address recipientAddress, uint256 grantAmount, Metadata metadata)
        ethers.utils.defaultAbiCoder.encode(
          ["address", "address", "uint256", "tuple(uint256, string)"],
          [recipientAlloAnchorAddress, recipient.address, 0, [dummyMetadata.protocol, dummyMetadata.pointer]]
        )
      );

      console.log("PoolOwner: setInternalRecipientStatusToInReview");
      await strategy.connect(poolOwner).setInternalRecipientStatusToInReview([recipientAlloAnchorAddress]);

      console.log("PoolOwner: allocate");
      await alloCore.connect(poolOwner).allocate(
        poolId,
        // Encode for (address recipientId, InternalRecipientStatus recipientStatus, uint256 grantAmount)
        ethers.utils.defaultAbiCoder.encode(
          ["address", "uint256", "uint256"],
          [recipientAlloAnchorAddress, utils.STATUS.ACCEPTED, grantAmount]
        )
      );

      console.log("Recipient: setMilestones");
      await strategy.connect(recipient).setMilestones(recipientAlloAnchorAddress, [
        // InternalRecipientStatus: None = 0
        {
          amountPercentage: utils.AMOUNT_PERCENTAGE_BASE,
          metadata: { ...dummyMetadata },
          milestoneStatus: utils.STATUS.NONE,
        },
      ]);

      console.log("PoolOwner: reviewSetMilestones");
      await strategy.connect(poolOwner).reviewSetMilestones(recipientAlloAnchorAddress, utils.STATUS.ACCEPTED);

      console.log("Recipient: submitMilestone");
      await strategy.connect(recipient).submitMilestone(recipientAlloAnchorAddress, 0, { ...dummyMetadata });

      console.log("PoolOwner: rejectMilestone");
      await strategy.connect(poolOwner).rejectMilestone(recipientAlloAnchorAddress, 0);

      console.log("Recipient: submitMilestone again");
      await strategy.connect(recipient).submitMilestone(recipientAlloAnchorAddress, 0, { ...dummyMetadata });

      console.log("PoolOwner: distribute");
      const originalRecipientBalance = await provider.getBalance(recipient.address);
      await alloCore.connect(poolOwner).distribute(poolId, [recipientAlloAnchorAddress], utils.NULL_BYTES);
      const newRecipientBalance = await provider.getBalance(recipient.address);
      expect(await strategy.getPoolAmount()).to.equal(0);
      expect(newRecipientBalance).to.equal(originalRecipientBalance.add(grantAmount));

      console.log("PoolOwner: setPoolActive");
      await strategy.connect(poolOwner).setPoolActive(false);
    });
  });
});
