const communityController = module.exports;
const assert = require("assert");
const Definer = require("../lib/mistakes");
const Community = require("../models/Community");

communityController.imageInsertion = async (req, res) => {
  try {
    console.log("POST: CONT/imageInsertion");
    const image_path = req.file.path;
    res.json({ state: "success", data: image_path });
  } catch (err) {
    console.log("ERROR: cont/imageInsertion");
    res.json({ state: "fail", message: err.message });
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

communityController.getMemberArticles = async (req, res) => {
  try {
    console.log("GET: cont/getMemberArticles");
    const mb_id =
      req.query.mb_id !== "none" ? req.query.mb_id : req.member?._id;

    assert.ok(mb_id, Definer.article_err1);

    const community = new Community();
    const result = await community.getMemberArticlesData(
      req.member,
      mb_id,
      req.query
    );
    res.json({ state: "success", data: result });
  } catch (err) {
    console.log("ERROR: cont/getMemberArticles");
    res.json({ state: "fail", message: err.message });
  }
};

communityController.getArticles = async (req, res) => {
  try {
    console.log("GET: cont/getArticles");
    const community = new Community();
    const result = await community.getArticlesData(req.member, req.query);
    res.json({ state: "success", data: result });
  } catch (err) {
    console.log("ERROR: cont/getArticles", err.message);
    res.json({ state: "fail", message: err.message });
  }
};

communityController.getChosenArticle = async (req, res) => {
  try {
    console.log("cont/getChosenArticle");
    const art_id = req.params.art_id,
      community = new Community(),
      result = await community.getChosenArticleData(req.member, art_id);
    res.json({ state: "success", data: result });
  } catch (err) {
    console.log("ERROR: cont/getChosenArticle", err.message);
    res.json({ state: "success", message: err.message });
  }
};
