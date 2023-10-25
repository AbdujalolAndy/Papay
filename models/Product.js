const { shapeIntoMonngooseObjectId } = require("../lib/config");
const Definer = require("../lib/mistakes");
const productSchema = require("../schema/product.model");
const assert = require("assert");

class Product {
  constructor() {
    this.productModel = productSchema;
  }

  async addNewProduct(data, member) {
    try {
      data.restaurant_mb_id = shapeIntoMonngooseObjectId(member._id);
      console.log(data);

      const new_product = new this.productModel(data);
      const result = await new_product.save();
      console.log(result);
      assert.ok(result, Definer.product_err1);
      return result;
    } catch (err) {
      console.log(`ERROR, cont/addNewProduct, ${err.message}`);
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
        return result
    } catch (err) {
      console.log(`ERROR, cont/addNewProduct, ${err.message}`);
      throw err
    }
  }
}

module.exports = Product;
