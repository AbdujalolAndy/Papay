const path = require("path");
const multer = require("multer");
const uuid = require("uuid");

const getTargetImageStorage = (address) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `./uploads/${address}`);
    },
    filename: (req, file, cb) => {
      console.log(file);
      const extention = path.parse(file.originalname).ext;
      const randomName = uuid.v4() + extention;
      cb(null, randomName);
    },
  });
};

const makeUpPloader = (address) => {
  const storage = getTargetImageStorage(address);
  return multer({ storage });
};

module.exports = makeUpPloader;
