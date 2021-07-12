module.exports = class Command {

    static parse(message, permission) {
        if (this.match(message)) {
            if (this.checkPerm(message, permission)) {
                this.action(message)
                return true
            }
            return false
        }
        return false
    }

    static match(message) {
        return false
    }

    static action(message) {}

    static checkPerm(message, permission = '') {
        if(permission === '') return true
        if (message.member.hasPermission(permission)){
            return true
        }else{
            const errorEmbed = {
                color: process.env.EMBED_COLOR,
                title: `Tu n'as pas la permission d'effectuer cette commande...`,
            }
            message.reply({
                embed: errorEmbed
            }).then(response => {
                response.delete({ timeout: 5000 })
            })
            message.delete()
            return false
        }
    }
}