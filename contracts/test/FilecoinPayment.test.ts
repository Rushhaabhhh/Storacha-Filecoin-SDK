import { expect } from "chai";
import { ethers } from "hardhat";
import "@nomicfoundation/hardhat-chai-matchers";

describe("FilecoinPayment", function () {
  let payment: any, token: any, owner: any, user: any, provider: any;

  beforeEach(async function () {
    [owner, user, provider] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("TestUSDFC");
    token = await Token.deploy();

    const Payment = await ethers.getContractFactory("FilecoinPayment");
    payment = await Payment.deploy(await token.getAddress());

    await token.mint(user.address, ethers.parseUnits("1000", 18));
    await token.connect(user).approve(await payment.getAddress(), ethers.parseUnits("1000", 18));
  });

  it("Should deposit payment", async function () {
    const amount = ethers.parseUnits("100", 18);
    await expect(payment.connect(user).deposit("QmTest", amount))
      .to.emit(payment, "Deposited")
      .withArgs("QmTest", user.address, amount);
  });

  it("Should verify and release", async function () {
    const amount = ethers.parseUnits("100", 18);
    await payment.connect(user).deposit("QmTest", amount);
    await payment.verify("QmTest", provider.address);
    await payment.release("QmTest");

    expect(await token.balanceOf(provider.address)).to.equal(amount);
  });
});
