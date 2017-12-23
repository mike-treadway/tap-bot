var helpMessage = `**tb help**: Displays this help message.
**tb set *{search query}***: Set a new beer on tap. I'll ask you some questions after you type this command.
`;


module.exports.run = async function(args, respond){
    respond(helpMessage);
}


