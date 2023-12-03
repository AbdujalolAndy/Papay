const router = require("express").Router();
const memberController = require("./controllers/memberController");
const productController = require("./controllers/productController");
/*************************
 *      Restful API      *
 *************************/
//Member Controller
router.post("/signup", memberController.signup);
router.post("/login", memberController.login);
router.get("/logout", memberController.logout);
router.get("/check-me", memberController.checkAuthentication);
router.get(
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

//Other Controllers
router.post("/menu", (req, res) => {
  res.send("This is Menu Page");
});

router.get("/community", (req, res) => {
  res.send("This is Community Page");
});

module.exports = router;
