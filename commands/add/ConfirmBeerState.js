var AskTapState = require('../set/AskTapState');

function ConfirmBeerState(beer){
    this._beer = beer;
}

ConfirmBeerState.prototype.process = async function(message) {
    var beer = this._beer;
    this._beer = {
        "name": beer.name,
        "description": "",
        "abv": beer.abv,
        "ibu": "",
        "srm": undefined,
        "labels": "",
        "style": {
            "name": beer.style,
            "shortName": beer.style
        },
        "breweries": [
            {
                "name": beer.brewery
            }
        ]
    };

    message.channel.send(`Is this correct? \n\n\t**Brewery**: ${this._beer.breweries[0].name}\n\t**Beer**: ${this._beer.name}\n\t**Style**: ${this._beer.style.name || "?"}\n\t**ABV**: ${this._beer.abv || "?"}`)

    return new YesNoState((message) => {

        message.channel.send("Which tap?");
        return AskTapState.new(this._beer);
    }, undefined);
}

module.exports = {
    new: (beer) => new ConfirmBeerState(beer)
};

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