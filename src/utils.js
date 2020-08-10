import { connect, Contract, keyStores, WalletConnection, KeyPair, transactions, utils } from 'near-api-js'
import getConfig from './config'

const nearConfig = getConfig(process.env.NODE_ENV || 'development')

// Initialize contract & set global variables
export async function initContract() {
  // Initialize connection to the NEAR testnet
  nearConfig.contractName = 'near-link.o.mike.testnet'
  const keyStore = new keyStores.InMemoryKeyStore()
  const privateKey = 'ed25519:2W8yR91nSSzK3hU5M6R77bCWHBV7G2RkwZtQxgxmQuL7ahxgEyKVMbq9p7kBM1QZZY5cibzx3nqn5CXKx4P4YmNe'
  const hardKeypair = KeyPair.fromString(privateKey);
  await keyStore.setKey(nearConfig.networkId, nearConfig.contractName, hardKeypair);
  const near = await connect(Object.assign({ deps: { keyStore: keyStore } }, nearConfig))
  window.near = near


  const latestHash = (await near.connection.provider.status()).sync_info.latest_block_hash;
  const latestBlock = await near.connection.provider.block(latestHash);
  const previousBlockHash = latestBlock.header.prev_hash
  console.log('aloha latestHash', latestHash)
  console.log('aloha latestBlock', latestBlock)
  console.log('aloha previousBlockHash', previousBlockHash)

  window.account = await near.account(nearConfig.contractName)
  // const hm = await near.account(nearConfig.contractName)

  const transferArgs = {
    escrow_account_id: "joshford.testnet",
    amount: "19"
  }
  // because numbers can be enormous and JavaScript sux we send most amounts as strings

  // const transferResult = await window.account.functionCall(
  // const res = window.account.signAndSendTransaction(
  //   nearConfig.contractName,
  //   [transactions.functionCall('transfer',
  //     Buffer.from(JSON.stringify(transferArgs)))]
  // )

  // const transferResult = await hm.functionCall(
  //   window.accountId,
  //   'transfer',
  //   Buffer.from(JSON.stringify(transferArgs))
  // )


  // Initializing Wallet based Account. It can work with NEAR testnet wallet that
  // is hosted at https://wallet.testnet.near.org
  // window.walletConnection = new WalletConnection(near)

  // Getting the Account ID. If still unauthorized, it's just empty string
  // window.accountId = window.walletConnection.getAccountId()
  window.accountId = account.accountId

  // Initializing our contract APIs by contract name and configuration
  window.contract = await new Contract(account, nearConfig.contractName, {
    // View methods are read only. They don't modify the state, but usually return some value.
    viewMethods: ['get_balance', 'get_allowance'],
    // Change methods can modify the state. But you don't receive the returned value when called.
    changeMethods: ['transfer', 'inc_allowance'],
  })
}

async function getAccount() {
  nearConfig.contractName = 'near-link.o.mike.testnet'
  const keyStore = new keyStores.InMemoryKeyStore()
  const privateKey = 'ed25519:2W8yR91nSSzK3hU5M6R77bCWHBV7G2RkwZtQxgxmQuL7ahxgEyKVMbq9p7kBM1QZZY5cibzx3nqn5CXKx4P4YmNe'
  const hardKeypair = KeyPair.fromString(privateKey);
  await keyStore.setKey(nearConfig.networkId, nearConfig.contractName, hardKeypair);
  const near = await connect(Object.assign({ deps: { keyStore: keyStore } }, nearConfig))

  return await near.account(nearConfig.contractName)
}

