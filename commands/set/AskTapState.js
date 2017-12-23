var _ = require('lodash'),
    UploadChangesState = require('./UploadChangesState');

function AskTapState(beer){
    this._beer = beer;
}

AskTapState.prototype.process = async function(message) {
    var tap = _.toNumber(message.content);
    if (!_.isNaN(tap)) {
        if (tap < 1 || tap > 8){
            message.channel.send("The tap number must be between 1 and 8. Please try again:");
        } else{
            return UploadChangesState.new(this._beer, tap);            
        }

    } else {
        if (message.content == "cancel"){
            message.channel.send("User cancelled");
            return;
        } else{
            message.channel.send("That wasn't a tap number. Please try again:");            
        }
    }

    return this;
}

module.exports = {
    new: (beer) => new AskTapState(beer)
}

