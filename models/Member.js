const { shapeIntoMonngooseObjectId } = require("../lib/config");
const Definer = require("../lib/mistakes");
const MemberSchema = require("../schema/member.control");
const assert = require("assert");
const bcrypt = require("bcryptjs");

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
        //TO DO
      }

      const result = await this.memberModel
        .aggregate([{ $match: { _id: id, mb_status: "ACTIVE" } }])
        .exec();
      assert.ok(result, Definer.general_err2);
      return result[0];
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Member;
