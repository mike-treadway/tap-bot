var _ = require('lodash'),
    Promise = require('bluebird'),
    config = require('config'),
    path = require('path'),
    setCmd = require('./index'),
    fs = require('fs');

Promise.promisifyAll(fs);

var inventoryFile = path.join(path.join(__dirname, "../../"), config.get('inventory-file'));

function StoreBeerState(beer){
    this._beer = beer;
}

StoreBeerState.prototype.process = async function(message) {

    if (message.content.trim().toLowerCase().startsWith("y")){
        try {
            fs.statSync(inventoryFile);
        } catch(e){
            await fs.writeFileAsync(inventoryFile, JSON.stringify([], null, 4), 'utf-8');
        }

        var inventory = await fs.readFileAsync(inventoryFile, 'utf-8');
        inventory = JSON.parse(inventory);

        inventory.push(this._beer);
        inventory = _.uniqWith(inventory, (x,y) => x.id == y.id);
        inventory = _.sortBy(inventory, (item) => item.breweries[0].name + item.name);

        await fs.writeFileAsync(inventoryFile, JSON.stringify(inventory, null, 4), 'utf-8');

        message.channel.send("Saved!");
    } else{
        message.channel.send('Cancelled.');
    }

    return;
}

module.exports = {
    new: (results) => new StoreBeerState(results)
}
