
function AskAttributeState(ask, callback, next){
    this._ask = ask;
    this._callback = callback;
    this._next = next;
}

AskAttributeState.prototype.process = async function(message) {
    this._callback(message.content);

    if (this._next.ask){
        this._next.ask();
        return this._next;
    } else {
        return await this._next.process(message);
    }
}

AskAttributeState.prototype.ask = function(){
    this._ask();
}

module.exports = {
    new: (ask, cb, next) => new AskAttributeState(ask, cb, next)
};