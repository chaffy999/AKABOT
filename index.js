const { Client, Intents } = require("discord.js");
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MEMBERS,
  ],
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
});
const Levels = require("discord-xp");
const axios = require("axios");
const express = require("express");
const app = express();
const session = require("express-session");
var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

require("dotenv").config();
const globalConfig = require("./src/config/global.json");

const Clear = require("./src/commands/clear");
const Welcome = require("./src/commands/welcome");
const Rank = require("./src/commands/rank");
const Leaderboard = require("./src/commands/leaderboard");
const Verify = require("./src/commands/verify");

const Suggestion = require("./src/events/suggestion");

const React = require("./src/classes/react");
const Rename = require("./src/classes/rename");
const Xp = require("./src/classes/xp");

Levels.setURL(
  `mongodb+srv://dbAkabot:${process.env.DB_PASS}@cluster0.0pfn9.mongodb.net/AKABOT?retryWrites=true&w=majority`
);

client.once("ready", async () => {
  let i = 0;
  setInterval(() => {
    let activities = [
      `Code with ❤️`,
      `${client.guilds.cache.reduce(
        (a, b) => a + b.memberCount,
        0
      )} membres 🦉`,
      `👨‍💻 ☕ 🔁`,
    ];
    client.user.setActivity(`${activities[i++ % activities.length]}`, {
      type: "WATCHING",
    });
  }, 5000);
  console.log("Bot started !");
  setInterval(timeCycle, 43200000);
});

client.on("messageCreate", async (message) => {
  if (!message.guild) return;
  if (message.author.bot) return;
  if (message.content.charAt(0) === globalConfig.prefix) {
    Rank.parse(message) ||
      Leaderboard.parse(message) ||
      Clear.parse(message, "MANAGE_MESSAGES") ||
      Welcome.parse(message, "ADMINISTRATOR") ||
      Verify.parse(message, "ADMINISTRATOR");
  } else if (message.channel.id == globalConfig.suggestions_channel_id) {
    Suggestion.parse(message);
  } else if (message.channel.id == globalConfig.welcome_channel_id) {
    Rename.parse(message);
  } else {
    Xp.parse(message);
  }
});

client.on("messageReactionAdd", async (reaction, user) => {
  if (user.bot) return;
  if (reaction.message.id === globalConfig.welcome_message_id) {
    React.parse(reaction, user, "+");
  }
});

client.on("messageReactionRemove", async (reaction, user) => {
  if (user.bot) return;
  if (reaction.message.id === globalConfig.welcome_message_id) {
    React.parse(reaction, user, "-");
  }
});

function randomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function timeCycle() {
  let Parser = require("rss-parser");
  let parser = new Parser();
  (async () => {
    let feed = await parser.parseURL(
      "https://dev.to/feed/?tags[]=github&tags[]=bash&tags[]=django&tags[]=npm&tags[]=java&tags[]=graphql&tags[]=flutter&tags[]=javascript&tags[]=opensource&tags[]=testing&tags[]=android&tags[]=go&tags[]=ruby&tags[]=sql&tags[]=webdev&tags[]=webassembly&tags[]=blockchain&tags[]=csharp&tags[]=linux&tags[]=security&tags[]=react&tags[]=react&tags[]=swift&tags[]=python&tags[]=computerscience&tags[]=git&tags[]=vue&tags[]=laravel&tags[]=cpp&tags[]=css&tags[]=dotnet&tags[]=ios&tags[]=php&tags[]=docker&tags[]=kotlin&tags[]=vscode&tags[]=devops&tags[]=kubernetes&tags[]=typescript&tags[]=ubuntu&tags[]=machinelearning&tags[]=productivity&tags[]=aws&tags[]=rails"
    );
    var rand = randomInt(1, 6);
    const channel = await client.channels.fetch(globalConfig.tech_channel_id);
    if (feed.items[rand].title && feed.items[rand].link) {
      channel
        .send(
          ":newspaper: | **" +
            feed.items[rand].title +
            "**\n\n" +
            feed.items[rand].link
        )
        .then(function (message) {
          message.react("👍");
          message.react("👎");
        });
    } else {
      console.log("empty");
    }
  })();
}

var passport = require("passport");
var userProfile;
var guildId;
var disCode;
var tokenType;
var accessToken;

app.set("view engine", "ejs");

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "AKASECRET",
  })
);

app.get("/", function (req, res) {
  guildId = "862252513780826112";
  disCode = req.query.code;
  try {
    const options = new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      code: disCode,
      grant_type: "authorization_code",
      redirect_uri: "https://akabot-js.herokuapp.com",
      scope: "identify",
    });
    axios
      .post("https://discord.com/api/oauth2/token", options)
      .then((response) => {
        tokenType = response.data.token_type;
        accessToken = response.data.access_token;
      });
  } catch (error) {
    console.log(error);
  }
  res.render("pages/auth");
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("App listening on port " + port));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static("public"));

app.get("/success", (req, res) => {
  res.render("pages/success", { user: userProfile });
});
app.get("/error", (req, res) => res.send("error logging in"));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://akabot-js.herokuapp.com/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      userProfile = profile;
      return done(null, userProfile);
    }
  )
);

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/error" }),
  function (req, res) {
    res.redirect("/success");
    axios
      .get("https://discord.com/api/users/@me", {
        headers: {
          authorization: `${tokenType} ${accessToken}`,
        },
      })
      .then(function (response) {
        client.guilds.fetch(guildId).then(function (guild) {
          guild.members.fetch(response.data.id).then(function (member) {
            member.setNickname(userProfile.displayName);
            member.roles.add(globalConfig.verified_group_id);
          });
        });
      });
  }
);

client.login(process.env.DISCORD_TOKEN);
