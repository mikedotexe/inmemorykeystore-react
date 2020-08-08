import { connect, Contract, keyStores, WalletConnection, KeyPair, transactions, utils } from 'near-api-js'
import getConfig from './config'

const nearConfig = getConfig(process.env.NODE_ENV || 'development')

// Initialize contract & set global variables
export async function initContract() {
  // Initialize connection to the NEAR testnet
  nearConfig.contractName = 'dev-1596754590228-4059297'
  const keyStore = new keyStores.InMemoryKeyStore()
  const privateKey = 'ed25519:3XwVzpqeeyehuSNC8YepjnbVffUm1tfCfqCpTYcuveziTxg6zUe34VatvHQ7rQ1ttYMedAiR3m7mdKZMoyLSamVN'
  const accountId2 = 'dev-1596754590228-4059297'
  const hardKeypair = KeyPair.fromString(privateKey);
  console.log('nearConfig.networkId', nearConfig.networkId)
  console.log('accountId2', accountId2)
  console.log('hardKeypair', hardKeypair)
  await keyStore.setKey(nearConfig.networkId, accountId2, hardKeypair);
  const near = await connect(Object.assign({ deps: { keyStore: keyStore } }, nearConfig))

  const account2 = await near.account(accountId2)


  // Initializing Wallet based Account. It can work with NEAR testnet wallet that
  // is hosted at https://wallet.testnet.near.org
  // window.walletConnection = new WalletConnection(near)

  // Getting the Account ID. If still unauthorized, it's just empty string
  // window.accountId = window.walletConnection.getAccountId()
  window.accountId = account2.account_id

  // Initializing our contract APIs by contract name and configuration
  window.contract = await new Contract(account2, nearConfig.contractName, {
    // View methods are read only. They don't modify the state, but usually return some value.
    viewMethods: ['getGreeting'],
    // Change methods can modify the state. But you don't receive the returned value when called.
    changeMethods: ['setGreeting'],
  })
  console.log('aloha end of initcontract')
}

// attached to the form used to update the greeting
// in utils because it works with a vanilla JS or a React approach
export async function onSubmit(event) {
  console.log('aloha top of onSubmit', window.contract)
  let setresult = await window.contract.setGreeting({
    // pass the value that the user entered in the greeting field
    message: 'aloha'
  })
  console.log('aloha setresult', setresult)

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
