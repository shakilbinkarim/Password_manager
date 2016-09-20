console.log('Starting password manager....');

var storage = require('node-persist');
storage.initSync();

function createAccount (account) {
    var accounts = storage.getItemSync('accounts');

    if (typeof accounts === 'undefined') {
        accounts = [];
    } else {
        accounts.push(account);
    }

    storage.setItemSync('accounts', accounts);

}

function getAccount (accountName) {
    var accounts = storage.getItemSync('accounts');

    var matchedAccount;

    if (typeof accounts === 'undefined') {
        accounts = [];
        console.log('Account not found :(');
    } else {
        accounts.forEach(function(account) {
            if (account.name === accountName) {
                matchedAccount = account;
                break;
            }
        });
        if (typeof matchedAccount !== 'undefined') {
            console.log('Account Found......');
            console.log(matchedAccount);
        } else {
            console.log('Account not found :(');
        }
    }

}