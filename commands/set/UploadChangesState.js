var _ = require('lodash'),
    Promise = require('bluebird'),
    path = require('path'),
    PromiseFtp = require('promise-ftp'),
    config = require('config'),
    fs = require('fs');

var dataFile = path.join(__dirname, config.get('tap-list-file'));

Promise.promisifyAll(fs);

function UploadChangesState(beer, tap){
    this._beer = beer;
    this._tap = tap;

    this.noInput = true;
}

UploadChangesState.prototype.process = async function(message) {
    var taplist = await fs.readFileAsync(dataFile, 'utf-8');
    taplist = JSON.parse(taplist);

    var entry = taplist[this._tap.toString()] = {
         "name": this._beer.name,
         "description": this._beer.description,
         "abv": this._beer.abv,
         "ibu": this._beer.ibu,
         "srm": (this._beer.srmId ? this._beer.srmId.toString() : undefined),
         "labels": this._beer.labels
     };

     if (this._beer.style){
        entry.style = {
            "name": this._beer.style.name,
            "shortName": this._beer.shortName
        }
     }

     if (this._beer.breweries && this._beer.breweries.length > 0){
        entry.brewery = {
            "name": this._beer.breweries[0].name,
            "nameShortDisplay": this._beer.breweries[0].nameShortDisplay,
            "images": this._beer.breweries[0].images
        };
     }       

    // Save file
    await fs.writeFileAsync(dataFile, JSON.stringify(taplist, null, 4), 'utf-8');

    // Upload file
    message.channel.send("Updating tap list...");
    var ftp = new PromiseFtp();
    var serverMessage = await ftp.connect(config.ftp);
    console.log(`FTP Server Message: ${serverMessage}`);

    await ftp.put(dataFile, 'tap-list.json');
    await ftp.end();

    // Done
    message.channel.send(`Tap list updated! Set Tap #${this._tap} to:\n**Brewery**:\t${this._beer.breweries[0].name}\n**Beer**:\t${this._beer.name}\n**ABV**:\t${this._beer.abv}%\n**IBUs**:\t${this._beer.ibu ? this._beer.ibu : "?" }\n\n${this._beer.description || ""}`);
}

module.exports = {
    new: (beer, tap) => new UploadChangesState(beer, tap)
}

