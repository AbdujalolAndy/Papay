const { shapeIntoMonngooseObjectId } = require("../lib/config");
const Definer = require("../lib/mistakes");
const assert = require("assert");
const FollowModel = require("../schema/follow.model");
const MemberModel = require("../schema/member.control");

class Follow {
  constructor() {
    this.followModel = FollowModel;
    this.memberModel = MemberModel;
  }

  async subscribeData(member, data) {
    try {
      assert.ok(member._id !== data.mb_id, Definer.follow_err1);

      const follow_id = shapeIntoMonngooseObjectId(data.mb_id);
      const subscriber_id = shapeIntoMonngooseObjectId(member._id);

      const member_data = this.memberModel.findById({ _id: follow_id }).exec();
      assert.ok(member_data, Definer.general_err2);

      const result = await this.createSubcriptionData(follow_id, subscriber_id);
      assert.ok(result, Definer.general_err2);

      await this.modifyMemberFollowCounts(follow_id, "subscriber_change", 1);
      await this.modifyMemberFollowCounts(subscriber_id, "follow_change", 1);

      return true;
    } catch (err) {
      throw err;
    }
  }

  async unsubscribeData(member, data) {
    try {
      const subscriber_id = shapeIntoMonngooseObjectId(member._id);
      const follow_id = shapeIntoMonngooseObjectId(data.mb_id);

      const result = await this.followModel.findOneAndDelete({
        follow_id: follow_id,
        subscriber_id: subscriber_id,
      });

      assert.ok(result, Definer.general_err1);

      this.modifyMemberFollowCounts(follow_id, "subscriber_change", -1);
      this.modifyMemberFollowCounts(subscriber_id, "follow_change", -1);
      return true;
    } catch (err) {
      throw err;
    }
  }

  async createSubcriptionData(follow_id, subscriber_id) {
    try {
      const new_follow = new this.followModel({
        follow_id: follow_id,
        subscriber_id: subscriber_id,
      });
      return await new_follow.save();
    } catch (MongoDbErr) {
      console.log("MongoDB Error::", MongoDbErr.message);
      throw new Error(Definer.follow_err2);
    }
  }

  async modifyMemberFollowCounts(mb_id, type, modifier) {
    try {
      if (type === "follow_change") {
        await this.memberModel
          .findByIdAndUpdate(
            { _id: mb_id },
            { $inc: { mb_follow_cnt: modifier } }
          )
          .exec();
      } else if (type === "subscriber_change") {
        await this.memberModel
          .findByIdAndUpdate(
            { _id: mb_id },
            { $inc: { mb_subscriber_cnt: modifier } }
          )
          .exec();
      }
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Follow;
