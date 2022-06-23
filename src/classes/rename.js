const globalConfig = require('../config/global.json')

module.exports = class Rename {

    static rename(message) {
        message.member.setNickname(message.content)
        const errorEmbed = {
            color: globalConfig.embed_color,
            title: `Vous avez bien été renommé.`,
        }
        message.channel.send({
            ephemeral: false,
            embeds: [errorEmbed],
        }).then(response => {
            setTimeout(() => response.delete(), 5000)
        })
        message.delete()
    }

    static reject(message) {
        const errorEmbed = {
            color: globalConfig.embed_color,
            title: `Le message que vous avez envoyé est trop court pour contenir votre nom et prénom...`,
        }
        message.channel.send({
            ephemeral: false,
            embeds: [errorEmbed],
        }).then(response => {
            setTimeout(() => response.delete(), 5000)
        })
        message.delete()
    }

    static parse(message) {
        if (message.content.length > 5) {
            this.rename(message)
            return true
        } else {
            this.reject(message)
        }
        return false
    }
}