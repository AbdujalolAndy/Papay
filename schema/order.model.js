const { Schema, mongoose } = require("mongoose");
const { order_enums } = require("../lib/config");

const orderSchema = new Schema(
  {
    order_total_amout: {
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
      required: "false",
    },
  },
  { timestamps: true }
);

exports.module = mongoose.model("Order", orderSchema);
