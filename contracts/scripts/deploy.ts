import { ethers } from "hardhat";

async function main() {
  const CARBON_OFFSET_RECIPIENT_ADDRESS = "0xA6beD0C00C2a6Ce4846BBfa699463D2A79dda490";
  const CarbonOffset = await ethers.getContractFactory("CarbonOffset");
  const carbonOffset = await CarbonOffset.deploy(CARBON_OFFSET_RECIPIENT_ADDRESS);
  await carbonOffset.deployed();
  console.log(`Ddeployed to ${carbonOffset.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
