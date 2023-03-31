const { expect } = require("chai");

describe("BizBucks", function () {
  let BizBucks, bizBucks, owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    BizBucks = await ethers.getContractFactory("BizBucks");
    bizBucks = await BizBucks.deploy(1000000, Date.now() + 86400000);
  });

  describe("Deployment", function () {
    it("Should set the total supply", async function () {
      const totalSupply = await bizBucks.totalSupply();
      expect(totalSupply).to.equal(1000000);
    });

    it("Should set the owner as the initial holder", async function () {
      const ownerBalance = await bizBucks.balanceOf(owner.address);
      expect(ownerBalance).to.equal(1000000);
    });
  });

  describe("Transfer", function () {
    it("Should transfer bizbucks between accounts", async function () {
      await bizBucks.transfer(addr1.address, 1000);
      const addr1Balance = await bizBucks.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(1000);

      await bizBucks.connect(addr1).transfer(addr2.address, 500);
      const addr2Balance = await bizBucks.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(500);
    });

    it("Should fail if sender doesn't have enough bizbucks", async function () {
      const initialOwnerBalance = await bizBucks.balanceOf(owner.address);
      expect(bizBucks.connect(addr1).transfer(owner.address, 1)).to.be.revertedWith("ERC20: transfer amount exceeds balance");

      expect(await bizBucks.balanceOf(owner.address)).to.equal(initialOwnerBalance);
    });
  });

  describe("Locking", function () {
    it("Should prevent transfers before unlock time", async function () {
      await expect(bizBucks.transfer(addr1.address, 1000)).to.be.revertedWith("You can't transfer yet");
    });

    it("Should allow transfers after unlock time", async function () {
      await bizBucks.transfer(addr1.address, 1000);
      await ethers.provider.send("evm_increaseTime", [86400]); // increase time by 1 day
      await ethers.provider.send("evm_mine", []);

      await bizBucks.connect(addr1).transfer(addr2.address, 500);
      const addr2Balance = await bizBucks.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(500);
    });
  });
});
