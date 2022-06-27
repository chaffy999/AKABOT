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
const axios = require("axios");
const express = require("express");
const app = express();
const session = require("express-session");
var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

require("dotenv").config();
const globalConfig = require("./src/config/global.json");

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
  if(disCode){
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
    if(guildId){
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
  }
);

client.login(process.env.DISCORD_TOKEN);
