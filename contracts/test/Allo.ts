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
} from "../lib/allo";

describe("Allo", function () {
  async function fixture() {
    const [defaultSigner, profileOwner, profileMember, poolManager, recipient] = await ethers.getSigners();
    const alloCore = Allo__factory.connect(ALLO_CORE_ADDRESS, defaultSigner);
    const alloRegistry = Registry__factory.connect(ALLO_REGISTRY_ADDRESS, defaultSigner);
    return { alloCore, alloRegistry, defaultSigner, profileOwner, profileMember, poolManager, recipient };
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
      const { alloCore, alloRegistry, profileOwner, profileMember, poolManager, recipient } = await loadFixture(
        fixture
      );

      // Create profile
      const nonce = 0;
      const name = "Test";
      // Mock metadata for now
      const profileMetadata = {
        protocol: 1,
        pointer: "bafybeia4khbew3r2mkflyn7nzlvfzcb3qpfeftz5ivpzfwn77ollj47gqi",
      };
      const owner = profileOwner.address;
      const members = [profileOwner.address, profileMember.address];
      const createProfileTx = await alloRegistry
        .connect(profileOwner)
        .createProfile(nonce, name, profileMetadata, owner, members);
      const createProfileReceipt = await createProfileTx.wait();

      const profileId = createProfileReceipt.events?.[createProfileReceipt.events.length - 1].args?.profileId;
      const alloAnchorAddress = createProfileReceipt.events?.[createProfileReceipt.events.length - 1].args?.anchor;
      const alloAnchor = Anchor__factory.connect(alloAnchorAddress, profileOwner);

      // Create pool
      // Encode data for (bool _registryGating, bool _metadataRequired, bool _grantAmountRequired)
      const initDirectGrantsSimpleStrategyData = ethers.utils.defaultAbiCoder.encode(
        ["bool", "bool", "bool"],
        [true, false, false]
      );
      const token = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"; // Ether
      const amount = 0; // No initial amount
      // Mock metadata for now
      const poolMetadata = {
        protocol: "1",
        pointer: "bafybeia4khbew3r2mkflyn7nzlvfzcb3qpfeftz5ivpzfwn77ollj47gqi",
      };
      const managers = [poolManager.address];
      const createPoolTx = await alloCore
        .connect(profileOwner)
        .createPool(
          profileId,
          ALLO_DIRECT_GRANTS_SIMPLE_STRATEGY_ADDRESS,
          initDirectGrantsSimpleStrategyData,
          token,
          amount,
          poolMetadata,
          managers
        );
      const createPoolRecipt = await createPoolTx.wait();
      const poolId = createPoolRecipt.events?.[createPoolRecipt.events.length - 1].args?.poolId;

      // Create recipient
      const recipientMetadata = [
        1, // protocol
        "bafybeia4khbew3r2mkflyn7nzlvfzcb3qpfeftz5ivpzfwn77ollj47gqi", // pointer
      ];
      // Encode data for (address recipientId, address recipientAddress, uint256 grantAmount, Metadata metadata)
      const registerRecipientData = ethers.utils.defaultAbiCoder.encode(
        ["address", "address", "uint256", "tuple(uint256, string)"],
        [alloAnchorAddress, recipient.address, 0, recipientMetadata]
      );

      // Register recipient
      await alloCore.connect(profileOwner).registerRecipient(poolId, registerRecipientData);
    });
  });
});
