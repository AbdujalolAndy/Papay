const { shapeIntoMonngooseObjectId } = require("../lib/config");
const Definer = require("../lib/mistakes");
const productSchema = require("../schema/product.model");
const assert = require("assert");
const Member = require("./Member");

class Product {
  constructor() {
    this.productModel = productSchema;
  }

  async getAllProductData(member, data) {
    try {
      const auth_mb_id = shapeIntoMonngooseObjectId(member?._id);
      let match = { product_status: "PROCESS" };
      if (data.restaurant_mb_id) {
        match["restaurant_mb_id"] = shapeIntoMonngooseObjectId(
          data.restaurant_mb_id
        );
        match["product_collection"] = data.product_collection;
      }
      const sort =
        data.order === "product_price"
          ? { [data.order]: 1 }
          : { [data.order]: -1 };
      const result = await this.productModel
        .aggregate([
          { $match: match },
          { $sort: sort },
          { $skip: (data.page * 1 - 1) * data.limit },
          { $limit: data.limit * 1 },
        ])
        .exec();

      //todo: check auth member likes

      assert.ok(result, Definer.general_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }
  async getChosenProductData(member, id) {
    try {
      const auth_mb_id = shapeIntoMonngooseObjectId(member?._id),
        product_id = shapeIntoMonngooseObjectId(id);

      if (member) {
        const member = new Member();
        await member.viewChosenItemByMember(auth_mb_id, product_id, "product");
      }

      const match = {
          _id: product_id,
          product_status: "PROCESS",
        },
        result = await this.productModel.aggregate([{ $match: match }]);
      assert.ok(result, Definer.general_err1);
      return result[0];
    } catch (err) {
      throw err;
    }
  }
  async getAllProductsDataResto(member) {
    try {
      member._id = shapeIntoMonngooseObjectId(member._id);
      const result = await this.productModel.find({
        restaurant_mb_id: member._id,
      });
      assert.ok(result, Definer.general_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }
  async addNewProduct(data, member) {
    try {
      data.restaurant_mb_id = shapeIntoMonngooseObjectId(member._id);

      const result = await this.productModel.create(data);

      assert.ok(result, Definer.product_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }
  async updateChosenProductData(id, updated_data, mb_id) {
    try {
      id = shapeIntoMonngooseObjectId(id);
      mb_id = shapeIntoMonngooseObjectId(mb_id);
      const result = await this.productModel
        .findOneAndUpdate({ _id: id, restaurant_mb_id: mb_id }, updated_data, {
          runValidators: true,
          lean: true,
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

module.exports = Product;
