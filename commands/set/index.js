var BreweryDb = require('brewerydb-node'),
    _ = require('lodash'),
    Promise = require('bluebird'),
    AskBeerState = require('./AskBeerState');

var brewdb = new BreweryDb('6e0cc8998b5fa92aef5c0fafa48c525b');
Promise.promisifyAll(brewdb.search);

module.exports.run = async function(args, respond){
    var query = args.join(' ');

    var results = await brewdb.search.beersAsync({ q:query, type: "beer", withBreweries: "Y" });

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

    respond("Which beer?");

    return AskBeerState.new(results);
}

function describeBeer(item){
    var brewery = item.breweries.map(b => b.name).join(', ');
    return `${brewery}: ${item.nameDisplay}`;
}

