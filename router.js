const router = require("express").Router();
const memberController = require("./controllers/memberController");
const productController = require("./controllers/productController");
const restaurantsController = require("./controllers/restaurantController");
const orderController = require("./controllers/orderController");

/*************************
 *      Restful API      *
 *************************/

//Member related routers
router
  .post("/signup", memberController.signup)
  .post("/login", memberController.login);
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
router.get(
  "/restaurants",
  memberController.retrieveMember,
  restaurantsController.getRestaurants
);

router.get(
  "/restaurants/:id",
  memberController.retrieveMember,
  restaurantsController.getChosenRestaurant
);

//Order related routers
router.post(
  "/orders/create",
  memberController.retrieveMember,
  orderController.createOrder
);

router.get(
  "/orders",
  memberController.retrieveMember,
  orderController.getMyOrders
);

router.post(
  "/orders/edit",
  memberController.retrieveMember,
  orderController.editChosenOrder
);

//Other Controllers
router.post("/menu", (req, res) => {
  res.send("This is Menu Page");
});

router.get("/community", (req, res) => {
  res.send("This is Community Page");
});

module.exports = router;
