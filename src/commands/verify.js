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
        .setURL("https://www.it-akademy.fr/")
        .setLabel("➡️ Vérifier mon compte Google")
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
