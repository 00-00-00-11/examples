const { Bot } = require("./client/Client");

const client = new Bot({
  token: "my-super-secret-token",
  intents: 513,
  status: "online",
});
