const { Schema, model } = require("mongoose");

const orderItemSchema = new Schema(
  {
    product_quantity: { type: Number, required: true },
    product_price: { type: Number, required: true },
    order_id: { type: Schema.Types.ObjectId, ref: "Order" },
    product_id: { type: Schema.Types.ObjectId, ref: "Product" },
  },
  { timestamps: true }
);

module.exports = model("OrderItem", orderItemSchema);
