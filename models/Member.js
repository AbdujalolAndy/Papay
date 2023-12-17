const {
  shapeIntoMonngooseObjectId,
  lookup_auth_member_follow,
  lookup_auth_member_liked,
} = require("../lib/config");
const Definer = require("../lib/mistakes");
const MemberSchema = require("../schema/member.control");
const assert = require("assert");
const bcrypt = require("bcryptjs");
const View = require("../models/View");
const Like = require("./Like");

class Member {
  constructor() {
    this.memberModel = MemberSchema;
  }

  async signupData(input) {
    try {
      const salt = await bcrypt.genSalt();
      input.mb_password = await bcrypt.hash(input.mb_password, salt);
      const new_member = new this.memberModel(input);
      let result;
      try {
        result = await new_member.save();
      } catch (err) {
        console.log(err.message);
        throw new Error(Definer.db_validation_err1);
      }
      result.mb_password = "";
      return result;
    } catch (err) {
      throw err;
    }
  }

  async loginData(input) {
    try {
      const member = await this.memberModel.findOne(
        { mb_nick: input.mb_nick },
        { mb_nick: 1, mb_password: 1 }
      );
      assert.ok(member, Definer.auth_err3);

      const isMatch = await bcrypt.compare(
        input.mb_password,
        member.mb_password
      ); // Corrected the arguments
      assert.ok(isMatch, Definer.auth_err4);
      return await this.memberModel.findOne({ mb_nick: input.mb_nick });
    } catch (err) {
      throw err;
    }
  }

  async getchosenMemberData(member, member_id) {
    try {
      const auth_mb_id = shapeIntoMonngooseObjectId(member?._id),
        id = shapeIntoMonngooseObjectId(member_id),
        aggregationQue = [
          { $match: { _id: id, mb_status: "ACTIVE" } },
          { $unset: "mb_password" },
        ];

      if (member) {
        await this.viewChosenItemByMember(member, id, "member");
        aggregationQue.push(lookup_auth_member_liked(auth_mb_id));
        aggregationQue.push(lookup_auth_member_follow(auth_mb_id, "members"));
      }

      const result = await this.memberModel.aggregate(aggregationQue).exec();
      assert.ok(result, Definer.general_err2);
      return result[0];
    } catch (err) {
      throw err;
    }
  }

  async viewChosenItemByMember(member, view_ref_id, group_type) {
    try {
      view_ref_id = shapeIntoMonngooseObjectId(view_ref_id);
      const mb_id = shapeIntoMonngooseObjectId(member?._id);
      //todo: iTem does it exist
      const view = new View(mb_id),
        isMatch = await view.validateChosenTarget(view_ref_id, group_type);
      assert.ok(isMatch, Definer.general_err2);
      //todo: before viewed
      const doesExist = await view.checkViewExistence(view_ref_id);
      console.log("doesExist", doesExist);

      if (!doesExist) {
        const result = await view.insertMemberView(view_ref_id, group_type);
        assert.ok(result, Definer.general_err1);
      }
      return true;
    } catch (err) {
      throw err;
    }
  }
  async likeChosenMemberData(member, data) {
    try {
      const mb_id = shapeIntoMonngooseObjectId(member._id),
        like_ref_id = shapeIntoMonngooseObjectId(data.mb_id),
        group_type = data.group_type,
        like = new Like(mb_id),
        isvalid = await like.validateTargetItem(like_ref_id, group_type);
      assert.ok(isvalid, Definer.general_err2);
      const doesExist = await like.likeChosenItemExistance(
        like_ref_id,
        group_type
      );
      console.log("doesExist::", doesExist);
      data = doesExist
        ? await like.removeChosenItemLike(like_ref_id, group_type)
        : await like.insertChosenItemLike(like_ref_id, group_type);
      const result = {
        mb_id: mb_id,
        like_ref_id: data.like_ref_id,
        like_status: doesExist ? 0 : 1,
      };
      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Member;
