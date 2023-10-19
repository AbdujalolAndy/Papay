const productController = module.exports;

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

productController.addNewProduct = async (req, res, next) => {
  try {
    console.log("POST: cont/addNewProduct");
    console.log(req.member);
    //TODO Product creation develop;
    res.send("ok");
  } catch (err) {
    console.log("ERROR, cont/addNewProduct, ", err.message);
  }
};

productController.updateChosenProduct = async (req, res) => {
  try {
    console.log("POST: cont/updateChosenProduct");
  } catch (err) {
    console.log("Error: cont/updateChosenProduct, ", err.message);
  }
};
