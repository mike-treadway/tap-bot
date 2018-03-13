var _ = require('lodash'),
    BreweryDb = require('brewerydb-node'),
    Promise = require('bluebird'),
    config = require('config'),
    setCmd = require('./index'),
    AskTapState = require('./AskTapState');

var brewdb = new BreweryDb(config.breweryDbToken);
Promise.promisifyAll(brewdb.beer);

function AskBeerState(results){
    this._results = results;
}

AskBeerState.prototype.process = async function(message) {
    message.content = message.content.trim().toLowerCase();
    var index = _.toNumber(message.content);
    if (!_.isNaN(index)) {
        var selected = this._results[index];

        message.channel.send(`You selected: ${describeBeer(selected)}`);
        message.channel.send("Which tap?");

        //var details = await brewdb.beer.getByIdAsync(selected.id, {});

        return AskTapState.new(selected);

    } else if (message.content == "cancel"){
        message.channel.send('Fine then, be that way.');
    } else {
        return setCmd.run([message.content], (msg) => message.channel.send(msg));
    }
}

function describeBeer(item){
    var brewery = item.breweries.map(b => b.name).join(', ');
    return `${brewery}: ${item.nameDisplay}`;
}

module.exports = {
    new: (results) => new AskBeerState(results)
}

