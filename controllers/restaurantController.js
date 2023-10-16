const restaurantController = module.exports;

restaurantController.getSignupMyRestaurant = async (req, res) => {
  try {
    console.log("GET: cont/getSignupMyRestaurant");
    res.render("signup");
  } catch (err) {
    console.log("ERROR: cont/getSignupMyRestaurant", err);
    res.json({ state: "fail", message: err.message });
  }
};
restaurantController.signupProcess = async (req, res) => {
  try {
    res.remder('signup')
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
    console.log("ERROR: cont/signup", err);
    res.json({ state: "fail", message: err.message });
  }
};
restaurantController.loginProcess = async (req, res) => {
  try {
    res.render('login-page')
  } catch (err) {
    console.log("ERROR: cont/signup", err);
    res.json({ state: "fail", message: err.message });
  }
};

restaurantController.logout = (req, res) => {
  console.log("GET: cont/logout");
  req.send("You are loged out");
};
