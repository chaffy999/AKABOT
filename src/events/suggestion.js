const globalConfig = require('../config/global.json')
const Event = require('./event')

module.exports = class Suggestion extends Event {

    static action(message) {
        if (message.content.length > 10) {
            const suggestionEmbed = {
                color: globalConfig.embed_color,
                title: 'Suggestion de ' + message.member.displayName,
                description: message.content,
                timestamp: new Date(),
                footer: {
                    text: 'Proposé par ' + message.member.displayName,
                    icon_url: 'https://cdn.discordapp.com/avatars/' + message.author.id + '/' + message.author.avatar + '.png',
                },
            }
            message.channel.send({
                ephemeral: false,
                embeds: [suggestionEmbed],
            }).then(function (sendMessage) {
                sendMessage.react('✅')
                sendMessage.react('❌')
            })
        } else {
            const errorEmbed = {
                color: globalConfig.embed_color,
                title: 'Merci de nous donner plus de détails sur votre suggestion (plus de 10 caractères)',
            }
            message.channel.send({
                ephemeral: false,
                embeds: [errorEmbed],
            }).then(response => {
                setTimeout(() => response.delete(), 5000)
            })
        }
        message.delete()
    }

}