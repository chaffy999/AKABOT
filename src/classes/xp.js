const Levels = require("discord-xp")
const globalConfig = require('../config/global.json')

module.exports = class Xp {

    static async addXp(message) {
        const randomAmountOfXp = Math.floor(Math.random() * 29) + 1; // Min 1, Max 30
        const hasLeveledUp = await Levels.appendXp(message.author.id, message.guild.id, randomAmountOfXp);
        if (hasLeveledUp) {
            const user = await Levels.fetch(message.author.id, message.guild.id);
            message.channel.send(`${message.author}, félicitations ! Tu viens de passer au niveau **${user.level}**. :tada:`);
        }
    }

    static parse(message) {
        if (message.content.length > 3) {
            this.addXp(message)
            return true
        }
        return false
    }
}