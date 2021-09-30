const globalConfig = require('../config/global.json')

module.exports = class Rules {

    static add(reaction, user) {
        const guild = reaction.message.guild;
        const memberWhoReacted = guild.members.cache.find(member => member.id === user.id)
        let emoji = reaction.emoji
        if (emoji.name === '👨‍💻') {
            memberWhoReacted.roles.add(globalConfig.dfs_group_id)
        } else if (emoji.name === '👨‍💼') {
            memberWhoReacted.roles.add(globalConfig.emsi_group_id)
        } else if (emoji.name === '🔒') {
            memberWhoReacted.roles.add(globalConfig.esd_group_id)
        } else if (emoji.name === '📱') {
            memberWhoReacted.roles.add(globalConfig.dwm_group_id)
        } else if (emoji.name === '🧪') {
            memberWhoReacted.roles.add(globalConfig.tlo_group_id)
        } else if (emoji.name === '🛡️') {
            memberWhoReacted.roles.add(globalConfig.rosi_group_id)
        }
    }

    static remove(reaction, user) {
        const guild = reaction.message.guild;
        const memberWhoReacted = guild.members.cache.find(member => member.id === user.id)
        let emoji = reaction.emoji
        if (emoji.name === '👨‍💻') {
            memberWhoReacted.roles.remove(globalConfig.dfs_group_id)
        } else if (emoji.name === '👨‍💼') {
            memberWhoReacted.roles.remove(globalConfig.emsi_group_id)
        } else if (emoji.name === '🔒') {
            memberWhoReacted.roles.remove(globalConfig.esd_group_id)
        } else if (emoji.name === '📱') {
            memberWhoReacted.roles.remove(globalConfig.dwm_group_id)
        } else if (emoji.name === '🧪') {
            memberWhoReacted.roles.remove(globalConfig.tlo_group_id)
        } else if (emoji.name === '🛡️') {
            memberWhoReacted.roles.remove(globalConfig.rosi_group_id)
        }
    }

    static parse(reaction, user, order) {
        if (order == '+') {
            this.add(reaction, user)
            return true
        } else if (order == '-') {
            this.remove(reaction, user)
            return true
        }
        return false
    }
}