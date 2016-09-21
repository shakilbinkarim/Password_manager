console.log('Starting password manager....');

var storage = require('node-persist');
storage.initSync();

var crypto = require('crypto-js');

var yargs = require('yargs')
    .command('create', 'Create a new account', function (yargs) {
        yargs.options({
            name : {
                demand : true,
                alias : 'n',
                type : 'string'
            }, 
            username : {
                demand : true,
                alias : 'u',
                type : 'string'
            },
            password : {
                demand : true,
                alias : 'p',
                type : 'string'
            },
            masterPassword : {
                demand : true,
                alias : 'm',
                type : 'string'
            }
        });
    })
    .command('get', 'Get Account deltails for an account', function (yargs) {
        yargs.options({
            name : {
                demand : true,
                alias : 'n',
                type : 'string'
            },
            masterPassword : {
                demand : true,
                alias : 'm',
                type : 'string'
            }
        });
    })
    .argv;

var command = yargs._[0];

function getAccounts (masterPassword) {
    // use getItemSync to fetch accounts
    var encryptedAccounts = storage.getItemSync('accounts');
    
    /**
     * Setting the accounts to an empty array so that 
     * if no accounts existed before, we return an empty array
     */
    var accounts = [];
    
    // decrypt
    if (typeof encryptedAccounts !== 'undefined') {
        var bytes = crypto.AES.decrypt(encryptedAccounts, masterPassword);
        accounts = JSON.parse(bytes.toString(crypto.enc.Utf8));
    }

    // return accounts array
    return accounts;
}

function saveAccounts (accounts, masterPassword) {
    // encrypt
    var accountsJSON = JSON.stringify(accounts);
    var encryptedAccounts = crypto.AES.encrypt(accountsJSON, masterPassword);
    storage.setItemSync('accounts', encryptedAccounts.toString());
    return accounts;
}

function createAccount (account, masterPassword) {
    var accounts = getAccounts(masterPassword);

    /**
     * Checking typeof account is unnecessary
     * as we get an empty array from 
     * getAccounts(masterPassword) function
     * if no previous accounts exist
     */
    accounts.push(account);
    saveAccounts(accounts, masterPassword);
    return account
}

function getAccount (accountName, masterPassword) {
    var accounts = getAccounts(masterPassword);

    var matchedAccount;

    accounts.forEach(function(account) {
        if (account.name === accountName) {
            matchedAccount = account;
        }
    });
    if (typeof matchedAccount !== 'undefined') {
        console.log('Account Found......');
        return matchedAccount;
    } else {
        console.log('Account not found :(');
    }
    
}

if(command === 'create' 
    && typeof yargs.name !== 'undefined' 
    && typeof yargs.username !== 'undefined'
    && typeof yargs.password !== 'undefined'){
        try {
            createAccount({
                name : yargs.name,
                username : yargs.username,
                password : yargs.password
            }, yargs.masterPassword);
        } catch (error) {
            console.log('Unable to create accounts');
        }
} else if (command === 'get' && typeof yargs.name !== 'undefined') {
    try {
        var fetchedAccount = getAccount(yargs.name, yargs.masterPassword);
        if (typeof fetchedAccount !== 'undefined') {
            console.log(fetchedAccount);
        }
    } catch (error) {
            console.log('Unable to get account');        
    }
}

/*createAccount({
    name : 'Instagram',
    username : 'grey@fairytail.com',
    password : 'ieatIce'
});
createAccount({
    name : 'LinkedIn',
    username : 'erza@fairytail.com',
    password : 'titania'
});
var fetchedAccount = getAccount('Instagram');
console.log(fetchedAccount);*/
