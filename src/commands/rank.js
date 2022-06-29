const Discord = require("discord.js");
const Command = require("./command");
const Levels = require("discord-xp");
const canvacord = require("canvacord");
const globalConfig = require("../config/global.json");

module.exports = class Rank extends Command {
  static match(message) {
    return message.content.startsWith("!rank");
  }

  static async action(message) {
    const target = message.mentions.users.first() || message.author;
    const user = await Levels.fetch(target.id, message.guild.id, true);
    const rank = new canvacord.Rank()
      .setBackground(
        "IMAGE",
        "https://i0.wp.com/css-tricks.com/wp-content/uploads/2020/11/css-gradient.png"
      )
      .setOverlay("#000000", 0.7)
      .setAvatar(target.displayAvatarURL({ format: "png", size: 256 }))
      .setCurrentXP(user.xp, "#f15322")
      .setRequiredXP(Levels.xpFor(user.level + 1))
      .setRank(user.position)
      .setRankColor("#FFFFFF", "#f15322")
      .setLevel(user.level)
      .setLevelColor("#FFFFFF", "#f15322")
      .setStatus(message.guild.members.cache.get(target.id).presence.status)
      .setProgressBar("#f15322")
      .setUsername(target.username, "#f15322")
      .setDiscriminator(target.discriminator);

    rank.build().then((data) => {
      const attachment = new Discord.MessageAttachment(data, "RankCard.png");
      message.channel.send({
        files: [attachment],
      });
    });
  }
};
