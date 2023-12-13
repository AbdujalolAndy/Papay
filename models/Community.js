const assert = require("assert");
const {
  shapeIntoMonngooseObjectId,
  board_id_enum_list,
} = require("../lib/config");
const Definer = require("../lib/mistakes");
const Bo_ArticleModel = require("../schema/bo_article.model");
const Member = require("./Member");

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
  async getArticlesData(member, inquery) {
    try {
      const auth_mb_id = shapeIntoMonngooseObjectId(member?._id);
      inquery.limit *= 1;
      inquery.page *= 1;
      const matches =
          inquery.bo_id === "all"
            ? { bo_id: { $in: board_id_enum_list }, art_status: "active" }
            : { bo_id: inquery.bo_id, art_status: "active" },
        sort = inquery.order ? { [`${inquery.order}`]: -1 } : { createdAt: -1 },
        result = await this.bo_articleModel.aggregate([
          { $match: matches },
          { $sort: sort },
          { $skip: (inquery.page - 1) * inquery.limit },
          { $limit: inquery.limit },
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
      assert.ok(result, Definer.article_err3);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getChosenArticleData(member, art_id) {
    try {
      art_id = shapeIntoMonngooseObjectId(art_id);

      if (member) {
        const member_obj = new Member();
        await member_obj.viewChosenItemByMember(member, art_id, "community");
      }

      const result = await this.bo_articleModel
        .findOne({ _id: art_id, art_status: "active" })
        .exec();
      assert.ok(result, Definer.article_err3);
      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Community;
