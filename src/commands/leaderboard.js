const Discord = require('discord.js')
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] })
const Command = require('./command')
const Levels = require("discord-xp")
const globalConfig = require('../config/global.json')

module.exports = class Leaderboard extends Command {

    static match(message) {
        return message.content.startsWith('!leaderboard')
    }

    static async action(message) {
        const rawLeaderboard = await Levels.fetchLeaderboard(message.guild.id, 10);
        if (rawLeaderboard.length < 1) return reply("Le learderboard est encore vide.");
        const leaderboard = await Levels.computeLeaderboard(client, rawLeaderboard, true);
        const lb = leaderboard.map(e => `> ${e.position}.   ${e.username}#${e.discriminator}              :crossed_swords: Level: ${e.level}               :alembic: XP: ${e.xp.toLocaleString()}`);
        const embedMsg = {
            color: globalConfig.embed_color,
            title: `:trophy: **Leaderboard**:\n\n${lb.join("\n\n")}`,
        }
        message.channel.send({
            embed: embedMsg
        })
    }
}