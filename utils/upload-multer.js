const path = require("path");
const multer = require("multer");
const uuid = require("uuid");

const product_storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/products");
  },
  filename: (req, file, cb) => {
    console.log(file);
    const extention = path.parse(file.originalname).ext;
    const randomName = uuid.v4() + extention;
    cb(null, randomName);
  },
});

module.exports.uploadProductImage = multer({ storage: product_storage });
