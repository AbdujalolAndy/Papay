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
}

module.exports = Community;
