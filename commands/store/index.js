var BreweryDb = require('brewerydb-node'),
    _ = require('lodash'),
    config = require('config'),
    Promise = require('bluebird'),
    AskBeerState = require('./AskBeerState');

var brewdb = new BreweryDb(config.breweryDbToken);
Promise.promisifyAll(brewdb.search);

module.exports.run = async function(args, respond){
    var query = args.join(' ').trim();

    if (!query){
        respond("You didn't specify a brewery and beer name. Type 'tb help' for details.");
        return;
    }
    
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

    respond("Which beer? If you don't see what you're looking for, type the search again, otherwise type `cancel`.");

    return AskBeerState.new(results);
}

function describeBeer(item){
    var brewery = item.breweries.map(b => b.name).join(', ');
    return `${brewery}: ${item.nameDisplay}`;
}

