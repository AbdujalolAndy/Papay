const { Schema, model } = require("mongoose");
const {
  product_status_enums,
  product_collection_enums,
  product_size_enums,
  product_volume_enums,
} = require("../lib/config");

const productSchema = new Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    product_collection: {
      type: String,
      required: true,
      enum: {
        values: product_collection_enums,
        message: "{VALUE} is not among permitted enum values",
      },
    },
    product_status: {
      type: String,
      required: true,
      default: "PAUSED",
      enum: {
        values: product_status_enums,
        message: "{VALUE} is not among permitted enum values",
      },
    },
    product_price: {
      type: Number,
      required: true,
    },
    product_discount: {
      type: Number,
      required: true,
    },
    product_left_cnt: {
      type: Number,
      required: true,
    },
    product_size: {
      type: String,
      default: "normal",
      required: function () {
        const sized_list = ["dish", "salad", "dessert"];
        return sized_list.includes(this.product_collection);
      },
      enum: {
        values: product_size_enums,
        message: "{VALUE} is not among permitted enum values",
      },
    },
    product_volume: {
      type: String,
      default: 1,
      required: function () {
        return this.product_collection === "drink";
      },
      enum: {
        values: product_volume_enums,
        message: "{VALUE} is not among permitted enum values",
      },
    },
    product_description: {
      type: String,
      required: true,
    },
    product_images: {
      type: Array,
      required: true,
      default: [],
    },
    product_likes: {
      type: Number,
      default: 0,
    },
    product_views: {
      type: Number,
      default: 0,
    },
    restaurant_mb_id: {
      type: Schema.Types.ObjectId,
      ref: "Member",
    },
  },
  { timestamps: true }
); //createAt updateAt

productSchema.index(
  { restaurant_mb_id: 1, product_name: 1, product_size: 1, product_volume: 1 },
  { unique: true }
);

module.exports = model("Product", productSchema);
