const Discord = require('discord.js')
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] })
require('dotenv').config()

client.on('ready', function () {
    client.user.setActivity("Code with ❤️", {
        type: "WATCHING"
    }).catch(console.error)
    console.log('Bot started !')
})

client.login(process.env.DISCORD_TOKEN)