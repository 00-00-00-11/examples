const { model, Schema } = require("mongoose");
const prefixSchema = new Schema({
  guildID: { required: true, type: String },
  prefix: { required: true, type: String },
});

module.exports = model("Prefix", prefixSchema);
