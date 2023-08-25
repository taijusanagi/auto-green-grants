import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { ALLO_CORE_ADDRESS, ALLO_REGISTRY_ADDRESS, utils, Allo__factory, Registry__factory } from "../lib/allo";

describe("Allo", function () {
  async function fixture() {
    const [defaultSigner, profileOwner, profileMember] = await ethers.getSigners();
    const alloCore = Allo__factory.connect(ALLO_CORE_ADDRESS, defaultSigner);
    const alloRegistry = Registry__factory.connect(ALLO_REGISTRY_ADDRESS, defaultSigner);
    return { alloCore, alloRegistry, defaultSigner, profileOwner, profileMember };
  }

  describe("Test", function () {
    it("Deployment with Forked", async function () {
      const { alloCore, alloRegistry } = await loadFixture(fixture);
      expect(alloCore.address).to.equal(ALLO_CORE_ADDRESS);
      expect(await alloCore.getRegistry()).to.equal(ALLO_REGISTRY_ADDRESS);
      expect(alloRegistry.address).to.equal(ALLO_REGISTRY_ADDRESS);
      expect(await alloRegistry.ALLO_OWNER()).to.equal(utils.ALLO_OWNER);
    });
    it("Should work", async function () {
      const { alloCore, alloRegistry, profileOwner, profileMember } = await loadFixture(fixture);
      const nonce = 0;
      const name = "Test";
      const metadata = {
        protocol: "1",
        pointer: "bafybeia4khbew3r2mkflyn7nzlvfzcb3qpfeftz5ivpzfwn77ollj47gqi",
      };
      const owner = profileOwner.address;
      const members = [profileOwner.address, profileMember.address];
      await alloRegistry.createProfile(nonce, name, metadata, owner, members);
    });
  });
});
