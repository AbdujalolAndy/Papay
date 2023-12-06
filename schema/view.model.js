const { Schema, model } = require("mongoose");
const { like_view_group_list, board_id_enum_list } = require("../lib/config");

const viewSchema = new Schema(
  {
    mb_id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    view_ref_id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    view_group: {
      type: String,
      required: true,
      enum: {
        values: like_view_group_list,
        message: "{VALUE} is not among permitted enum values",
      },
    },
    bo_id: {
      type: String,
      enum: {
        values: board_id_enum_list,
      },
    },
  },
  { timestamps: { createdAt: true } }
);

module.exports = model("View", viewSchema);
