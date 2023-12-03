const { shapeIntoMonngooseObjectId } = require("../lib/config");
const Definer = require("../lib/mistakes");
const MemberSchema = require("../schema/member.control");
const assert = require("assert");
const bcrypt = require("bcryptjs");
const View = require("../models/View");

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
        throw new Error(Definer.auth_err1);
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
      const id = shapeIntoMonngooseObjectId(member_id);

      if (member) {
        await this.viewChosenItemByMember(member, id, "member");
      }

      const result = await this.memberModel
        .aggregate([
          { $match: { _id: id, mb_status: "ACTIVE" } },
          { $unset: "mb_password" },
        ])
        .exec();

      //todo: Check auth member liked the chosen member
      assert.ok(result, Definer.general_err2);
      console.log(result);
      return result[0];
    } catch (err) {
      throw err;
    }
  }

  async viewChosenItemByMember(member, view_ref_id, group_type) {
    try {
      view_ref_id = shapeIntoMonngooseObjectId(view_ref_id);
      const mb_id = shapeIntoMonngooseObjectId(member?._id);
      console.log(member);
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
}

module.exports = Member;
