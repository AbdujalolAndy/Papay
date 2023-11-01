const productController = module.exports;
const assert = require("assert");
const Definer = require("../lib/mistakes");
const Product = require("../models/Product");

productController.getAllProducts = async (req, res) => {
  try {
    console.log("POST: cont/getAllProducts");
    console.log(req.member);
    res.end();
  } catch (err) {
    console.log("ERROR: cont/getAllProducts, ", err.message);
    res.json({
      state: "fail",
      message: err.message,
    });
  }
};

productController.addNewProduct = async (req, res) => {
  try {
    console.log("POST: cont/addNewProduct");
    assert.ok(req.files, Definer.general_err3);

    const product = new Product();
    let data = req.body;

    data.product_images = req.files.map((ele) => {
      return ele.path;
    });

    const result = await product.addNewProduct(data, req.member);
    const html = `<script>
                  alert("new product added successfully");
                  window.location.replace('/resto/projects/menu');
                  </script>`;
    res.end(html);
  } catch (err) {
    console.log("ERROR, cont/addNewProduct, ", err.message);
  }
};

productController.updateChosenProduct = async (req, res) => {
  try {
    console.log("POST: cont/updateChosenProduct");
    const product = new Product();
    const id = req.params.id;
    const result = await product.updateChosenProductData(
      id,
      req.body,
      req.member._id
    );
    
    await res.json({ state: "success", data: result });
  } catch (err) {
    console.log("Error: cont/updateChosenProduct, ", err.message);
    res.json({ state: "fail", message: err.message})
  }
};
