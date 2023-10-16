const router = require("express").Router();
const memberController = require("./controllers/memberController");

/*************************
 *      Restful API      *
 *************************/
//Member Controller
router.post("/signup", memberController.signup);
router.post("/login", memberController.login);
router.get("/logout", memberController.logout);

//Other Controllers
router.get("/menu", (req, res) => {
  res.send("This is Menu Page");
});

router.get("/community", (req, res) => {
  res.send("This is Community Page");
});

module.exports = router;
