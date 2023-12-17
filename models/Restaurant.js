const {
  shapeIntoMonngooseObjectId,
  HttpStatus,
  lookup_auth_member_liked,
} = require("../lib/config");
const Definer = require("../lib/mistakes");
const memberControl = require("../schema/member.control");
const MemberSchema = require("../schema/member.control");
const assert = require("assert");
const Member = require("./Member");

class Restaurant {
  constructor() {
    this.memberModel = MemberSchema;
  }
  async getRestaurantsData(member, data) {
    try {
      const auth_mb_id = shapeIntoMonngooseObjectId(member?._id);
      let match = { mb_type: "RESTAURANT", mb_status: "ACTIVE" };
      let aggregationQuery = [];
      data.limit = data["limit"] * 1;
      data.page = data["page"] * 1;

      switch (data.order) {
        case "top":
          match["mb_top"] = "Y";
          aggregationQuery.push({ $match: match });
          aggregationQuery.push({ $sample: { size: data.limit } });
          break;
        case "random":
          aggregationQuery.push({ $match: match });
          aggregationQuery.push({ $sample: { size: data.limit } });
          break;
        default:
          aggregationQuery.push({ $match: match });
          const sort = { [data.order]: -1 };
          aggregationQuery.push({ $sort: sort });
          break;
      }
      aggregationQuery.push({ $skip: (data.page - 1) * data.limit });
      aggregationQuery.push({ $limit: data.limit });
      aggregationQuery.push(lookup_auth_member_liked(auth_mb_id));
      const result = await this.memberModel.aggregate(aggregationQuery).exec();
      assert.ok(result, Definer.general_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getChosenRestaurantData(member, id) {
    try {
      const restaurant_id = shapeIntoMonngooseObjectId(id);
      if (member) {
        const restaurant = new Member();
        await restaurant.viewChosenItemByMember(
          member,
          restaurant_id,
          "member"
        );
      }
      const result = await this.memberModel.findOne({
        _id: restaurant_id,
        mb_status: "ACTIVE",
      });
      assert.ok(result, Definer.general_err1);
      return result;
    } catch (err) {
      throw err;
    }
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
