const Discord = require('discord.js')
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] })
require('dotenv').config()
const globalConfig = require('./src/config/global.json')

const Clear = require('./src/commands/clear')
const Welcome = require('./src/commands/welcome')

const Suggestion = require('./src/events/suggestion')

const React = require('./src/classes/react')
const Rename = require('./src/classes/rename')

var lastFeed = []

client.on('ready', function () {
    client.user.setActivity("Code with ❤️")
    console.log('Bot started !')
    setInterval(timeCycle, 21600000)
})

client.on('message', function (message) {
    if (message.author.bot) return
    if (message.content.charAt(0) === globalConfig.prefix) {
        Clear.parse(message, 'MANAGE_MESSAGES') || Welcome.parse(message, 'ADMINISTRATOR')
    } else if (message.channel.id == globalConfig.suggestions_channel_id) {
        Suggestion.parse(message)
    } else if (message.channel.id == globalConfig.welcome_channel_id) {
        Rename.parse(message)
    }
})

client.on('messageReactionAdd', async (reaction, user) => {
    if (user.bot) return
    if (reaction.message.id === globalConfig.welcome_message_id) {
        React.parse(reaction, user, '+')
    }
})

client.on('messageReactionRemove', async (reaction, user) => {
    if (user.bot) return
    if (reaction.message.id === globalConfig.welcome_message_id) {
        React.parse(reaction, user, '-')
    }
})

function randomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min
}

function timeCycle() {
    let Parser = require('rss-parser')
    let parser = new Parser()
    (async () => {

        let feed = await parser.parseURL('https://dev.to/feed/tag/technology')
        var rand = randomInt(1, 6)
        const channel = await client.channels.fetch(globalConfig.tech_channel_id)
        if(feed.items[rand].title && feed.items[rand].link){
            channel.send(":newspaper: | **"+feed.items[rand].title+"**\n\n"+feed.items[rand].link)
        }else{
            console.log('empty')
        }
    })()
}

client.login(process.env.DISCORD_TOKEN)