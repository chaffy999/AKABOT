const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const globalConfig = require("../config/global.json");
const Command = require("./command");

module.exports = class Verify extends Command {
  static match(message) {
    return message.content.startsWith("!verify");
  }

  static async action(message) {
    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setURL(`https://discord.com/api/oauth2/authorize?client_id=793935399914831924&redirect_uri=https%3A%2F%2Fakabot-js.herokuapp.com&response_type=code&scope=identify`)
        .setLabel("✅ Vérifier mon compte Google")
        .setStyle("LINK")
    );

    const verify = new MessageEmbed()
        .setTitle("🇬 Authentification Google requise")
      .setDescription("Pour accéder au serveur Discord de l'IT-Akademy, vous devez vous authentifier avec votre compte Google it-students.fr.")
      .setColor(globalConfig.embed_color);

    await message.channel
      .send({
        ephemeral: false,
        embeds: [verify],
        components: [row],
      })
      .then(function () {
        message.delete();
      });
  }
};
