var _ = require('lodash'),
    BreweryDb = require('brewerydb-node'),
    Promise = require('bluebird'),
    AskTapState = require('./AskTapState');

var brewdb = new BreweryDb('6e0cc8998b5fa92aef5c0fafa48c525b');
Promise.promisifyAll(brewdb.beer);

function AskBeerState(results){
    this._results = results;
}

AskBeerState.prototype.process = async function(message) {
    var index = _.toNumber(message.content);
    if (!_.isNaN(index)) {
        var selected = this._results[index];

        message.channel.send(`You selected: ${describeBeer(selected)}`);
        message.channel.send("Which tap?");

        //var details = await brewdb.beer.getByIdAsync(selected.id, {});

        return AskTapState.new(selected);

    } else {
        message.channel.send('Fine then, be that way.');
    }
}

function describeBeer(item){
    var brewery = item.breweries.map(b => b.name).join(', ');
    return `${brewery}: ${item.nameDisplay}`;
}

module.exports = {
    new: (results) => new AskBeerState(results)
}

