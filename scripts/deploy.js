const { ethers } = require("hardhat");

async function main() {
    const BizBucks = await ethers.getContractFactory("BizBucks");
    const bizBucks = await BizBucks.deploy(1000000, Date.now() + 86400000); // 1,000,000 initial supply and unlock time 1 day from now

    console.log("BizBucks deployed to:", bizBucks.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
