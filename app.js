// Import the discord.js module
const Discord = require('discord.js'),
      config = require('config');

// Create an instance of a Discord client
const client = new Discord.Client();

// The token of your bot - https://discordapp.com/developers/applications/me
const token = config.botToken;

const DEFAULT_STATE = new CommandState();
var currentState = DEFAULT_STATE;

// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted
client.on('ready', () => {
    console.log('Authorization URL: https://discordapp.com/api/oauth2/authorize?client_id=363110052011442176&scope=bot');
    console.log('Listening for events...');
});

// Create an event listener for messages
client.on('message', message => {
    // Don't consume messages from bots
    if (message.author.bot){
        return;
    }

    processMessage(message);
});

function processMessage(message){
    currentState.process(message)
        .then(next => {
            currentState = next || DEFAULT_STATE;

            if (currentState.noInput){
                processMessage(message);
            }
    })
    .catch(err => {
        message.channel.send(`ERROR: ${err}`);
        console.error(err);
        currentState = DEFAULT_STATE;
    });
}

// Log our bot in
client.login(token);

function CommandState(){

}

CommandState.prototype.process = async function(message){
        if (message.content.toLowerCase().startsWith('tb')) {
            var command = message.content.substr(3).trim();
            args = command.split(' ');

            var cmd;
            try{
                cmd = require('./commands/' + args[0]);
            } catch(e){
                console.error(e);
                message.channel.send("I don't understand.");
                return;
            }

            args.shift();
            return cmd.run(args, (txt) => {
                message.channel.send(txt);
            });
        }
    };