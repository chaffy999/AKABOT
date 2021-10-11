const Discord = require('discord.js')
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] })
const globalConfig = require('../config/global.json')
const canvacord = require('canvacord')
const Event = require('./event')

module.exports = class Welcomer extends Event {

    static async action(member) {
        const { Welcomer } = require("canvacord")
        const card = new Welcomer()
            .setUsername(member.user.username)
            .setDiscriminator(member.user.discriminator)
            .setMemberCount(member.guild.memberCount.toLocaleString())
            .setGuildName(member.guild.name)
            .setAvatar(member.user.displayAvatarURL({ format: "png" }))
            .setBackground("https://i0.wp.com/css-tricks.com/wp-content/uploads/2020/11/css-gradient.png")
            .setColor("border", "#000000")
            .setColor("username-box", "#000000")
            .setColor("discriminator-box", "#000000")
            .setColor("message-box", "#000000")
            .setColor("title", "#f15322")
            .setColor("avatar", "#000000")
            .setText("member-count", "{count}ème membre")
            .setText("title", "Bienvenue")
            .setText("message", "Bienvenue sur le serveur")

        card.build()
            .then(buffer => member.guild.channels.cache.get(globalConfig.random_channel_id).send(new Discord.MessageAttachment(buffer, "welcome.png")));
    }

}