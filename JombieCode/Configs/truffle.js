const HDWalletProvider = require("truffle-hdwallet-provider");
const LoomTruffleProvider = require('loom-truffle-provider');
const mnemonic = "YOUR MNEMONIC HERE";

/* Config files are often pushed to GitHub, where anyone can see them, leaving you wide open to attack 😱! 
To avoid revealing your mnemonic (or your private key!), 
you should read it from a file (filename 'mainnet_private_key') and add that file to .gitignore. */
const { readFileSync } = require('fs')
const path = require('path')
const { join } = require('path')

function getLoomProviderWithPrivateKey (privateKeyPath, chainId, writeUrl, readUrl) {
    const privateKey = readFileSync(privateKeyPath, 'utf-8');
    return new LoomTruffleProvider(chainId, writeUrl, readUrl, privateKey);
}

module.exports = {
   
    networks: {
       
        development: {
            host: "127.0.0.1",
            port: 7545,
            network_id: "*",
            gas: 9500000
        },
       
        mainnet: {
            provider: function() {
                return new HDWalletProvider(mnemonic, "https://mainnet.infura.io/v3/<YOUR_INFURA_API_KEY>")
            },
            network_id: "1"
        },
       // provider value is wrapped in a function, which ensures that it won't get initialized until it's needed.
       
        rinkeby: {
            provider: function() {
                return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/<YOUR_INFURA_API_KEY>")
            },
            network_id: 4
        },
       
        loom_testnet: {
            provider: function() {
                const privateKey = 'YOUR_PRIVATE_KEY';
                const chainId = 'extdev-plasma-us1';
                const writeUrl = 'wss://extdev-basechain-us1.dappchains.com/websocket';
                const readUrl = 'wss://extdev-basechain-us1.dappchains.com/queryws';

                /* const privateKeyPath = path.join(__dirname, 'mainnet_private_key');
                const loomTruffleProvider = getLoomProviderWithPrivateKey(privateKeyPath, chainId, writeUrl, readUrl);
                return loomTruffleProvider; */

                const loomTruffleProvider = new LoomTruffleProvider(chainId, writeUrl, readUrl, privateKey);
                loomTruffleProvider.createExtraAccountsFromMnemonic(mnemonic, 10);
                return loomTruffleProvider;
            },
            network_id: '9545242630824'
        }
    },
    compilers: {
        solc: {
            version: "0.4.25"
        }
    }
};