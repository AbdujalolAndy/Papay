const { Schema, mongoose } = require("mongoose");
const { order_enums } = require("../lib/config");

const orderItemSchema = new Schema(
  {
    product_quantity: { type: Number, required: true },
    product_price: { type: Number, required: true },
    order_id: { type: Schema.Types.ObjectId, ref: "Product" },
    product_id: { type: Schema.Types.ObjectId, ref: "Product" },
  },
  { timestamps: true }
);
