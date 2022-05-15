(async () => {
    const ethers = require('ethers')   // 1. npm init -y 
    const zksync = require('zksync')   // 2. npm install ethers zksync
    const utils = require('./utils')
    const token = 'ETH'
    const amountToDeposit = '0.05'
    const amountToTransfer = '0.02'
    const amountToWithdraw = '0.002'

    const token1 = 'USDT'  // The number of decimals for all tokens are different. For ETH it is 18, for USDT it is 6
    const amountToDeposit1 = '6.0'
    const amountToTransfer1 = '2.0'
    const amountToWithdraw1 = '2.0'
/*
You've now implemented an application that can deposit, transfer, and withdraw multiple assets. 
If you want to make payments using ETH again: 
1. set the value of the token1 variable back to ETH 
2. update the amountToDeposit, amountToTransfer, and amountToWithdraw variables accordingly.
*/    
  
    const zkSyncProvider = await utils.getZkSyncProvider(zksync, process.env.NETWORK_NAME)
    const ethersProvider = await utils.getEthereumProvider(ethers, process.env.NETWORK_NAME)
/* 
    The process.env property returns an object that represents your environment. 
    Before you run this Node.js application, you must set the value of the NETWORK_NAME environment variable as follows:
    export NETWORK_NAME=rinkeby
*/

    console.log('Creating a new Rinkeby wallet for Alice')
    const aliceRinkebyWallet = new ethers.Wallet(process.env.ALICE_PRIVATE_KEY, ethersProvider)
    console.log(`Alice's Rinkeby address is: ${aliceRinkebyWallet.address}`)

    console.log('Creating a zkSync wallet for Alice')
    const aliceZkSyncWallet = await utils.initAccount(aliceRinkebyWallet, zkSyncProvider, zksync)

    const aliceInitialRinkebyBalance = await aliceRinkebyWallet.getBalance()
    console.log(`Alice's initial balance on Rinkeby is: ${ethers.utils.formatEther(aliceInitialRinkebyBalance)}`)

    const tokenSet = zkSyncProvider.tokenSet
    const aliceInitialRinkebyBalanceToken1 = await aliceZkSyncWallet.getEthereumBalance(token1)
    console.log(`Alice's initial balance on Rinkeby is: ${tokenSet.formatToken(token1, aliceInitialRinkebyBalanceToken1)}`)
  
    await aliceZkSyncWallet.approveERC20TokenDeposits(token1)

    console.log('Depositing')
    await utils.depositToZkSync(aliceZkSyncWallet, token, amountToDeposit, ethers)
    await utils.displayZkSyncBalance(aliceZkSyncWallet, ethers)

    await utils.depositTokenToZkSync(aliceZkSyncWallet, token1, amountToDeposit1, tokenSet)
    await utils.displayZkSyncTokenBalance(aliceZkSyncWallet, tokenSet)

    await utils.registerAccount(aliceZkSyncWallet)
  
    console.log('Transferring')
    const transferFee = await utils.getFee('Transfer', aliceRinkebyWallet.address, token, zkSyncProvider, ethers)
    await utils.transfer(aliceZkSyncWallet, process.env.BOB_ADDRESS, amountToTransfer, transferFee, token, zksync, ethers)

    const transferTokenFee = await utils.getTokenFee('Transfer', aliceRinkebyWallet.address, token1, zkSyncProvider, tokenSet)
    await utils.transferToken(aliceZkSyncWallet, process.env.BOB_ADDRESS, amountToTransfer1, transferTokenFee, token1, zksync, tokenSet)
  
    console.log('Withdrawing')
    const withdrawalFee = await utils.getFee('Withdraw', aliceRinkebyWallet.address, token, zkSyncProvider, ethers)
    await utils.withdrawToEthereum(aliceZkSyncWallet, amountToWithdraw, withdrawalFee, token, zksync, ethers)

    const withdrawalTokenFee = await utils.getTokenFee('Withdraw', aliceRinkebyWallet.address, token1, zkSyncProvider, tokenSet)
    await utils.withdrawTokenToEthereum(aliceZkSyncWallet, amountToWithdraw1, withdrawalTokenFee, token1, zksync, tokenSet)

  })()  