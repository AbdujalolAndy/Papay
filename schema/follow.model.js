const { Schema, model } = require("mongoose");

const followSchema = new Schema({
  follow_id: { type: Schema.Types.ObjectId, required: true },
  subscriber_id: { type: Schema.Types.ObjectId, required: true },
});

followSchema.index({ follow_id: 1, subscriber_id: 1 }, { unique: true });

module.exports = model("Follow", followSchema);
