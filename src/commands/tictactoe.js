const Command = require("./command");
const TicTacToe = require('discord-tictactoe');
const game = new TicTacToe({ language: 'fr' });

module.exports = class Leaderboard extends Command {
  static match(message) {
    return message.content.startsWith("!tictactoe");
  }

  static async action(message) {
    game.handleMessage(message);
  }
};
