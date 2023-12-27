const assert = require("assert");
const Definer = require("../lib/mistakes");
const Order = require("../models/Order");
const { HttpStatus } = require("../lib/config");
const orderController = module.exports;

orderController.createOrder = async (req, res) => {
  try {
    console.log("POST: cont/createOrder");
    assert.ok(req.member, Definer.auth_err5);

    const order = new Order();
    const result = await order.createOrderData(req.member, req.body);

    res.json({ state: "success", data: result });
  } catch (err) {
    console.log("ERROR: cont/createOrder");
    res.json({ state: "fail", message: err.message });
  }
};

orderController.getMyOrders = async (req, res) => {
  try {
    console.log("GET: cont/getMyOrders");
    assert.ok(req.member, Definer.auth_err5);
    const data = req.query;

    const order = new Order();
    const result = await order.getMyOrdersData(req.member, data);

    res.json({ state: "success", data: result });
  } catch (err) {
    console.log("ERROR: cont/getMyOrders");
    res.json({ state: "fail", message: err.message });
  }
};

orderController.editChosenOrder = async (req, res) => {
  try {
    console.log("POST: cont/editChosenOrder");
    assert.ok(req.member, Definer.order_err5);
    const order = new Order();
    const result = await order.editChosenOrderData(req.member, req.body);
    res.json({ state: "success", data: result });
  } catch (err) {
    console.log("ERROR: cont/editChosenOrder");
    res
      
      .json({ state: "fail", message: err.message });
  }
};
