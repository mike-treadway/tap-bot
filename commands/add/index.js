var
    AskAttributeState = require('./AskAttributeState'),
    ConfirmBeerState = require('./ConfirmBeerState'),
    _ = require('lodash'),
    Promise = require('bluebird');

module.exports.run = async function(args, respond){
    var beer = {};

    var questions = [
        { q: "What brewery?", key: "brewery" },
        { q: "Beer name?", key: "name"},
        { q: "Style? [enter `?` if you don't know]:", key: "style"},
        { q: "ABV? [enter `?` if you don't know]", key: "abv" }
    ];


    var next = ConfirmBeerState.new(beer);


    for(var i = questions.length - 1; i >=0; i--){
        var question = questions[i];

        (function(question)
        {
            next = AskAttributeState.new(() => respond(question.q), (ans) => beer[question.key] = ans, next);
        })(question);
    }

    if (next.ask){
        next.ask();
    }

    return next;
}

function describeBeer(item){
    var brewery = item.breweries.map(b => b.name).join(', ');
    return `${brewery}: ${item.nameDisplay}`;
}
