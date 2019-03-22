var BreweryDb = require('brewerydb-node'),
    _ = require('lodash'),
    Promise = require('bluebird'),
    fs = require('fs'),
    path = require('path'),
    config = require('config'),
    AskBeerState = require('./AskBeerState');

var brewdb = new BreweryDb('6e0cc8998b5fa92aef5c0fafa48c525b');
Promise.promisifyAll(brewdb.search);
Promise.promisifyAll(fs);
var inventoryFile = path.join(path.join(__dirname, "../../"), config.get('inventory-file'));


module.exports.run = async function(args, respond){

    try {
        fs.statSync(inventoryFile);
    } catch(e){
        await fs.writeFileAsync(inventoryFile, JSON.stringify([], null, 4), 'utf-8');
    }

    var results = await fs.readFileAsync(inventoryFile, 'utf-8');
    results = JSON.parse(results);

    if (results.length == 0){
        respond("Couldn't find anything. Try again.");
        return;
    }

    var items =
        _.map(results, (item, index) => {
            return `[${index}]\t${describeBeer(item)}`;
        });

    var message = "";
    while(items.length > 0){
        if (message.length + items[0].length > 2000 ){
            respond(message);
            message = "";
        }

        message += items.shift() + "\n";
    }

    if (message){
        respond(message);
    }

    respond("Which beer? If you don't see what you're looking for, type the search again, otherwise type `cancel`.");

    return AskBeerState.new(results);
}

function describeBeer(item){
    var brewery = item.breweries.map(b => b.name).join(', ');
    return `${brewery}: ${item.nameDisplay || item.name}`;
}

