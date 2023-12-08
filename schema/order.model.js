const { Schema, model } = require("mongoose");
const { order_enums } = require("../lib/config");

const orderSchema = new Schema(
  {
    order_total_amount: {
      type: Number,
      required: true,
    },
    order_delivery_cost: {
      type: Number,
      required: true,
    },
    order_status: {
      type: String,
      default: "PAUSED",
      enum: {
        values: order_enums,
        message: "{VALUE} is not among permitted enum values",
      },
    },
    mb_id: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      required: false, // "false" should be false
    },
  },
  { timestamps: true }
);

module.exports = model("Order", orderSchema);

