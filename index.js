const Discord = require('discord.js')
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] })
require('dotenv').config()
const globalConfig = require('./src/config/global.json')

const Clear = require('./src/commands/clear')
const Welcome = require('./src/commands/welcome')

const Suggestion = require('./src/events/suggestion')

const React = require('./src/classes/react')

client.on('ready', function () {
    client.user.setActivity("Code with ❤️", {
        type: "WATCHING"
    }).catch(console.error)
    console.log('Bot started !')
})

client.on('message', function (message) {
    if (message.author.bot) return
    if (message.content.charAt(0) === globalConfig.prefix) {
        Clear.parse(message, 'MANAGE_MESSAGES') || Welcome.parse(message, 'ADMINISTRATOR')
    } else if (message.channel.id == globalConfig.suggestions_channel_id) {
        Suggestion.parse(message)
    }
})

client.on('messageReactionAdd', async (reaction, user) => {
    if (user.bot) return
    if (reaction.message.id === globalConfig.welcome_message_id) {
        React.parse(reaction, user, '+')
    }
});

client.on('messageReactionRemove', async (reaction, user) => {
    if (user.bot) return
    if (reaction.message.id === globalConfig.welcome_message_id) {
        React.parse(reaction, user, '-')
    }
});

client.login(process.env.DISCORD_TOKEN)