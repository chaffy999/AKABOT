const Discord = require('discord.js')
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] })
require('dotenv').config()
const globalConfig = require('./src/config/global.json')

const Suggestion = require('./src/events/suggestion')

client.on('ready', function () {
    client.user.setActivity("Code with ❤️", {
        type: "WATCHING"
    }).catch(console.error)
    console.log('Bot started !')
})

client.on('message', function (message) {
    if (message.author.bot) return
    if (message.channel.id == globalConfig.suggestions_channel_id) {
        Suggestion.parse(message)
    }
})

client.login(process.env.DISCORD_TOKEN)