const router_bssr = require("express").Router();
const restaurantController = require("./controllers/restaurantController");
const productController = require("./controllers/productController");
const upload_products = require("./utils/upload-multer")("products");
/*************************
 *         BSSR EJS      *
 *************************/
//Restaurant Controller
router_bssr.get("/", restaurantController.home);

router_bssr
  .get("/sign-up", restaurantController.getSignupMyRestaurant)
  .post("/sign-up", restaurantController.signupProcess);

router_bssr
  .get("/login", restaurantController.getLoginMyRestaurant)
  .post("/login", restaurantController.loginProcess);

router_bssr.get("/check-me", restaurantController.checkSessions);
router_bssr.get("/logout", restaurantController.logout);
router_bssr.get("/products/menu", restaurantController.validateAuthRestaurant, restaurantController.getMyRestaurantProducts);
router_bssr.post(
  "/products/create",
  restaurantController.validateAuthRestaurant,
  upload_products.array("product_images", 5),
  productController.addNewProduct
);

router_bssr.post(
  "/products/edit/:id",
  restaurantController.validateAuthRestaurant,
  productController.updateChosenProduct
);

module.exports = router_bssr;
