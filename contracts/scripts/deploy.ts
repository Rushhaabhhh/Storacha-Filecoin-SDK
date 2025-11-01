import { HardhatRuntimeEnvironment } from "hardhat/types";
import fs from "fs";

async function main(hre: HardhatRuntimeEnvironment) {
    const { ethers } = hre;

    const [deployer] = await ethers.getSigners();
    console.log("Deploying with:", deployer.address);

    // Deploy Token
    const Token = await ethers.getContractFactory("TestUSDFC");
    const token = await Token.deploy();
    await token.waitForDeployment();
    const tokenAddr = await token.getAddress();
    console.log("Token deployed at:", tokenAddr);

    // Mint tokens
    const mintTx = await token.mint(deployer.address, ethers.parseUnits("100000", 18));
    await mintTx.wait();
    console.log("Minted tokens to deployer.");

    // Deploy Payment
    const Payment = await ethers.getContractFactory("FilecoinPayment");
    const payment = await Payment.deploy(tokenAddr);
    await payment.waitForDeployment();
    const paymentAddr = await payment.getAddress();
    console.log("Payment contract deployed at:", paymentAddr);

    // Save addresses to file
    const deploymentData = {
        token: tokenAddr,
        payment: paymentAddr,
        network: hre.network.name,
    };
    fs.writeFileSync("deployments.json", JSON.stringify(deploymentData, null, 2));

    console.log("Deployment data saved to deployments.json");
}

// Run main through Hardhat's runtime environment
main(require("hardhat"))
    .catch((err) => {
        console.error("Deployment failed:", err);
        process.exitCode = 1;
    });
