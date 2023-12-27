const productController = module.exports;
const assert = require("assert");
const Definer = require("../lib/mistakes");
const Product = require("../models/Product");
const { HttpStatus } = require("../lib/config");

/**************************************
 *        REACT RELATED METHODS        *
 **************************************/

productController.getAllProducts = async (req, res) => {
  try {
    console.log("POST: cont/getAllProducts");
    const product = new Product();
    const result = await product.getAllProductData(req.member, req.body);
    res.json({ state: "success", data: result });
  } catch (err) {
    console.log("ERROR: cont/getAllProducts");
    res.json({ state: "fail", message: err.message });
  }
};

productController.getChosenProduct = async (req, res) => {
  try {
    console.log("GET: cont/getChosenProduct");
    const product_id = req.params.id,
      product = new Product(),
      result = await product.getChosenProductData(req.member, product_id);
    res.json({ state: "success", data: result });
  } catch (err) {
    console.log("ERROR: cont/getChosenProduct");
    res.json({ state: "fail", message: err.message });
  }
};

/**************************************
 *        BSSR RELATED METHODS        *
 **************************************/

productController.addNewProduct = async (req, res) => {
  try {
    console.log("POST: cont/addNewProduct");
    assert.ok(req.files, Definer.general_err3);

    const product = new Product();
    let data = req.body;

    data.product_images = req.files.map((ele) => {
      return ele.path.replace(/\\/g, "/");
    });

    const result = await product.addNewProduct(data, req.member);
    const html = `<script>
                  alert("New product added successfully");
                  window.location.replace("/resto/products/menu");
                  </script>`;
    res.end(html);
  } catch (err) {
    console.log("ERROR, cont/addNewProduct, ", err.message);
    const html = `<script>
                    alert("There is a product with this name and size");
                    window.location.replace("/resto/products/menu");
                  </script>`;
    res.end(html);
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
    res.json({ state: "fail", message: err.message });
  }
};
