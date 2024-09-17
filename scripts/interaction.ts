import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-network-helpers");

async function main() {
  const ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

  const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  const USDC_DAI_PAIR = "0xAE461cA67B15dc8dc81CE7615e0320dA1A9aB8D5";

  const TOKEN_HOLDER = "0xf584F8728B874a6a5c7A8d4d387C9aae9172D621";
  await helpers.impersonateAccount(TOKEN_HOLDER);
  const impersonatedSigner = await ethers.getSigner(TOKEN_HOLDER);

  const ROUTE = await ethers.getContractAt(
    "IUniswapV2Router",
    ROUTER_ADDRESS,
    impersonatedSigner
  );

  const AMOUNT1 = await ethers.parseUnits("10", 6);
  const AMOUNT2 = await ethers.parseUnits("10", 18);
  const AMOUNT3 = await ethers.parseUnits("9", 6);
  const AMOUNT4 = await ethers.parseUnits("9", 18);

  const PAIR_Contract = await ethers.getContractAt( "IERC20", USDC_DAI_PAIR,impersonatedSigner);  
  const USDC_CON = await ethers.getContractAt("IERC20", USDC, impersonatedSigner);
  const DAI_CON = await ethers.getContractAt("IERC20", DAI, impersonatedSigner);


  await USDC_CON.approve(ROUTER_ADDRESS, AMOUNT1);
  await DAI_CON.approve(ROUTER_ADDRESS, AMOUNT2);

  const deadline = Math.floor(Date.now() / 1000) + 60 * 10;
  const balOfUSDC = await USDC_CON.balanceOf(impersonatedSigner.address);
  const balOfDAI = await DAI_CON.balanceOf(impersonatedSigner.address);
  

  console.log("USDC Bal BEFORE::: ", Number(balOfUSDC));
  console.log("DAI bal before swap", Number(balOfDAI));

 
  const priorPairBal = await PAIR_Contract.balanceOf(impersonatedSigner.address);
  console.log("LP Token Balance before:", Number(priorPairBal));


  const liquidityAdditionTransact = await ROUTE.addLiquidity(
    USDC, DAI, AMOUNT1, AMOUNT2,AMOUNT3, AMOUNT4, impersonatedSigner.address, deadline
  );
  await liquidityAdditionTransact.wait();

  const balOFUSDCAfter = await USDC_CON.balanceOf(
    impersonatedSigner.address
  );
  const balOfDAIAfter = await DAI_CON.balanceOf(impersonatedSigner.address);

  console.log("bal after liquidity added fir USDC", Number(balOFUSDCAfter));
  console.log("bal after Liquidty was added for DAI", Number(balOfDAIAfter));

  const bal = await PAIR_Contract.balanceOf(impersonatedSigner.address);
  console.log("LP Token Balance after adding liquidity:", Number(bal));

  
  await PAIR_Contract.approve(ROUTER_ADDRESS, bal);

  const removeLiqTx = await ROUTE.removeLiquidity(
    USDC, DAI, bal, 0, 0, impersonatedSigner.address,deadline
  );
  await removeLiqTx.wait();


  const balAfterLiqRemoved = await PAIR_Contract.balanceOf(
    impersonatedSigner.address
  );
  console.log("LP Token Balance after removal:", Number(balAfterLiqRemoved));


  const USDC_bal = await USDC_CON.balanceOf(
    impersonatedSigner.address
  );
  const DAI_bal = await DAI_CON.balanceOf(impersonatedSigner.address);
  console.log("Final USDC balance:", Number(USDC_bal));
  console.log("Final DAI balance:", Number(DAI_bal));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

 

