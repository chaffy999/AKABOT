const Command = require('./command')

module.exports = class Clear extends Command {

    static match(message) {
        return message.content.startsWith('!clear')
    }

    static action(message) {
        let args = message.content.split(' ')
        args.shift()

        if(!args[0]) return message.channel.send("Tu dois spécifier un nombre de messages à supprimer !");
        if (message.channel.type == 'text') {
            message.channel.bulkDelete(args[0]).then(() => {
                const errorEmbed = {
                    color: process.env.EMBED_COLOR,
                    title: `Les ${args[0]} derniers messages ont été supprimés !`,
                }
                message.channel.send({
                    embed: errorEmbed
                }).then(response => {
                    response.delete({ timeout: 5000 })
                })
            })
        }

        message.delete()
    }
}