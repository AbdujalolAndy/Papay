const Member = require("../models/Member");
const restaurantController = module.exports;

restaurantController.getMyRestaurantData = async (req, res) => {
  try {
    console.log("GET: cont/getMyRestaurantData");
    //TODO Get my retaurant products

    res.render("restaurant-menu");
  } catch (err) {
    console.log("ERROR: cont/getMyRestaurantData", err.message);
    res.json({ state: "fail", message: err.message });
  }
};

restaurantController.getSignupMyRestaurant = async (req, res) => {
  try {
    console.log("GET: cont/getSignupMyRestaurant");
    res.render("signup");
  } catch (err) {
    console.log("ERROR: cont/getSignupMyRestaurant", err.message);
    res.json({ state: "fail", message: err.message });
  }
};
restaurantController.signupProcess = async (req, res) => {
  try {
    console.log("POST: const/signup");
    const new_member = new Member();
    const result = await new_member.signupData(req.body);

    req.session.member = result;
    res.redirect("/resto/products/menu");
  } catch (err) {
    console.log("ERROR: cont/signup", err);
    res.json({ state: "fail", message: err.message });
  }
};

restaurantController.getLoginMyRestaurant = async (req, res) => {
  try {
    console.log("GET: cont/getLoginMyRestaurant");
    res.render("login-page");
  } catch (err) {
    console.log("ERROR: cont/login", err);
    res.json({ state: "fail", message: err.message });
  }
};
restaurantController.loginProcess = async (req, res) => {
  try {
    console.log("POST: const/signup");
    const new_member = new Member();
    const result = await new_member.loginData(req.body);

    req.session.member = result;
    req.session.save(() => {
      res.redirect("/resto/products/menu");
    });
  } catch (err) {
    console.log("ERROR: cont/login", err);
    res.json({ state: "fail", message: err.message });
  }
};

restaurantController.logout = (req, res) => {
  console.log("GET: cont/logout");
  req.send("You are loged out");
};

restaurantController.checkSessions = (req, res) => {
  if (req.session.member) {
    res.json({ state: "succeed", data: req.session.member });
  } else {
    res.json({ state: "failed", message: "You are not authenticated" });
  }
};
