const { Schema, model } = require("mongoose");
const { like_view_group_list, board_id_enum_list } = require("../lib/config");

const likeSchema = new Schema(
  {
    mb_id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    like_ref_id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    like_group: {
      type: String,
      enum: {
        values: like_view_group_list,
        message: "{VALUE} is not among permitted values",
      },
      required: true,
    },
    bo_id: {
      type: String,
      enum: {
        values: board_id_enum_list,
        message: "{VALUE} is not among permitted values",
      },
    },
  },
  { timestamps: true }
);

module.exports = model("Like", likeSchema);
