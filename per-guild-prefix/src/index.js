const { Client } = require("gencord");
const mongoose = require("mongoose");
const chalk = require("chalk");
const { token, mongo } = require("../config.json");
const Prefix = require("./Prefix");

const client = new Client({
  token: token,
  intents: 513,
  status: "dnd",
});

const getPrefix = async (guildID) => {
  const res = await Prefix.findOne({ guildID: guildID });
  if (res) {
    return res.prefix;
  } else {
    return "!";
  }
};

client.on("READY", () => {
  console.log(chalk.red("Ready!"));
  mongoose
    .connect(mongo, { useUnifiedTopology: true, useNewUrlParser: true })
    .then((_) => console.log(chalk.greenBright("Connected to MongoDB")));
});

client.on("message", async (message) => {
  const prefix = await getPrefix(message.guild_id);
  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  if (!message.content.startsWith(prefix)) return;

  if (command === "ping") {
    message.channel.send(`Pong! ${client.ping()}ms`);
  }

  if (command === "setprefix") {
    const prefix = args[0];
    if (!args[0]) return message.channel.send("No prefix provided!");
    const result = await Prefix.findOne({
      guildID: message.guild_id,
    });

    if (result) {
      result.prefix = prefix;
      result.save();

      message.channel.send(`The prefix is now ${prefix}`);
    } else if (!result) {
      const data = new Prefix({
        guildID: message.guild_id,
        prefix: prefix,
      });
      data.save();

      message.channel.send(`The prefix is now ${prefix}`);
    }
  }
});
