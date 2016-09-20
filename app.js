console.log('Starting password manager....');

var storage = require('node-persist');
storage.initSync();

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
            }
        });
    })
    .command('get', 'Get Account deltails for an account', function (yargs) {
        yargs.options({
            name : {
                demand : true,
                alias : 'n',
                type : 'string'
            }
        });
    })
    .argv;

var command = yargs._[0];

function createAccount (account) {
    var accounts = storage.getItemSync('accounts');

    if (typeof accounts === 'undefined') {
        accounts = [];
    } else {
        accounts.push(account);
    }

    storage.setItemSync('accounts', accounts);
    return account
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
            }
        });
        if (typeof matchedAccount !== 'undefined') {
            console.log('Account Found......');
            return matchedAccount;
        } else {
            console.log('Account not found :(');
        }
    }
}

if(command === 'create' 
    && typeof yargs.name !== 'undefined' 
    && typeof yargs.username !== 'undefined'
    && typeof yargs.password !== 'undefined'){
        createAccount({
            name : yargs.name,
            username : yargs.username,
            password : yargs.password
        });
} else if (command === 'get' && typeof yargs.name !== 'undefined') {
    var fetchedAccount = getAccount(yargs.name);
    if (typeof fetchedAccount !== 'undefined') {
        console.log(fetchedAccount);
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
