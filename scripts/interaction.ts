import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-network-helpers");

async function main() {
  const ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

  const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const DAI = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
  const USDC_DAI_PAIR = "0xAE461cA67B15dc8dc81CE7615e0320dA1A9aB8D5";

  const TOKEN_HOLDER = "0xf584F8728B874a6a5c7A8d4d387C9aae9172D621";
  await helpers.impersonateAccount(TOKEN_HOLDER);
  const impersonatedSigner = await ethers.getSigner(TOKEN_HOLDER);

  const ROUTE = await ethers.getContractAt(
    "IUniswapV2Router",
    ROUTER_ADDRESS,
    impersonatedSigner
  );

  const AMOUNT1 = ethers.parseUnits("200", 6);
  const AMOUNT2 = ethers.parseUnits("100", 18);
  const AMOUNT3 = ethers.parseUnits("0", 6);
  const AMOUNT4 = ethers.parseUnits("0", 18);

  // const PAIR_Contract = await ethers.getContractAt( "IERC20", USDC_DAI_PAIR,impersonatedSigner);  
  const USDC_CON = await ethers.getContractAt("IERC20", USDC, impersonatedSigner);
  const DAI_CON = await ethers.getContractAt("IERC20", DAI, impersonatedSigner);


 

  const deadline = Math.floor(Date.now() / 1000) + 60 * 10;
  const balOfUSDC = await USDC_CON.balanceOf(impersonatedSigner.address);
  const balOfDAI = await DAI_CON.balanceOf(impersonatedSigner.address);

  const DAIbalOfLp = await DAI_CON.balanceOf(USDC_DAI_PAIR);
  const usdcbal = await USDC_CON.balanceOf(USDC_DAI_PAIR);

  console.log("USDC Bal BEFORE::: ", Number(balOfUSDC));
  console.log("DAI bal before swap", Number(balOfDAI));
  console.log("LP_RECEIVER bal before swap", Number(balOfDAI));
 
  // const priorPairBal = await PAIR_Contract.balanceOf(impersonatedSigner.address);
  console.log("usdc LP Token Balance before:", Number(usdcbal));
  console.log("dai LP Token Balance before:", Number(DAIbalOfLp));

  await USDC_CON.approve(ROUTER_ADDRESS, AMOUNT1);
  await DAI_CON.approve(ROUTER_ADDRESS, AMOUNT2);
  const liquidityAdditionTransact = await ROUTE.addLiquidity(
    USDC, DAI, AMOUNT1, AMOUNT2,AMOUNT3, AMOUNT4, impersonatedSigner.address, deadline
  );
  await liquidityAdditionTransact.wait();

  const balOFUSDCAfter = await USDC_CON.balanceOf(
    impersonatedSigner.address
  );
  const balOfDAIAfter = await DAI_CON.balanceOf(impersonatedSigner.address);
  const balOfUsdcAfter = await USDC_CON.balanceOf(USDC_DAI_PAIR);
  const balOfdaiAfter = await DAI_CON.balanceOf(USDC_DAI_PAIR);


  console.log("bal after liquidity added fir USDC", Number(balOFUSDCAfter));
  console.log("bal after Liquidty was added for DAI", Number(balOfDAIAfter));
  console.log("busdc bal after Liquidty was added for DAI", Number(balOfUsdcAfter));
  console.log("bal after Liquidty was added for DAI", Number(balOfdaiAfter));
  // const bal = await PAIR_Contract.balanceOf(impersonatedSigner.address);
  // console.log("LP Token Balance after adding liquidity:", Number(bal));

  
  // await PAIR_Contract.approve(ROUTER_ADDRESS, bal);

  // const removeLiqTx = await ROUTE.removeLiquidity(
  //   USDC, DAI, bal, 0, 0, impersonatedSigner.address,deadline
  // );
  // await removeLiqTx.wait();


  // const balAfterLiqRemoved = await PAIR_Contract.balanceOf(
  //   impersonatedSigner.address
  // );
  // console.log("LP Token Balance after removal:", Number(balAfterLiqRemoved));


  // const USDC_bal = await USDC_CON.balanceOf(
  //   impersonatedSigner.address
  // );
  // const DAI_bal = await DAI_CON.balanceOf(impersonatedSigner.address);
  // console.log("Final USDC balance:", Number(USDC_bal));
  // console.log("Final DAI balance:", Number(DAI_bal));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

 

