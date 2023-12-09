const { Schema, model } = require("mongoose");
const {
  board_id_enum_list,
  board_article_status_enum_list,
} = require("../lib/config");

const boArticleSchema = new Schema(
  {
    art_subject: { type: String, required: true },
    art_content: { type: String, required: true },
    art_image: { type: String },
    bo_id: {
      type: String,
      required: true,
      emum: {
        values: board_id_enum_list,
        message: "{Value} is not among permitted values",
      },
    },
    art_status: {
      type: String,
      default: "active",
      enum: {
        values: board_article_status_enum_list,
        message: "{Value} is not among permitted values",
      },
    },
    art_likes: { type: Number, default: 0 },
    art_views: { type: Number, default: 0 },
    mb_id: { type: Schema.Types.ObjectId, ref: "Member", required: true },
  },
  { timestamps: true }
);

module.exports = model("BoArticle", boArticleSchema);
