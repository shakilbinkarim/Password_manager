var yargs = require('yargs')
    .command('hello', 'Greets the user', function (yargs) {
        yargs.options({
            name : {
                demand : true,
                alias : 'n',
                despription : 'Your first name goes here'
            }
        }).help('help');
    })
    .help('help')
    .argv;

var command = yargs._[0];

console.log(yargs);

if(command === 'hello' && typeof yargs.name !== 'undefined' && typeof yargs.lastname !== 'undefined'){
    console.log('Hello ' + yargs.name + ' ' + yargs.lastname + '!');
} else if (command === 'hello' && typeof yargs.name !== 'undefined') {
    console.log('Hello ' + yargs.name + '!');
} else if (command === 'hello') {
    console.log('Hello World!');
}

