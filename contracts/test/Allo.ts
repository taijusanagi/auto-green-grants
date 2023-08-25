import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import {
  ALLO_CORE_ADDRESS,
  ALLO_REGISTRY_ADDRESS,
  ALLO_DIRECT_GRANTS_SIMPLE_STRATEGY_ADDRESS,
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
    const [
      poolCreatorProfileOwner,
      poolCreatorProfileMember,
      recipientProfileOwner,
      poolManager,
      poolFunder,
      recipient,
    ] = await ethers.getSigners();
    return {
      alloCore,
      alloRegistry,
      poolCreatorProfileOwner,
      poolCreatorProfileMember,
      recipientProfileOwner,
      poolManager,
      poolFunder,
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
    it("Know basic flow of Allo protocol", async function () {
      const {
        alloCore,
        alloRegistry,
        poolCreatorProfileOwner,
        poolCreatorProfileMember,
        recipientProfileOwner,
        poolManager,
        poolFunder,
        recipient,
      } = await loadFixture(fixture);

      // Mock metadata for now
      const dummyMetadata = {
        protocol: 1,
        pointer: "bafybeia4khbew3r2mkflyn7nzlvfzcb3qpfeftz5ivpzfwn77ollj47gqi",
      };

      // Create profile for pool creator
      const createPoolCreatorProfileTx = await alloRegistry
        .connect(poolCreatorProfileOwner)
        .createProfile(0, "Pool Creator Profile", { ...dummyMetadata }, poolCreatorProfileOwner.address, [
          poolCreatorProfileMember.address,
        ]);
      const createPoolCreatorProfileReceipt = await createPoolCreatorProfileTx.wait();
      const poolCreatorProfileId =
        createPoolCreatorProfileReceipt.events?.[createPoolCreatorProfileReceipt.events.length - 1].args?.profileId;
      const poolCreatorAlloAnchorAddress =
        createPoolCreatorProfileReceipt.events?.[createPoolCreatorProfileReceipt.events.length - 1].args?.anchor;
      const poolCreatorAlloAnchor = Anchor__factory.connect(poolCreatorAlloAnchorAddress, provider);

      // Create profile for recipient
      // const createRecipientProfileTx = await alloRegistry
      //   .connect(poolCreatorProfileOwner)
      //   .createProfile(0, "Recipient Profile", dummyMetadata, recipientProfileOwner.address, [
      //     recipientProfileOwner.address,
      //   ]);
      // const createRecipientProfileReceipt = await createRecipientProfileTx.wait();
      // const recipientProfileId =
      //   createRecipientProfileReceipt.events?.[createRecipientProfileReceipt.events.length - 1].args?.profileId;
      // const recipientAlloAnchorAddress =
      //   createRecipientProfileReceipt.events?.[createRecipientProfileReceipt.events.length - 1].args?.anchor;
      // const recipientAlloAnchor = Anchor__factory.connect(recipientAlloAnchorAddress, provider);

      // Create pool
      const managers = [poolManager.address];
      const poolAmount = ethers.utils.parseEther("1");
      const createPoolTx = await alloCore.connect(poolCreatorProfileMember).createPool(
        poolCreatorProfileId,
        ALLO_DIRECT_GRANTS_SIMPLE_STRATEGY_ADDRESS,
        // Encode data for (bool _registryGating, bool _metadataRequired, bool _grantAmountRequired)
        ethers.utils.defaultAbiCoder.encode(["bool", "bool", "bool"], [false, false, false]),
        "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        poolAmount,
        { ...dummyMetadata },
        managers,
        { value: poolAmount }
      );
      const createPoolRecipt = await createPoolTx.wait();
      const poolId = createPoolRecipt.events?.[createPoolRecipt.events.length - 1].args?.poolId;
      const strategyAddress = createPoolRecipt.events?.[createPoolRecipt.events.length - 1].args?.strategy;
      const strategy = DirectGrantsSimpleStrategy__factory.connect(strategyAddress, provider);

      console.log("strategyAddress", strategyAddress);
      // Register recipient
      await alloCore.connect(recipient).registerRecipient(
        poolId,
        // Encode data for (address recipientAddress, address registryAnchor, uint256 grantAmount, Metadata metadata)
        ethers.utils.defaultAbiCoder.encode(
          ["address", "address", "uint256", "tuple(uint256, string)"],
          [recipient.address, ethers.constants.AddressZero, 0, [dummyMetadata.protocol, dummyMetadata.pointer]]
        )
      );

      console.log(await strategy.getRecipient(recipient.address));
      // await strategy.connect(poolCreatorProfileMember).setInternalRecipientStatusToInReview([recipient.address]);

      // await alloCore.connect(profileOwner).allocate([poolId], [registerRecipientData]);
    });
  });
});
