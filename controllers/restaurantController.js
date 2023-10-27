const Member = require("../models/Member");
const restaurantController = module.exports;
const Product = require("../models/Product");

restaurantController.home = async (req, res) => {
  try {
    console.log("GET: cont/home");
    res.render("home-page");
  } catch (err) {
    console.log("ERROR: cont/home", err.message);
    res.json({ state: "fail", message: err.message });
  }
};

restaurantController.getMyRestaurantProducts = async (req, res) => {
  try {
    console.log("GET: cont/getMyRestaurantData");
    const product = new Product();
    const data = await product.getAllProductsDataResto(res.locals.member);
    res.render("restaurant-menu", { restaurant_data: data });
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
    console.log("POST: const/signupProcess");
    const new_member = new Member();
    const result = await new_member.signupData(req.body);

    req.session.member = result;
    res.redirect("/resto/products/menu");
  } catch (err) {
    console.log("ERROR: cont/signupProcess", err);
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
    console.log("POST: const/loginProcess");
    const new_member = new Member();
    const result = await new_member.loginData(req.body);

    req.session.member = result;
    req.session.save(() => {
      result.mb_type == "ADMIN"
        ? res.redirect("/resto/all-restaurant")
        : res.redirect("/resto/products/menu");
    });
  } catch (err) {
    console.log("ERROR: cont/loginProcess", err);
    res.json({ state: "fail", message: err.message });
  }
};

restaurantController.logout = (req, res) => {
  console.log("GET: cont/logout");
  req.send("You are loged out");
};

restaurantController.validateAuthRestaurant = async (req, res, next) => {
  try {
    if (req.session.member.mb_type == "RESTAURANT") {
      req.member = req.session.member;
      next();
    }
  } catch (err) {
    res.json({
      state: "fail",
      message: "only authenticated members with restaurant type",
    });
  }
};

restaurantController.checkSessions = (req, res) => {
  if (req.session.member) {
    res.json({ state: "succeed", data: req.session.member });
  } else {
    res.json({ state: "failed", message: "You are not authenticated" });
  }
};
