const Definer = require("../lib/mistakes");
const MemberSchema = require("../schema/member.control");

class Member {
  constructor() {
    this.memberSchema = MemberSchema;
  }

  async signupData(input) {
    try {
      const new_member = new this.memberSchema(input);

      try {
        var result = await new_member.save();
      } catch (err) {
        console.log(err.message);
        throw new Error(Definer.auth_err1);
      }

      console.log(result);
      const lengthPassword = result.mb_password.length;
      let secret_password = "";
      for (let i = 0; i < lengthPassword; i++) {
        secret_password += "*";
      }
      result.mb_password = secret_password;
      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Member;
