const router_bssr = require("express").Router();
const restaurantController = require("./controllers/restaurantController");

/*************************
 *         BSSR EJS      *
 *************************/
//Member Controller
router_bssr.get("/signup", restaurantController.getSignupMyRestaurant);
router_bssr.post("/signup", restaurantController.signupProcess);

router_bssr.get("/login", restaurantController.getLoginMyRestaurant);
router_bssr.post("/login", restaurantController.loginProcess);

router_bssr.get("/logout", restaurantController.logout);


module.exports = router_bssr;
