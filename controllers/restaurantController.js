const Definer = require("../lib/mistakes");
const Member = require("../models/Member");
const restaurantController = module.exports;
const Product = require("../models/Product");
const assert = require("assert");
const Restaurant = require("../models/Restaurant")

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
    const data = await product.getAllProductsDataResto(req.member);
    res.render("restaurant-menu", { restaurant_data: data });
  } catch (err) {
    console.log("ERROR: cont/getMyRestaurantData", err.message);
    res.redirect("/resto");
  }
};

restaurantController.getSignupMyRestaurant = async (req, res) => {
  try {
    console.log("GET: cont/getSignupMyRestaurant");
    res.render("sign-up");
  } catch (err) {
    console.log("ERROR: cont/getSignupMyRestaurant", err.message);
    res.json({ state: "fail", message: err.message });
  }
};
restaurantController.signupProcess = async (req, res) => {
  try {
    console.log("POST: const/signupProcess");
    assert.ok(req.file, Definer.general_err3);

    const new_member = req.body;
    new_member.mb_type = "RESTAURANT";
    new_member.mb_image = req.file.path;

    const member = new Member();
    const result = await member.signupData(new_member);
    assert.ok(result, Definer.general_err1);

    req.session.member = result;
    res.redirect("/resto/products/menu");
  } catch (err) {
    console.log("ERROR: cont/signupProcess", err);
    const html = `<script>
                    alert("DataBase  Error: Dublicated Restaurant!");
                    window.location.replace("/resto/sign-up")  
                  </script>`
    res.end(html);
  }
};

restaurantController.getLoginMyRestaurant = async (req, res) => {
  try {
    console.log("GET: cont/getLoginMyRestaurant");
    res.render("login-page");
  } catch (err) {
    console.log("ERROR: cont/getLoginMyRestaurant", err);
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
        ? res.redirect("/resto/all-restaurants")
        : res.redirect("/resto/products/menu");
    });
  } catch (err) {
    console.log("ERROR: cont/loginProcess", err);
    res.json({ state: "fail", message: err.message });
  }
};

restaurantController.logout = async (req, res) => {
  try {
    console.log("GET: cont/logout");
    req.session.destroy(() => {
      res.redirect("/resto");
    });
  } catch (err) {
    console.log("GET: cont/logout");
    res.json({ state: "fail", message: err.message });
  }
};

restaurantController.validateAuthRestaurant = async (req, res, next) => {
  try {
    if (req.session?.member?.mb_type == "RESTAURANT") {
      req.member = req.session.member;
      next();
    } else {
      throw err;
    }
  } catch (err) {
    res.json({
      state: "fail",
      message: "only authenticated members with restaurant type",
    });
  }
};

restaurantController.getAllRestaurants = async (req, res) => {
  try {
    console.log("GET: cont/getAllRestaurants");
    const restaurant = new Restaurant();
    const restaurants_data = await restaurant.getRestaurantData();
    res.render("all-restaurants", { restaurants_data});
  } catch (err) {
    console.log("ERROR: cont/getAllRestaurants");
    res.json({ state: "fail", message: err.message });
  }
};

restaurantController.updateRestaurantByAdmin = async(req, res)=>{
  try{
    console.log("POST: cont/updateRestaurantByAdmin");
    const new_data = req.body;
    const restaurant = new Restaurant();
    const result = await restaurant.updateRestaurantByAdmin(new_data);
    await res.json({state:"sucess", data:result})

  }catch(err){
    console.log("ERROR: cont/updateRestaurantByAdmin")
  }
}

restaurantController.validateAdmin = async (req, res, next) => {
  if (req.session?.member?.mb_type === "ADMIN") {
    req.member = req.session.member;
    next();
  } else {
    const html = `<script>
                    alert("Admin Page: Permission denied!");
                    window.location.replace("/resto");
                  </script>`;
    res.end(html);
  }
};

restaurantController.checkSessions = (req, res) => {
  if (req.session.member) {
    res.json({ state: "succeed", data: req.session.member });
  } else {
    res.json({ state: "failed", message: "You are not authenticated" });
  }
};