// attached to the form used to update the greeting
// in utils because it works with a vanilla JS or a React approach
export async function onSubmit(event) {
  // check some balances
  let josh = 'joshford.testnet'

  let targetAccountId = josh
  let tokenInAccount = await window.contract.get_balance({
    // pass the value that the user entered in the greeting field
    owner_id: targetAccountId
  })
  console.log(`${targetAccountId} has ${tokenInAccount} tokens`)

  tokenInAccount = await window.contract.get_allowance({
    // pass the value that the user entered in the greeting field
    owner_id: window.accountId,
    escrow_account_id: josh
  })
  console.log(`${targetAccountId} has ${tokenInAccount} allowance`)

  tokenInAccount = await window.contract.get_balance({
    // pass the value that the user entered in the greeting field
    owner_id: window.accountId
  })
  console.log(`${window.accountId} has ${tokenInAccount} tokens`)

  console.log('-------------------')

  // transfer to Jahsh

  // const hm = await getAccount()
  const transferArgs = {
    "new_owner_id": "joshford.testnet",
    "amount": "19" // because numbers can be enormous and JavaScript sux we send most amounts as strings
  }

  // THIS WAY
  // const transferResult = await window.account.functionCall(
  let transferResult = await window.account.functionCall(
    window.accountId,
    'transfer',
    transferArgs,
    null,
    '36500000000000000000000'
  )


    // Buffer.from(JSON.stringify(transferArgs))

    // .inc_allowance()
  console.log('result of transferring fungible tokens to josh', transferResult)
  window.tx = transferResult
  const block = transferResult.transaction_outcome.block_hash
  console.log('block', block)
  const blockObj = await window.near.connection.provider.block(block);
  console.log('blockObj', blockObj)
  let chunkFromChunkHash = async c => { return await window.near.connection.provider.chunk(c.chunk_hash) };
  const allChunks = await Promise.all(blockObj.chunks.map(chunkFromChunkHash));

  // Filter for chunks with transactions
  let chunksContainingTxs = allChunks.filter(function (chunk) {
    return chunk.transactions.length !== 0;
  });
  console.log('alohazzz chunksContainingTxs', chunksContainingTxs)


  tokenInAccount = await window.contract.get_balance({
    // pass the value that the user entered in the greeting field
    owner_id: targetAccountId
  })
  console.log(`${targetAccountId} has ${tokenInAccount} tokens`)

  tokenInAccount = await window.contract.get_balance({
    // pass the value that the user entered in the greeting field
    owner_id: window.accountId
  })
  console.log(`${window.accountId} has ${tokenInAccount} tokens`)

  // AND THIS WAY
  // transferResult = await window.contract.transfer({
  //   new_owner_id: josh,
  //   amount: "1" // because numbers can be enormous and JavaScript sux we send most amounts as strings
  // })
  // console.log('result of transferring fungible tokens to josh', transferResult)
  // console.log(`https://explorer.testnet.near.org/transactions/${transferResult.transaction.hash}`)


  // see how many josh and the contract itself has (lazy-ass copy/paste)

  targetAccountId = josh
  tokenInAccount = await window.contract.get_balance({
    // pass the value that the user entered in the greeting field
    owner_id: targetAccountId
  })
  console.log(`${targetAccountId} has ${tokenInAccount} tokens`)

  tokenInAccount = await window.contract.get_balance({
    // pass the value that the user entered in the greeting field
    owner_id: window.accountId
  })
  console.log(`${window.accountId} has ${tokenInAccount} tokens`)

  return

  async function getFile() {
    try {
      const response = await fetch('https://near-examples.github.io/FT/out/nep21-basic-rs.wasm', {
        method: 'GET',
      });
      // return await response.blob();
      const ab = await response.arrayBuffer();
      return ab;
    } catch (error) {
      console.error(error);
    }
  }

  // const hardcoded = {
  //   "account_id":"dev-1596754590228-4059297",
  //   "public_key":"ed25519:AUtN3eJ1xr2o4uYYPg4pPjZ7vKnfcsm2aCfXMWeN3dE",
  //   "private_key":"ed25519:3XwVzpqeeyehuSNC8YepjnbVffUm1tfCfqCpTYcuveziTxg6zUe34VatvHQ7rQ1ttYMedAiR3m7mdKZMoyLSamVN"
  // }
  // const hardcoded = '{"account_id":"dev-1596754590228-4059297","public_key":"ed25519:AUtN3eJ1xr2o4uYYPg4pPjZ7vKnfcsm2aCfXMWeN3dE","private_key":"ed25519:3XwVzpqeeyehuSNC8YepjnbVffUm1tfCfqCpTYcuveziTxg6zUe34VatvHQ7rQ1ttYMedAiR3m7mdKZMoyLSamVN"}'


  console.log('aloha top of onSubmit');
  event.preventDefault()

  const wasmFile = await getFile();
  console.log('aloha file', wasmFile);

  const uint8wasmFile = new Uint8Array(wasmFile);
  console.log('aloha uint8wasmFile', uint8wasmFile);


  const keypair = KeyPair.fromRandom('ed25519')
  console.log('aloha keypair', keypair)


  const keyStore = new keyStores.InMemoryKeyStore()
  const near = await connect({ ...nearConfig, keyStore });
  // const near = await connect(Object.assign({
  //   deps: { keyStore: new keyStores.InMemoryKeyStore() }
  // }, nearConfig))
  const privateKey = 'ed25519:3XwVzpqeeyehuSNC8YepjnbVffUm1tfCfqCpTYcuveziTxg6zUe34VatvHQ7rQ1ttYMedAiR3m7mdKZMoyLSamVN'
  const accountId2 = 'near-link.joshford.testnet'
  const hardKeypair = KeyPair.fromString(privateKey);
  await keyStore.setKey(nearConfig.networkId, accountId2, hardKeypair);
  const account2 = await near.account(accountId2);



  const sendResult = await account2.signAndSendTransaction('joshford.testnet', [
    transactions.transfer('10000000000000000000')
  ]);
  console.log('sendResult', sendResult)

  return

  const randomNumber = Math.floor(Math.random() * (9999999 - 1000000) + 1000000);
  const accountId = `dev-chainlink-${Date.now()}-${randomNumber}`;
  await near.createAccount(accountId, keypair.getPublicKey());
  await keyStore.setKey(nearConfig.networkId, accountId, keypair);

  const account = await near.account(accountId);
  await account.addKey()
  console.log('aloha account', account);
  const newArgs = {staking_pool_whitelist_account_id: "$WHITELIST_ACCOUNT_ID"};

  const deployedResult = await account.signAndSendTransaction(accountId, [
    transactions.deployContract(uint8wasmFile),
    // transactions.functionCall('new')

    transactions.addKey(
      utils.PublicKey.from("7CFtGxHt66Trcry9LRvXu4DG1UPK4kNDENaZcEtTA2vG"),
      transactions.fullAccessKey()
    )
  ]);
  // transactions.functionCallAccessKey(contractName, methodNames, null))
  console.log('aloha deployedResult', deployedResult);
  const deletedResult = await account.signAndSendTransaction(accountId, [
    transactions.deleteAccount('mike.testnet')
  ]);
  console.log('aloha deletedResult', deletedResult);
}

export function logout() {
  window.walletConnection.signOut()
  // reload page
  window.location.replace(window.location.origin + window.location.pathname)
}

export function login() {
  // Allow the current app to make calls to the specified contract on the
  // user's behalf.
  // This works by creating a new access key for the user's account and storing
  // the private key in localStorage.
  window.walletConnection.requestSignIn(nearConfig.contractName)
}
