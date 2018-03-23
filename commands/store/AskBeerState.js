var _ = require('lodash'),
    Promise = require('bluebird'),
    config = require('config'),
    setCmd = require('./index'),
    StoreBeerState = require('./StoreBeerState');

function AskBeerState(results){
    this._results = results;
}

AskBeerState.prototype.process = async function(message) {
    message.content = message.content.trim().toLowerCase();
    var index = _.toNumber(message.content);
    if (!_.isNaN(index)) {
        var selected = this._results[index];

        message.channel.send(`You selected: ${describeBeer(selected)}`);
        message.channel.send("Is that correct?");

        return StoreBeerState.new(selected);

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

function YesNoState(yesCB, noCb){
    this._yesCB = yesCB;
    this._noCB = noCb;
}

YesNoState.prototype.process = async function(message){
    if (message.content.toLowerCase()[0] == 'y'){
        return this._yesCB(message);
    } else{
        return this._noCB ? this._noCB(message) : undefined;
    }
}