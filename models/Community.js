const assert = require("assert");
const { shapeIntoMonngooseObjectId } = require("../lib/config");
const Definer = require("../lib/mistakes");
const Bo_ArticleModel = require("../schema/bo_article.model");

class Community {
  constructor() {
    this.bo_articleModel = Bo_ArticleModel;
  }

  async createArticleData(member, data) {
    try {
      data.mb_id = shapeIntoMonngooseObjectId(member._id);

      const new_article = await this.saveArticle(data);
      return new_article;
    } catch (err) {
      throw err;
    }
  }

  async saveArticle(data) {
    try {
      const article = new this.bo_articleModel(data);
      return await article.save();
    } catch (MongoDBerr) {
      console.log(MongoDBerr.message);
      throw new Error(Definer.auth_err1);
    }
  }

  async getMemberArticlesData(member, mb_id, inquery) {
    try {
      const auth_mb_id = shapeIntoMonngooseObjectId(member?._id);
      mb_id = shapeIntoMonngooseObjectId(mb_id);
      const page = inquery.page ? inquery.page * 1 : 1;
      const limit = inquery.limit ? inquery.limit * 1 : 5;

      const result = await this.bo_articleModel.aggregate([
        { $match: { mb_id: mb_id, art_status: "active" } },
        { $sort: { createdAt: -1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
        {
          $lookup: {
            from: "members",
            localField: "mb_id",
            foreignField: "_id",
            as: "member_data",
          },
        },
        { $unwind: "$member_data" },
      ]);
      assert.ok(result, Definer.article_err2);

      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Community;