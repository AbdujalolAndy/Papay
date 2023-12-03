const Definer = require("../lib/mistakes");
const Member = require("../models/Member");
const Product = require("../models/Product");
const assert = require("assert");
const Restaurant = require("../models/Restaurant");
const { HttpStatus } = require("../lib/config");

const restaurantController = module.exports;

//Single Page
restaurantController.getRestaurants = async (req, res) => {
  try {
    console.log("GET: cont/getRestaurants");
    const data = req.query;
    const restaurant = new Restaurant();
    const result = await restaurant.getRestaurantsData(req.member, data);
    res.status(HttpStatus.OK).json({ state: "success", data: result });
  } catch (err) {
    console.log("ERROR: cont/getRestaurants", err.message);
    res
      .status(HttpStatus.BAD_REQUEST)
      .json({ state: "fail", message: err.message });
  }
};

restaurantController.getChosenRestaurant = async (req, res) => {
  try {
    console.log("GET: cont/getChosenRestaurant");
    const id = req.params.id;
    const restaurant = new Restaurant();
    const result = await restaurant.getChosenRestaurantData(req.member, id);
    res.status(HttpStatus.OK).json({ state: "success", data: result });
  } catch (err) {
    console.log("ERROR: cont/getChosenRestaurant");
    res
      .status(HttpStatus.BAD_REQUEST)
      .json({ state: "fail", message: err.message });
  }
};

//BSSR
restaurantController.home = async (req, res) => {
  try {
    console.log("GET: cont/home");
    res.status(HttpStatus.OK).render("home-page");
  } catch (err) {
    console.log("ERROR: cont/home", err.message);
    res
      .status(HttpStatus.NOT_FOUND)
      .json({ state: "fail", message: err.message });
  }
};

restaurantController.getMyRestaurantProducts = async (req, res) => {
  try {
    console.log("GET: cont/getMyRestaurantData");
    const product = new Product();
    const data = await product.getAllProductsDataResto(req.member);
    res
      .status(HttpStatus.OK)
      .render("restaurant-menu", { restaurant_data: data });
  } catch (err) {
    console.log("ERROR: cont/getMyRestaurantData", err.message);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).redirect("/resto");
  }
};

restaurantController.getSignupMyRestaurant = async (req, res) => {
  try {
    console.log("GET: cont/getSignupMyRestaurant");
    res.status(HttpStatus.OK).render("sign-up");
  } catch (err) {
    console.log("ERROR: cont/getSignupMyRestaurant", err.message);
    res
      .status(HttpStatus.NOT_FOUND)
      .json({ state: "fail", message: err.message });
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
    res.status(HttpStatus.OK).redirect("/resto/products/menu");
  } catch (err) {
    console.log("ERROR: cont/signupProcess", err);
    const html = `<script>
                    alert("DataBase  Error: Dublicated Restaurant!");
                    window.location.replace("/resto/sign-up")  
                  </script>`;
    res.status(HttpStatus.BAD_REQUEST).end(html);
  }
};

restaurantController.getLoginMyRestaurant = async (req, res) => {
  try {
    console.log("GET: cont/getLoginMyRestaurant");
    res.status(HttpStatus.OK).render("login-page");
  } catch (err) {
    console.log("ERROR: cont/getLoginMyRestaurant", err);
    res
      .status(HttpStatus.NOT_FOUND)
      .json({ state: "fail", message: err.message });
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
        ? res.status(HttpStatus.OK).redirect("/resto/all-restaurants")
        : res.status(HttpStatus.OK).redirect("/resto/products/menu");
    });
  } catch (err) {
    console.log("ERROR: cont/loginProcess", err);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ state: "fail", message: err.message });
  }
};

restaurantController.logout = async (req, res) => {
  try {
    console.log("GET: cont/logout");
    req.session.destroy(() => {
      res.status(HttpStatus.OK).redirect("/resto");
    });
  } catch (err) {
    console.log("GET: cont/logout");
    res
      .status(HttpStatus.NOT_FOUND)
      .json({ state: "fail", message: err.message });
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
    res.status(HttpStatus.UNAUTHORIZED).json({
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
    res.status(HttpStatus.OK).render("all-restaurants", { restaurants_data });
  } catch (err) {
    console.log("ERROR: cont/getAllRestaurants");
    res
      .status(HttpStatus.NOT_FOUND)
      .json({ state: "fail", message: err.message });
  }
};

restaurantController.updateRestaurantByAdmin = async (req, res) => {
  try {
    console.log("POST: cont/updateRestaurantByAdmin");
    const new_data = req.body;
    const restaurant = new Restaurant();
    const result = await restaurant.updateRestaurantByAdmin(new_data);
    await res.status(HttpStatus.OK).json({ state: "sucess", data: result });
  } catch (err) {
    console.log("ERROR: cont/updateRestaurantByAdmin");
    res
      .status(HttpStatus.BAD_REQUEST)
      .json({ state: "fail", message: err.message });
  }
};

restaurantController.validateAdmin = async (req, res, next) => {
  if (req.session?.member?.mb_type === "ADMIN") {
    req.member = req.session.member;
    next();
  } else {
    const html = `<script>
                    alert("Admin Page: Permission denied!");
                    window.location.replace("/resto");
                  </script>`;
    res.status(HttpStatus.BAD_REQUEST).end(html);
  }
};

restaurantController.checkSessions = (req, res) => {
  if (req.session.member) {
    res
      .status(HttpStatus.OK)
      .json({ state: "success", data: req.session.member });
  } else {
    res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ state: "failed", message: "You are not authenticated" });
  }
};
