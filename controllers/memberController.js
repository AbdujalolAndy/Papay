const memberController = module.exports;

memberController.home = (req, res) => {
  console.log("GET cont.home");
  res.send("Siz Home Page dasiz");
};

memberController.signup = (req, res) => {
  console.log("POST cont.signup");
  res.send("Siz SignUp page dasiz");
};

memberController.login = (req, res) => {
  console.log("POST const.signup");
  res.send("Siz SignUp Page dasiz");
};

memberController.logout = (req, res) => {
  console.log("GET const.logout");
  res.send("Siz LogOut Page dasiz");
};
