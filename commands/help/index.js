var helpMessage = `**tb help**: Displays this help message.
**tb set *{brewery and beer name, i.e. bell's two hearted}***: Set a new beer on tap. I'll ask you some questions after you type this command.
**tb add**: Adds a new beer that isn't on the search list. I'll ask you some questions after you type this command.

For the most part, you'll use **\`tb set\`** to find a beer and put it on tap. If for some reason you can't find that beer, you can use **\`tb add\`** to manually add the information.
`;


module.exports.run = async function(args, respond){
    respond(helpMessage);
}


