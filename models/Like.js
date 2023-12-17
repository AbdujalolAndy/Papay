const ViewModel = require("../schema/view.model");
const MemberModel = require("../schema/member.control");
const ProductModel = require("../schema/product.model");
const BoArticleModel = require("../schema/bo_article.model");
const LikeModel = require("../schema/like.model");
const Definer = require("../lib/mistakes");

class Like {
  constructor(mb_id) {
    this.ViewModel = ViewModel;
    this.memberModel = MemberModel;
    this.productModel = ProductModel;
    this.boArticleModel = BoArticleModel;
    this.likeModel = LikeModel;
    this.mb_id = mb_id;
  }

  async validateTargetItem(like_ref_id, group_type) {
    try {
      let result;
      switch (group_type) {
        case "member":
          result = await this.memberModel
            .findOne({ _id: like_ref_id, mb_status: "ACTIVE" })
            .exec();
          break;
        case "product":
          result = await this.productModel
            .findOne({ _id: like_ref_id, product_status: "PROCESS" })
            .exec();
          break;
        case "community":
          result = await this.boArticleModel
            .findOne({
              _id: like_ref_id,
              art_status: "active",
            })
            .exec();
          break;
        default:
          break;
      }
      return !!result;
    } catch (err) {
      throw err;
    }
  }

  async likeChosenItemExistance(like_ref_id, group_type) {
    try {
      const result = await this.likeModel
        .findOne({
          mb_id: this.mb_id,
          like_ref_id: like_ref_id,
          like_group: group_type,
        })
        .exec();
      return !!result;
    } catch (err) {
      throw err;
    }
  }

  async insertChosenItemLike(like_ref_id, group_type) {
    try {
      let like = new this.likeModel({
        mb_id: this.mb_id,
        like_ref_id: like_ref_id,
        like_group: group_type,
      });
      const result = await like.save();
      await this.modifyLikeCount(like_ref_id, group_type, 1);
      return result;
    } catch (err) {
      throw new Error(Definer.db_validation_err1);
    }
  }

  async removeChosenItemLike(like_ref_id, group_type) {
    try {
      const result = await this.likeModel
        .findOneAndDelete({
          mb_id: this.mb_id,
          like_ref_id: like_ref_id,
          group_type: group_type,
        })
        .exec();
      await this.modifyLikeCount(like_ref_id, group_type, -1);
      return result;
    } catch (err) {
      throw err;
    }
  }
  async modifyLikeCount(like_ref_id, group_type, modifier) {
    try {
      switch (group_type) {
        case "member":
          await this.memberModel
            .findByIdAndUpdate(
              { _id: like_ref_id },
              { $inc: { mb_likes: modifier } }
            )
            .exec();
          break;
        case "product":
          await this.productModel
            .findByIdAndUpdate(
              { _id: like_ref_id },
              { $inc: { product_likes: modifier } }
            )
            .exec();
          break;
        case "community":
          await this.boArticleModel
            .findByIdAndUpdate(
              { _id: like_ref_id },
              { $inc: { art_likes: modifier } }
            )
            .exec();
          break;
        default:
          break;
      }
      return true;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Like;
