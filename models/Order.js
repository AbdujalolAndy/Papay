const assert = require("assert");
const { shapeIntoMonngooseObjectId } = require("../lib/config");
const Definer = require("../lib/mistakes");
const OrderModel = require("../schema/order.model");
const OrderItemModel = require("../schema/order_item.model");

class Order {
  constructor() {
    this.orderModel = OrderModel;
    this.orderItemModel = OrderItemModel;
  }

  async createOrderData(member, data) {
    try {
      let order_total_amount = 0,
        delivery_cost = 0;
      const mb_id = shapeIntoMonngooseObjectId(member?._id);

      data.map((item) => {
        order_total_amount += item.quantity * item.price;
      });

      if (order_total_amount < 100) {
        delivery_cost = 2;
        order_total_amount += delivery_cost;
      }

      const order_id = await this.saveOrderData(
        order_total_amount,
        delivery_cost,
        mb_id
      );
      console.log("order_id::", order_id);

      await this.recordOrderItemsData(order_id, data);

      return order_id;
    } catch (err) {
      throw err;
    }
  }

  async saveOrderData(order_total_amount, delivery_cost, mb_id) {
    try {
      const new_order = new this.orderModel({
        order_total_amount: order_total_amount,
        order_delivery_cost: delivery_cost,
        mb_id: mb_id,
      });

      const result = await new_order.save();
      assert.ok(result, Definer.order_err1);

      return result._id;
    } catch (err) {
      console.log(err.messages);
      throw new Error(Definer.order_err1);
    }
  }

  async recordOrderItemsData(order_id, data) {
    try {
      const pro_list = data.map(async (item) => {
        return await this.saveOrderItemsData(item, order_id);
      });
      const results = await Promise.all(pro_list);
      console.log(results);
      return true;
    } catch (err) {
      throw err;
    }
  }

  async saveOrderItemsData(item, order_id) {
    try {
      order_id = shapeIntoMonngooseObjectId(order_id);
      item._id = shapeIntoMonngooseObjectId(item._id);
      const order_item = await this.orderItemModel({
        item_quantity: item.quantity,
        item_price: item.price,
        order_id: order_id,
        product_id: item._id,
      });

      const result = await order_item.save();

      assert.ok(result, Definer.order_err2);
      return "insert";
    } catch (err) {
      console.log(err);
      throw new Error(Definer.order_err2);
    }
  }
}

module.exports = Order;
