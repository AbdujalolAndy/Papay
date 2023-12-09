const communityController = module.exports;
const assert = require("assert");
const { HttpStatus } = require("../lib/config");
const Definer = require("../lib/mistakes");
const Community = require("../models/Community");

communityController.imageInsertion = async (req, res) => {
  try {
    console.log("POST: CONT/imageInsertion");
    const image_path = req.file.path;
    res.status(HttpStatus.OK).json({ state: "success", data: image_path });
  } catch (err) {
    console.log("ERROR: cont/imageInsertion");
    res
      .status(HttpStatus.BAD_REQUEST)
      .json({ state: "fail", message: err.message });
  }
};

communityController.createArticle = async (req, res) => {
  try {
    console.log("POST: cont/createArticle");

    const community = new Community();
    const result = await community.createArticleData(req.member, req.body);
    assert.ok(result, Definer.general_err1);

    res.json({ state: "success", data: result });
  } catch (err) {
    console.log("ERROR: cont/createArticle", err.message);
    res.json({ state: "fail", message: err.message });
  }
};
