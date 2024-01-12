const router = require("express").Router();
const memberController = require("./controllers/memberController");
const productController = require("./controllers/productController");
const restaurantsController = require("./controllers/restaurantController");
const orderController = require("./controllers/orderController");
const communityController = require("./controllers/communityController");
const followController = require("./controllers/followController");
const uploader_community = require("./utils/upload-multer")("community");
const uploader_members = require("./utils/upload-multer")("members");
/*************************
 *      Restful API      *
 *************************/

//Member related routers
router
  .post("/signup", memberController.signup)
  .post("/login", memberController.login)
  .post(
    "/member-liken",
    memberController.retrieveMember,
    memberController.likeChosenMember
  )
  .post(
    "/member/update",
    uploader_members.single("mb_image"),
    memberController.retrieveMember,
    memberController.updateMember
  );
router
  .get("/logout", memberController.logout)
  .get("/check-me", memberController.checkAuthentication)
  .get(
    "/member/:id",
    memberController.retrieveMember,
    memberController.getChosenMember
  );

//Product related routers
router.post(
  "/products",
  memberController.retrieveMember,
  productController.getAllProducts
);
router.get(
  "/products/:id",
  memberController.retrieveMember,
  productController.getChosenProduct
);

//Restaurant related routers
router
  .get(
    "/restaurants",
    memberController.retrieveMember,
    restaurantsController.getRestaurants
  )
  .get(
    "/restaurants/:id",
    memberController.retrieveMember,
    restaurantsController.getChosenRestaurant
  );

//Order related routers
router
  .post(
    "/orders/create",
    memberController.retrieveMember,
    orderController.createOrder
  )
  .post(
    "/orders/edit",
    memberController.retrieveMember,
    orderController.editChosenOrder
  );

router.get(
  "/orders",
  memberController.retrieveMember,
  orderController.getMyOrders
);

//Community related routers
router
  .post(
    "/community/image",
    uploader_community.single("community_image"),
    communityController.imageInsertion
  )
  .post(
    "/community/create",
    memberController.retrieveMember,
    communityController.createArticle
  );

router
  .get(
    "/community/articles",
    memberController.retrieveMember,
    communityController.getMemberArticles
  )
  .get(
    "/community/target",
    memberController.retrieveMember,
    communityController.getArticles
  )
  .get(
    "/community/single-article/:art_id",
    memberController.retrieveMember,
    communityController.getChosenArticle
  );

//Follow related routers
router
  .post(
    "/follow/subscribe",
    memberController.retrieveMember,
    followController.subscribe
  )
  .post(
    "/follow/unsubscribe",
    memberController.retrieveMember,
    followController.unsubscribe
  );

router
  .get("/follow/followings", followController.getMemberFollowings)
  .get(
    "/follow/followers",
    memberController.retrieveMember,
    followController.getMembersFollowers
  );

module.exports = router;
