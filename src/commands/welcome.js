const globalConfig = require('../config/global.json')
const Command = require('./command')
const fs = require('fs')

module.exports = class Welcome extends Command {

    static match(message) {
        return message.content.startsWith('!welcome')
    }

    static action(message) {
        const welcomeEmbed = {
            color: globalConfig.embed_color,
            title: `Bienvenue sur le serveur Discord des étudiants et anciens étudiants de l'IT-Akademy !`,
            description: `Ici vous pourrez retrouver les informations importantes de l'école, les avantages et partenariats, vous entraider etc.\u200b`,
            thumbnail: {
                url: 'https://avatars.githubusercontent.com/u/61742295',
            },
            fields: [
                {
                    name: `N'oubliez pas de réagir à ce message en fonction des formations que vous avez suivi.`,
                    value: '\u200b',
                },
                {
                    name: 'Formation',
                    value: '🧪 TLO',
                    inline: true,
                },
                {
                    name: 'BAC+2',
                    value: '📱 DWM',
                    inline: true,
                },
                {
                    name: '\u200b',
                    value: '\u200b',
                    inline: false,
                },
                {
                    name: 'BAC+4',
                    value: '🛡️ ROSI\n\n👨‍💻 DFS',
                    inline: true,
                },
                {
                    name: 'BAC+5',
                    value: '🔒 ESD\n\n👨‍💼 EMSI',
                    inline: true,
                },
                {
                    name: '\u200b',
                    value: '⬇️ N\'oubliez pas d\'envoyer un message contenant votre **prénom** et **nom** ci-dessous afin que vous soyez automatiquement renommé(e). ✅',
                    inline: false,
                },
            ]
        }
        message.reply({
            embed: welcomeEmbed
        }).then(function (message) {
            message.react('🧪')
            message.react('📱')
            message.react('🛡️')
            message.react('👨‍💻')
            message.react('🔒')
            message.react('👨‍💼')
            fs.readFile('./src/config/global.json', 'utf-8', (err, data) => {
                if (err) {
                    throw err
                }
                const config = JSON.parse(data.toString())
                console.log(config)
                const newConfig = {
                    ...config,
                    "welcome_message_id": message.id,
                }
                const stringConfig = JSON.stringify(newConfig)
                fs.writeFile('./src/config/global.json', stringConfig, (err) => {
                    if (err) {
                        throw err
                    }
                    console.log("JSON data is saved.")
                })
            })
        })
        message.delete()
    }

}