const ViewModel = require("../schema/view.model");
const MemberModel = require("../schema/member.control");
const ProductModel = require("../schema/product.model");

class View {
  constructor(mb_id) {
    this.ViewModel = ViewModel;
    this.memberModel = MemberModel;
    this.productModel = ProductModel;
    this.mb_id = mb_id;
  }

  async validateChosenTarget(id, group_type) {
    try {
      let result;
      switch (group_type) {
        case "member":
          result = await this.memberModel
            .findOne({ mb_id: this.mb_id, mb_status: "ACTIVE" })
            .exec();
          break;
        case "product":
          result = await this.productModel
            .findOne({ product_id: id, product_status: "PROCESS" })
            .exec();
          break;
      }

      return !!result;
    } catch (err) {
      throw err;
    }
  }

  async insertMemberView(view_ref_id, group_type) {
    try {
      const new_view = this.ViewModel({
        mb_id: this.mb_id,
        view_ref_id: view_ref_id,
        view_group: group_type,
      });
      const result = await new_view.save();

      //Incerease target view by 1
      await this.modifyItemViewCounts(view_ref_id, group_type);
      return result;
    } catch (err) {
      throw err;
    }
  }
  async modifyItemViewCounts(view_ref_id, group_type) {
    try {
      switch (group_type) {
        case "member":
          await this.memberModel
            .findByIdAndUpdate({ _id: view_ref_id }, { $inc: { mb_views: 1 } })
            .exec();
          break;
        case "product":
          await this.productModel
            .findByIdAndUpdate(
              { _id: view_ref_id },
              { $inc: { product_views: 1 } }
            )
            .exec();
          break;
      }
      return true;
    } catch (err) {
      throw err;
    }
  }
  async checkViewExistence(view_ref_id) {
    try {
      const view = await this.ViewModel.findOne({
        mb_id: this.mb_id,
        view_ref_id: view_ref_id,
      }).exec();
      return !!view;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = View;
