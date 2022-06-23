const Command = require("./command");
const globalConfig = require("../config/global.json");

module.exports = class Clear extends Command {
  static match(message) {
    return message.content.startsWith("!clear");
  }

  static action(message) {
    let args = message.content.split(" ");
    args.shift();

    if (!args[0])
      return message.channel.send(
        "Tu dois spécifier un nombre de messages à supprimer !"
      );

    message.channel.bulkDelete(args[0]).then((messages) => {
      const errorEmbed = {
        color: globalConfig.embed_color,
        title: `Les ${args[0]} derniers messages ont été supprimés !`,
      };
      message.channel
        .send({
          ephemeral: false,
          embeds: [errorEmbed],
        })
        .then((response) => {
          setTimeout(() => response.delete(), 5000);
        });
    });

    message.delete();
  }
};
