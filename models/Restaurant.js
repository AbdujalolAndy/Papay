const { shapeIntoMonngooseObjectId } = require("../lib/config");
const Definer = require("../lib/mistakes");
const MemberSchema = require("../schema/member.control");
const assert = require("assert");

class Restaurant {
  constructor() {
    this.memberModel = MemberSchema;
  }

  async getRestaurantData() {
    try {
      const result = await this.memberModel
        .find({ mb_type: "RESTAURANT" })
        .exec();
      assert.ok(result, Definer.general_err1);

      return result;
    } catch (err) {
      throw err;
    }
  }
  async updateRestaurantByAdmin(data) {
    try {
      const id = shapeIntoMonngooseObjectId(data?.id);
      const result = await this.memberModel
        .findOneAndUpdate({ _id: id }, data, {
          lean: true,
          runValidators: true,
          returnDocument: "after",
        })
        .exec();

      assert.ok(result, Definer.general_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Restaurant;
